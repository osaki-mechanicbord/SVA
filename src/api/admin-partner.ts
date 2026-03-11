import { Hono } from 'hono'

type Bindings = { DB: D1Database }
const adminPartnerApi = new Hono<{ Bindings: Bindings }>()

// Auth middleware (reuse same Bearer token pattern as admin articles)
adminPartnerApi.use('*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)
  await next()
})

// ===================== Partners CRUD =====================

// List partners
adminPartnerApi.get('/partners', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20
  const offset = (page - 1) * limit
  const search = c.req.query('search') || ''
  const rank = c.req.query('rank') || ''

  let where = '1=1'
  const params: any[] = []
  if (search) { where += " AND (company_name LIKE ? OR representative_name LIKE ? OR email LIKE ?)"; const s = '%' + search + '%'; params.push(s, s, s); }
  if (rank) { where += " AND rank = ?"; params.push(rank); }

  const countQ = `SELECT COUNT(*) as total FROM partners WHERE ${where}`
  const dataQ = `SELECT id, email, company_name, representative_name, phone, region, specialties, rank, status, notes, last_login_at, created_at FROM partners WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`

  const [cnt, data] = await Promise.all([
    c.env.DB.prepare(countQ).bind(...params).first<{ total: number }>(),
    c.env.DB.prepare(dataQ).bind(...params, limit, offset).all()
  ])
  const total = cnt?.total || 0
  return c.json({ partners: data.results, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

// Get single partner
adminPartnerApi.get('/partners/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const p = await c.env.DB.prepare("SELECT * FROM partners WHERE id = ?").bind(id).first()
  if (!p) return c.json({ error: 'Not found' }, 404)
  // Get stats
  const [jobCount, msgCount] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as c FROM jobs WHERE partner_id = ?").bind(id).first<{ c: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM messages WHERE partner_id = ?").bind(id).first<{ c: number }>()
  ])
  return c.json({ partner: p, stats: { jobs: jobCount?.c || 0, messages: msgCount?.c || 0 } })
})

// Update partner (rank, status, notes, profile)
adminPartnerApi.put('/partners/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    company_name?: string; representative_name?: string; phone?: string;
    region?: string; specialties?: string; rank?: string; status?: string; notes?: string
  }>()
  const p = await c.env.DB.prepare("SELECT * FROM partners WHERE id = ?").bind(id).first()
  if (!p) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE partners SET company_name=?, representative_name=?, phone=?, region=?, specialties=?, rank=?, status=?, notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.company_name ?? p.company_name, body.representative_name ?? p.representative_name,
    body.phone ?? p.phone, body.region ?? p.region, body.specialties ?? p.specialties,
    body.rank ?? p.rank, body.status ?? p.status, body.notes ?? p.notes, id
  ).run()
  return c.json({ success: true })
})

