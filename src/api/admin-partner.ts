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

// Update job (basic fields + new detail fields)
adminPartnerApi.put('/jobs/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    status?: string; title?: string; description?: string; vehicle_type?: string;
    device_type?: string; location?: string; preferred_date?: string; budget?: string;
    tracking_number?: string; maker_name?: string; car_model?: string; car_model_code?: string;
    work_report?: string; general_memo?: string
  }>()
  const j = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first<any>()
  if (!j) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE jobs SET title=?, description=?, vehicle_type=?, device_type=?, location=?, preferred_date=?, budget=?, status=?, tracking_number=?, maker_name=?, car_model=?, car_model_code=?, work_report=?, general_memo=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.title ?? j.title, body.description ?? j.description, body.vehicle_type ?? j.vehicle_type,
    body.device_type ?? j.device_type, body.location ?? j.location, body.preferred_date ?? j.preferred_date,
    body.budget ?? j.budget, body.status ?? j.status,
    body.tracking_number ?? j.tracking_number, body.maker_name ?? j.maker_name,
    body.car_model ?? j.car_model, body.car_model_code ?? j.car_model_code,
    body.work_report ?? j.work_report, body.general_memo ?? j.general_memo, id
  ).run()
  return c.json({ success: true })
})

// Get single job detail (with photos metadata)
adminPartnerApi.get('/jobs/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const j = await c.env.DB.prepare(
    "SELECT j.*, p.company_name, p.representative_name, p.email as partner_email FROM jobs j LEFT JOIN partners p ON j.partner_id = p.id WHERE j.id = ?"
  ).bind(id).first()
  if (!j) return c.json({ error: 'Not found' }, 404)
  const photos = await c.env.DB.prepare(
    "SELECT id, job_id, category, mime_type, file_name, caption, uploaded_by, created_at FROM job_photos WHERE job_id = ? ORDER BY category, created_at"
  ).bind(id).all()
  return c.json({ job: j, photos: photos.results })
})

// Get job photo data (individual)
adminPartnerApi.get('/jobs/:id/photos/:photoId', async (c) => {
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))
  const photo = await c.env.DB.prepare("SELECT * FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).first<any>()
  if (!photo) return c.json({ error: 'Photo not found' }, 404)
  return c.json({ photo })
})

// Admin can also upload photos
adminPartnerApi.post('/jobs/:id/photos', async (c) => {
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ?").bind(id).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    category: string; photo_data: string; mime_type?: string; file_name?: string; caption?: string
  }>()

  const validCategories = ['caution_plate','pre_install','power_source','ground_point','completed','claim_caution_plate','claim_fault','claim_repair','other']
  if (!body.category || !validCategories.includes(body.category)) return c.json({ error: 'Invalid category' }, 400)
  if (!body.photo_data) return c.json({ error: 'photo_data required' }, 400)
  if (body.photo_data.length > 7_000_000) return c.json({ error: 'File too large' }, 400)

  const r = await c.env.DB.prepare(
    "INSERT INTO job_photos (job_id, category, photo_data, mime_type, file_name, caption, uploaded_by) VALUES (?,?,?,?,?,?,?)"
  ).bind(id, body.category, body.photo_data, body.mime_type || 'image/jpeg', body.file_name || '', body.caption || '', 'admin').run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// Delete photo (admin)
adminPartnerApi.delete('/jobs/:id/photos/:photoId', async (c) => {
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))
  const r = await c.env.DB.prepare("DELETE FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// Update job tracking statuses (shared between admin & partner)
adminPartnerApi.put('/jobs/:id/tracking', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    shipping_status?: string; shipped_at?: string; received_at?: string;
    schedule_status?: string; confirmed_work_date?: string;
    work_status?: string; work_completed_at?: string;
    status_note?: string
  }>()
  const j = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first<any>()
  if (!j) return c.json({ error: 'Not found' }, 404)

  const shippingValid = ['not_shipped', 'shipped', 'received']
  const scheduleValid = ['not_started', 'contacting', 'waiting_callback', 'date_confirmed']
  const workValid = ['scheduling', 'completed', 'user_postponed', 'self_postponed', 'maker_postponed', 'cancelled']

  if (body.shipping_status && !shippingValid.includes(body.shipping_status)) return c.json({ error: 'Invalid shipping_status' }, 400)
  if (body.schedule_status && !scheduleValid.includes(body.schedule_status)) return c.json({ error: 'Invalid schedule_status' }, 400)
  if (body.work_status && !workValid.includes(body.work_status)) return c.json({ error: 'Invalid work_status' }, 400)

  // Auto-set timestamps
  let shippedAt = body.shipped_at ?? j.shipped_at
  let receivedAt = body.received_at ?? j.received_at
  let workCompletedAt = body.work_completed_at ?? j.work_completed_at
  if (body.shipping_status === 'shipped' && !j.shipped_at && !body.shipped_at) shippedAt = new Date().toISOString()
  if (body.shipping_status === 'received' && !j.received_at && !body.received_at) receivedAt = new Date().toISOString()
  if (body.work_status === 'completed' && !j.work_completed_at && !body.work_completed_at) workCompletedAt = new Date().toISOString()

  await c.env.DB.prepare(
    `UPDATE jobs SET shipping_status=?, shipped_at=?, received_at=?, schedule_status=?, confirmed_work_date=?, work_status=?, work_completed_at=?, status_note=?, last_status_updated_by='admin', last_status_updated_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.shipping_status ?? j.shipping_status, shippedAt, receivedAt,
    body.schedule_status ?? j.schedule_status, body.confirmed_work_date ?? j.confirmed_work_date,
    body.work_status ?? j.work_status, workCompletedAt,
    body.status_note ?? j.status_note, id
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
