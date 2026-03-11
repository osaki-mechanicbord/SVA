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

// List jobs (all or by partner) - supports job_number search
adminPartnerApi.get('/jobs', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20
  const offset = (page - 1) * limit
  const partnerId = c.req.query('partner_id') || ''
  const status = c.req.query('status') || ''
  const search = c.req.query('search') || ''

  let where = '1=1'
  const params: any[] = []
  if (partnerId) { where += ' AND j.partner_id = ?'; params.push(Number(partnerId)); }
  if (status) { where += ' AND j.status = ?'; params.push(status); }
  if (search) { where += ' AND (j.job_number LIKE ? OR j.title LIKE ? OR p.company_name LIKE ?)'; const s = '%' + search + '%'; params.push(s, s, s); }

  const countQ = `SELECT COUNT(*) as total FROM jobs j LEFT JOIN partners p ON j.partner_id = p.id WHERE ${where}`
  const dataQ = `SELECT j.*, p.company_name, p.representative_name, p.email as partner_email,
    (SELECT COUNT(*) FROM job_vehicles WHERE job_id = j.id) as vehicle_count,
    (SELECT COUNT(*) FROM job_vehicles WHERE job_id = j.id AND status = 'completed') as vehicle_done_count,
    (SELECT COUNT(*) FROM vehicle_products vp JOIN job_vehicles jv ON vp.vehicle_id = jv.id WHERE jv.job_id = j.id) as product_count,
    (SELECT COUNT(*) FROM job_photos WHERE job_id = j.id) as photo_count
    FROM jobs j LEFT JOIN partners p ON j.partner_id = p.id WHERE ${where} ORDER BY j.created_at DESC LIMIT ? OFFSET ?`

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
    device_type?: string; location?: string; preferred_date?: string; budget?: string;
    job_number?: string;
    client_company?: string; client_branch?: string; client_contact_name?: string;
    client_contact_phone?: string; client_contact_email?: string;
    work_location_detail?: string; work_datetime?: string; vehicle_count?: number;
    urgent_contact_note?: string;
    products_maker?: string; products_customer?: string; products_partner?: string; products_local?: string;
    cost_labor?: number; cost_travel?: number; cost_other?: number; cost_preliminary?: number; cost_memo?: string
  }>()
  if (!body.partner_id || !body.title) return c.json({ error: 'partner_id and title required' }, 400)

  const p = await c.env.DB.prepare("SELECT id FROM partners WHERE id = ?").bind(body.partner_id).first()
  if (!p) return c.json({ error: 'Partner not found' }, 404)

  const r = await c.env.DB.prepare(
    `INSERT INTO jobs (partner_id, title, description, vehicle_type, device_type, location, preferred_date, budget, job_number, client_company, client_branch, client_contact_name, client_contact_phone, client_contact_email, work_location_detail, work_datetime, vehicle_count, urgent_contact_note, products_maker, products_customer, products_partner, products_local, cost_labor, cost_travel, cost_other, cost_preliminary, cost_memo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(body.partner_id, body.title, body.description||'', body.vehicle_type||'', body.device_type||'', body.location||'', body.preferred_date||'', body.budget||'', body.job_number||'', body.client_company||'', body.client_branch||'', body.client_contact_name||'', body.client_contact_phone||'', body.client_contact_email||'', body.work_location_detail||'', body.work_datetime||'', body.vehicle_count||0, body.urgent_contact_note||'', body.products_maker||'', body.products_customer||'', body.products_partner||'', body.products_local||'', body.cost_labor||0, body.cost_travel||0, body.cost_other||0, body.cost_preliminary||0, body.cost_memo||'').run()

  // Auto-send notification message
  await c.env.DB.prepare(
    "INSERT INTO messages (partner_id, direction, subject, body) VALUES (?, 'to_partner', ?, ?)"
  ).bind(body.partner_id, '新しい案件が届きました: ' + body.title,
    '新しい案件依頼が届きました。マイページの「案件一覧」からご確認ください。\n\n案件名: ' + body.title + '\n場所: ' + (body.location || '未定') + '\n車両: ' + (body.vehicle_type || '-') + '\n装置: ' + (body.device_type || '-')
  ).run()

  return c.json({ id: r.meta.last_row_id }, 201)
})

// Update job (basic fields + client details + costs)
adminPartnerApi.put('/jobs/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    status?: string; title?: string; description?: string; vehicle_type?: string;
    device_type?: string; location?: string; preferred_date?: string; budget?: string;
    tracking_number?: string; maker_name?: string; car_model?: string; car_model_code?: string;
    work_report?: string; general_memo?: string; job_number?: string;
    client_company?: string; client_branch?: string; client_contact_name?: string;
    client_contact_phone?: string; client_contact_email?: string;
    work_location_detail?: string; work_datetime?: string; vehicle_count?: number;
    urgent_contact_note?: string;
    products_maker?: string; products_customer?: string; products_partner?: string; products_local?: string;
    cost_labor?: number; cost_travel?: number; cost_other?: number; cost_preliminary?: number; cost_memo?: string
  }>()
  const j = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(id).first<any>()
  if (!j) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE jobs SET title=?, description=?, vehicle_type=?, device_type=?, location=?, preferred_date=?, budget=?, status=?, tracking_number=?, maker_name=?, car_model=?, car_model_code=?, work_report=?, general_memo=?, job_number=?, client_company=?, client_branch=?, client_contact_name=?, client_contact_phone=?, client_contact_email=?, work_location_detail=?, work_datetime=?, vehicle_count=?, urgent_contact_note=?, products_maker=?, products_customer=?, products_partner=?, products_local=?, cost_labor=?, cost_travel=?, cost_other=?, cost_preliminary=?, cost_memo=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.title ?? j.title, body.description ?? j.description, body.vehicle_type ?? j.vehicle_type,
    body.device_type ?? j.device_type, body.location ?? j.location, body.preferred_date ?? j.preferred_date,
    body.budget ?? j.budget, body.status ?? j.status,
    body.tracking_number ?? j.tracking_number, body.maker_name ?? j.maker_name,
    body.car_model ?? j.car_model, body.car_model_code ?? j.car_model_code,
    body.work_report ?? j.work_report, body.general_memo ?? j.general_memo,
    body.job_number ?? j.job_number,
    body.client_company ?? j.client_company, body.client_branch ?? j.client_branch,
    body.client_contact_name ?? j.client_contact_name, body.client_contact_phone ?? j.client_contact_phone,
    body.client_contact_email ?? j.client_contact_email, body.work_location_detail ?? j.work_location_detail,
    body.work_datetime ?? j.work_datetime, body.vehicle_count ?? j.vehicle_count,
    body.urgent_contact_note ?? j.urgent_contact_note,
    body.products_maker ?? j.products_maker, body.products_customer ?? j.products_customer,
    body.products_partner ?? j.products_partner, body.products_local ?? j.products_local,
    body.cost_labor ?? j.cost_labor, body.cost_travel ?? j.cost_travel,
    body.cost_other ?? j.cost_other, body.cost_preliminary ?? j.cost_preliminary,
    body.cost_memo ?? j.cost_memo, id
  ).run()
  return c.json({ success: true })
})

// Get single job detail (with vehicles, products, photos)
adminPartnerApi.get('/jobs/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const j = await c.env.DB.prepare(
    "SELECT j.*, p.company_name, p.representative_name, p.email as partner_email FROM jobs j LEFT JOIN partners p ON j.partner_id = p.id WHERE j.id = ?"
  ).bind(id).first()
  if (!j) return c.json({ error: 'Not found' }, 404)

  // 車両明細+商品+写真カウント
  const vehicles = await c.env.DB.prepare(
    "SELECT * FROM job_vehicles WHERE job_id = ? ORDER BY seq"
  ).bind(id).all()

  const vehicleDetails = await Promise.all((vehicles.results as any[]).map(async (v: any) => {
    const [products, photoCounts] = await Promise.all([
      c.env.DB.prepare("SELECT * FROM vehicle_products WHERE vehicle_id = ? ORDER BY id").bind(v.id).all(),
      c.env.DB.prepare("SELECT category, COUNT(*) as cnt FROM job_photos WHERE vehicle_id = ? GROUP BY category").bind(v.id).all()
    ])
    const photoMap: any = {}
    ;(photoCounts.results as any[]).forEach((r: any) => { photoMap[r.category] = r.cnt })
    return { ...v, products: products.results, photo_counts: photoMap }
  }))

  // 案件全体の写真（vehicle_id IS NULL の旧データ）
  const legacyPhotos = await c.env.DB.prepare(
    "SELECT id, job_id, vehicle_id, category, mime_type, file_name, caption, uploaded_by, created_at FROM job_photos WHERE job_id = ? AND vehicle_id IS NULL ORDER BY category, created_at"
  ).bind(id).all()

  // 添付ファイル一覧（メタデータのみ）
  const attachments = await c.env.DB.prepare(
    "SELECT id, job_id, file_name, mime_type, file_size, description, uploaded_by, created_at FROM job_attachments WHERE job_id = ? ORDER BY created_at DESC"
  ).bind(id).all()

  return c.json({ job: j, vehicles: vehicleDetails, photos: legacyPhotos.results, attachments: attachments.results })
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

// ===================== Vehicle CRUD (admin) =====================

// Add vehicle
adminPartnerApi.post('/jobs/:id/vehicles', async (c) => {
  const jobId = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ?").bind(jobId).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    maker_name?: string; car_model?: string; car_model_code?: string; vehicle_memo?: string
  }>()
  const maxSeq = await c.env.DB.prepare("SELECT MAX(seq) as m FROM job_vehicles WHERE job_id = ?").bind(jobId).first<{m:number}>()
  const seq = (maxSeq?.m || 0) + 1

  const r = await c.env.DB.prepare(
    "INSERT INTO job_vehicles (job_id, seq, maker_name, car_model, car_model_code, vehicle_memo) VALUES (?,?,?,?,?,?)"
  ).bind(jobId, seq, body.maker_name||'', body.car_model||'', body.car_model_code||'', body.vehicle_memo||'').run()
  return c.json({ id: r.meta.last_row_id, seq }, 201)
})

// Update vehicle
adminPartnerApi.put('/jobs/:id/vehicles/:vid', async (c) => {
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const v = await c.env.DB.prepare("SELECT * FROM job_vehicles WHERE id = ? AND job_id = ?").bind(vid, jobId).first<any>()
  if (!v) return c.json({ error: 'Vehicle not found' }, 404)

  const body = await c.req.json<{
    maker_name?: string; car_model?: string; car_model_code?: string;
    vehicle_memo?: string; status?: string; work_report?: string
  }>()
  const validStatuses = ['pending','in_progress','completed','issue']
  if (body.status && !validStatuses.includes(body.status)) return c.json({ error: 'Invalid status' }, 400)

  await c.env.DB.prepare(
    "UPDATE job_vehicles SET maker_name=?, car_model=?, car_model_code=?, vehicle_memo=?, status=?, work_report=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(
    body.maker_name ?? v.maker_name, body.car_model ?? v.car_model, body.car_model_code ?? v.car_model_code,
    body.vehicle_memo ?? v.vehicle_memo, body.status ?? v.status, body.work_report ?? v.work_report, vid
  ).run()
  return c.json({ success: true })
})

// Delete vehicle
adminPartnerApi.delete('/jobs/:id/vehicles/:vid', async (c) => {
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const r = await c.env.DB.prepare("DELETE FROM job_vehicles WHERE id = ? AND job_id = ?").bind(vid, jobId).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ===================== Vehicle Product CRUD (admin) =====================

adminPartnerApi.post('/jobs/:id/vehicles/:vid/products', async (c) => {
  const vid = Number(c.req.param('vid'))
  const v = await c.env.DB.prepare("SELECT id FROM job_vehicles WHERE id = ?").bind(vid).first()
  if (!v) return c.json({ error: 'Vehicle not found' }, 404)

  const body = await c.req.json<{ product_name: string; quantity?: number; serial_number?: string; memo?: string }>()
  if (!body.product_name) return c.json({ error: 'product_name required' }, 400)

  const r = await c.env.DB.prepare(
    "INSERT INTO vehicle_products (vehicle_id, product_name, quantity, serial_number, memo) VALUES (?,?,?,?,?)"
  ).bind(vid, body.product_name, body.quantity||1, body.serial_number||'', body.memo||'').run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

adminPartnerApi.put('/jobs/:id/vehicles/:vid/products/:pid', async (c) => {
  const prodId = Number(c.req.param('pid'))
  const vid = Number(c.req.param('vid'))
  const p = await c.env.DB.prepare("SELECT * FROM vehicle_products WHERE id = ? AND vehicle_id = ?").bind(prodId, vid).first<any>()
  if (!p) return c.json({ error: 'Product not found' }, 404)

  const body = await c.req.json<{ product_name?: string; quantity?: number; serial_number?: string; memo?: string }>()
  await c.env.DB.prepare(
    "UPDATE vehicle_products SET product_name=?, quantity=?, serial_number=?, memo=? WHERE id=?"
  ).bind(body.product_name??p.product_name, body.quantity??p.quantity, body.serial_number??p.serial_number, body.memo??p.memo, prodId).run()
  return c.json({ success: true })
})

adminPartnerApi.delete('/jobs/:id/vehicles/:vid/products/:pid', async (c) => {
  const prodId = Number(c.req.param('pid'))
  const vid = Number(c.req.param('vid'))
  const r = await c.env.DB.prepare("DELETE FROM vehicle_products WHERE id = ? AND vehicle_id = ?").bind(prodId, vid).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// Get vehicle photos (admin)
adminPartnerApi.get('/jobs/:id/vehicles/:vid/photos', async (c) => {
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const photos = await c.env.DB.prepare(
    "SELECT id, job_id, vehicle_id, category, mime_type, file_name, caption, uploaded_by, created_at FROM job_photos WHERE job_id = ? AND vehicle_id = ? ORDER BY category, created_at"
  ).bind(jobId, vid).all()
  return c.json({ photos: photos.results })
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

// ===================== Job Attachments (PDF等) =====================

// Upload attachment (admin)
adminPartnerApi.post('/jobs/:id/attachments', async (c) => {
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ?").bind(id).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    file_name: string; file_data: string; mime_type?: string; description?: string
  }>()
  if (!body.file_name || !body.file_data) return c.json({ error: 'file_name and file_data required' }, 400)

  // Limit ~10MB base64
  if (body.file_data.length > 14_000_000) return c.json({ error: 'ファイルサイズが大きすぎます（10MB以下にしてください）' }, 400)

  const fileSize = Math.round(body.file_data.length * 3 / 4)
  const r = await c.env.DB.prepare(
    "INSERT INTO job_attachments (job_id, file_name, file_data, mime_type, file_size, description, uploaded_by) VALUES (?,?,?,?,?,?,?)"
  ).bind(id, body.file_name, body.file_data, body.mime_type || 'application/pdf', fileSize, body.description || '', 'admin').run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// List attachments
adminPartnerApi.get('/jobs/:id/attachments', async (c) => {
  const id = Number(c.req.param('id'))
  const attachments = await c.env.DB.prepare(
    "SELECT id, job_id, file_name, mime_type, file_size, description, uploaded_by, created_at FROM job_attachments WHERE job_id = ? ORDER BY created_at DESC"
  ).bind(id).all()
  return c.json({ attachments: attachments.results })
})

// Download attachment (get file data)
adminPartnerApi.get('/jobs/:id/attachments/:aid', async (c) => {
  const id = Number(c.req.param('id'))
  const aid = Number(c.req.param('aid'))
  const att = await c.env.DB.prepare("SELECT * FROM job_attachments WHERE id = ? AND job_id = ?").bind(aid, id).first<any>()
  if (!att) return c.json({ error: 'Not found' }, 404)
  return c.json({ attachment: att })
})

// Delete attachment
adminPartnerApi.delete('/jobs/:id/attachments/:aid', async (c) => {
  const id = Number(c.req.param('id'))
  const aid = Number(c.req.param('aid'))
  const r = await c.env.DB.prepare("DELETE FROM job_attachments WHERE id = ? AND job_id = ?").bind(aid, id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
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