// Delete partner
adminPartnerApi.delete('/partners/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare("DELETE FROM partners WHERE id = ?").bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// Create partner (admin can create accounts)
adminPartnerApi.post('/partners', async (c) => {
  const body = await c.req.json<{
    email: string; password: string; company_name?: string;
    representative_name?: string; phone?: string; region?: string; specialties?: string; rank?: string
  }>()
  if (!body.email || !body.password) return c.json({ error: 'email and password required' }, 400)

  const exists = await c.env.DB.prepare("SELECT id FROM partners WHERE email = ?").bind(body.email).first()
  if (exists) return c.json({ error: 'このメールアドレスは既に登録されています' }, 409)

  const encoder = new TextEncoder()
  const hashBuf = await crypto.subtle.digest('SHA-256', encoder.encode(body.password))
  const hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

  const r = await c.env.DB.prepare(
    `INSERT INTO partners (email, password_hash, company_name, representative_name, phone, region, specialties, rank) VALUES (?,?,?,?,?,?,?,?)`
  ).bind(body.email, hash, body.company_name || '', body.representative_name || '', body.phone || '', body.region || '', body.specialties || '', body.rank || 'standard').run()

  return c.json({ id: r.meta.last_row_id }, 201)
})

// ===================== Messages =====================

// List messages for a partner
adminPartnerApi.get('/partners/:id/messages', async (c) => {
  const partnerId = Number(c.req.param('id'))
  const msgs = await c.env.DB.prepare(
    "SELECT * FROM messages WHERE partner_id = ? ORDER BY created_at DESC LIMIT 100"
  ).bind(partnerId).all()
  return c.json({ messages: msgs.results })
})

// Send message to partner
adminPartnerApi.post('/partners/:id/messages', async (c) => {
  const partnerId = Number(c.req.param('id'))
  const { subject, body } = await c.req.json<{ subject: string; body: string }>()
  if (!subject || !body) return c.json({ error: 'subject and body required' }, 400)

  const p = await c.env.DB.prepare("SELECT id FROM partners WHERE id = ?").bind(partnerId).first()
  if (!p) return c.json({ error: 'Partner not found' }, 404)

  const r = await c.env.DB.prepare(
    "INSERT INTO messages (partner_id, direction, subject, body) VALUES (?, 'to_partner', ?, ?)"
  ).bind(partnerId, subject, body).run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// ===================== Jobs (案件依頼) =====================

// List jobs (all or by partner)
adminPartnerApi.get('/jobs', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20
  const offset = (page - 1) * limit
  const partnerId = c.req.query('partner_id') || ''
  const status = c.req.query('status') || ''

  let where = '1=1'
  const params: any[] = []
  if (partnerId) { where += ' AND j.partner_id = ?'; params.push(Number(partnerId)); }
  if (status) { where += ' AND j.status = ?'; params.push(status); }

  const countQ = `SELECT COUNT(*) as total FROM jobs j WHERE ${where}`
  const dataQ = `SELECT j.*, p.company_name, p.representative_name, p.email as partner_email FROM jobs j LEFT JOIN partners p ON j.partner_id = p.id WHERE ${where} ORDER BY j.created_at DESC LIMIT ? OFFSET ?`

  const [cnt, data] = await Promise.all([
    c.env.DB.prepare(countQ).bind(...params).first<{ total: number }>(),
    c.env.DB.prepare(dataQ).bind(...params, limit, offset).all()
  ])
  return c.json({ jobs: data.results, pagination: { page, limit, total: cnt?.total || 0, totalPages: Math.ceil((cnt?.total || 0) / limit) } })
})

// Create job (send to partner)
adminPartnerApi.post('/jobs', async (c) => {
  const body = await c.req.json<{
    partner_id: number; title: string; description?: string; vehicle_type?: string;
    device_type?: string; location?: string; preferred_date?: string; budget?: string
  }>()
  if (!body.partner_id || !body.title) return c.json({ error: 'partner_id and title required' }, 400)

  const p = await c.env.DB.prepare("SELECT id FROM partners WHERE id = ?").bind(body.partner_id).first()
  if (!p) return c.json({ error: 'Partner not found' }, 404)

  const r = await c.env.DB.prepare(
    `INSERT INTO jobs (partner_id, title, description, vehicle_type, device_type, location, preferred_date, budget) VALUES (?,?,?,?,?,?,?,?)`
  ).bind(body.partner_id, body.title, body.description || '', body.vehicle_type || '', body.device_type || '', body.location || '', body.preferred_date || '', body.budget || '').run()

  // Auto-send notification message
  await c.env.DB.prepare(
    "INSERT INTO messages (partner_id, direction, subject, body) VALUES (?, 'to_partner', ?, ?)"
  ).bind(body.partner_id, '新しい案件が届きました: ' + body.title,
    '新しい案件依頼が届きました。マイページの「案件一覧」からご確認ください。\n\n案件名: ' + body.title + '\n場所: ' + (body.location || '未定') + '\n車両: ' + (body.vehicle_type || '-') + '\n装置: ' + (body.device_type || '-')
  ).run()

  return c.json({ id: r.meta.last_row_id }, 201)
})

// Update job status
adminPartnerApi.put('/jobs/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ status?: string; title?: string; description?: string; vehicle_type?: string; device_type?: string; location?: string; preferred_date?: string; budget?: string }>()
  const j = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first()
  if (!j) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE jobs SET title=?, description=?, vehicle_type=?, device_type=?, location=?, preferred_date=?, budget=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.title ?? j.title, body.description ?? j.description, body.vehicle_type ?? j.vehicle_type,
    body.device_type ?? j.device_type, body.location ?? j.location, body.preferred_date ?? j.preferred_date,
    body.budget ?? j.budget, body.status ?? j.status, id
  ).run()
  return c.json({ success: true })
})

// Delete job
adminPartnerApi.delete('/jobs/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare("DELETE FROM jobs WHERE id = ?").bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

export { adminPartnerApi }
