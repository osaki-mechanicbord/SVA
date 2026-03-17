import { Hono } from 'hono'
import { getSupabaseConfig, uploadToSupabase, deleteFromSupabase, generateStoragePath } from './supabase-storage'
import { sendMail, buildJobNotificationEmail } from '../lib/mail'

type Bindings = { DB: D1Database; PHOTOS?: R2Bucket; SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string; SUPABASE_SERVICE_KEY?: string; RESEND_API_KEY?: string }
const adminPartnerApi = new Hono<{ Bindings: Bindings }>()

// Auth middleware - Bearer token required
// Exception: /photos/:id/image endpoints accept ?token= query parameter (for <img src>)
adminPartnerApi.use('*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (auth && auth.startsWith('Bearer ')) {
    await next()
    return
  }
  // <img src="...?token=xxx"> 用: 画像エンドポイントのみクエリトークン許可
  if (c.req.path.endsWith('/image') && c.req.query('token')) {
    await next()
    return
  }
  return c.json({ error: 'Unauthorized' }, 401)
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
  const dataQ = `SELECT id, email, company_name, representative_name, phone, region, specialties, rank, status, notes, postal_code, address, invoice_number, last_login_at, created_at FROM partners WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`

  const [cnt, data] = await Promise.all([
    c.env.DB.prepare(countQ).bind(...params).first<{ total: number }>(),
    c.env.DB.prepare(dataQ).bind(...params, limit, offset).all()
  ])
  const total = cnt?.total || 0
  return c.json({ partners: data.results, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
})

// List partners (all, for dropdown selection - light fields only)
// IMPORTANT: Must be before /partners/:id to avoid route conflict
adminPartnerApi.get('/partners/all', async (c) => {
  const region = c.req.query('region') || ''
  const search = c.req.query('search') || ''
  let where = "status = 'active'"
  const params: any[] = []
  if (region) { where += " AND region LIKE ?"; params.push('%' + region + '%'); }
  if (search) { where += " AND (company_name LIKE ? OR representative_name LIKE ? OR email LIKE ?)"; const s = '%' + search + '%'; params.push(s, s, s); }
  const data = await c.env.DB.prepare(
    `SELECT id, company_name, representative_name, email, phone, region, specialties, rank FROM partners WHERE ${where} ORDER BY company_name ASC LIMIT 200`
  ).bind(...params).all()
  return c.json({ partners: data.results })
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
    region?: string; specialties?: string; rank?: string; status?: string; notes?: string;
    postal_code?: string; address?: string; invoice_number?: string
  }>()
  const p = await c.env.DB.prepare("SELECT * FROM partners WHERE id = ?").bind(id).first()
  if (!p) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    `UPDATE partners SET company_name=?, representative_name=?, phone=?, region=?, specialties=?, rank=?, status=?, notes=?, postal_code=?, address=?, invoice_number=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.company_name ?? p.company_name, body.representative_name ?? p.representative_name,
    body.phone ?? p.phone, body.region ?? p.region, body.specialties ?? p.specialties,
    body.rank ?? p.rank, body.status ?? p.status, body.notes ?? p.notes,
    body.postal_code ?? p.postal_code, body.address ?? p.address, body.invoice_number ?? p.invoice_number, id
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
    representative_name?: string; phone?: string; region?: string; specialties?: string; rank?: string;
    postal_code?: string; address?: string; invoice_number?: string
  }>()
  if (!body.email || !body.password) return c.json({ error: 'email and password required' }, 400)

  const exists = await c.env.DB.prepare("SELECT id FROM partners WHERE email = ?").bind(body.email).first()
  if (exists) return c.json({ error: 'このメールアドレスは既に登録されています' }, 409)

  const encoder = new TextEncoder()
  const hashBuf = await crypto.subtle.digest('SHA-256', encoder.encode(body.password))
  const hash = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('')

  const r = await c.env.DB.prepare(
    `INSERT INTO partners (email, password_hash, company_name, representative_name, phone, region, specialties, rank, postal_code, address, invoice_number) VALUES (?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(body.email, hash, body.company_name || '', body.representative_name || '', body.phone || '', body.region || '', body.specialties || '', body.rank || 'standard', body.postal_code || '', body.address || '', body.invoice_number || '').run()

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
  const area = c.req.query('area') || ''
  const clientName = c.req.query('client_name') || ''
  const productName = c.req.query('product_name') || ''

  let where = '1=1'
  const params: any[] = []
  if (partnerId) { where += ' AND j.partner_id = ?'; params.push(Number(partnerId)); }
  if (status) { where += ' AND j.status = ?'; params.push(status); }
  if (search) {
    where += ' AND (j.job_number LIKE ? OR j.title LIKE ? OR p.company_name LIKE ? OR p.representative_name LIKE ? OR j.client_contact_name LIKE ? OR j.client_company LIKE ?)'
    const s = '%' + search + '%'; params.push(s, s, s, s, s, s)
  }
  if (area) { where += ' AND j.location LIKE ?'; params.push('%' + area + '%'); }
  if (clientName) {
    where += ' AND (j.client_contact_name LIKE ? OR j.client_company LIKE ? OR j.client_branch LIKE ?)'
    const cn = '%' + clientName + '%'; params.push(cn, cn, cn)
  }
  if (productName) {
    where += ' AND EXISTS (SELECT 1 FROM vehicle_products vp JOIN job_vehicles jv ON vp.vehicle_id = jv.id WHERE jv.job_id = j.id AND vp.product_name LIKE ?)'
    params.push('%' + productName + '%')
  }

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

// Create job (send to partner) - supports vehicles[] with nested products
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
    cost_labor?: number; cost_travel?: number; cost_other?: number; cost_preliminary?: number; cost_memo?: string;
    vehicles?: Array<{
      maker_name?: string; car_model?: string; car_model_code?: string; vehicle_memo?: string;
      products?: Array<{ product_name: string; quantity?: number; serial_number?: string; memo?: string }>
    }>
  }>()
  if (!body.partner_id || !body.title) return c.json({ error: 'partner_id and title required' }, 400)

  const p = await c.env.DB.prepare("SELECT id FROM partners WHERE id = ?").bind(body.partner_id).first()
  if (!p) return c.json({ error: 'Partner not found' }, 404)

  // Auto-set vehicle_count from vehicles array if provided
  const vehicleCount = (body.vehicles && body.vehicles.length > 0) ? body.vehicles.length : (body.vehicle_count || 0)

  const r = await c.env.DB.prepare(
    `INSERT INTO jobs (partner_id, title, description, vehicle_type, device_type, location, preferred_date, budget, job_number, client_company, client_branch, client_contact_name, client_contact_phone, client_contact_email, work_location_detail, work_datetime, vehicle_count, urgent_contact_note, products_maker, products_customer, products_partner, products_local, cost_labor, cost_travel, cost_other, cost_preliminary, cost_memo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(body.partner_id, body.title, body.description||'', body.vehicle_type||'', body.device_type||'', body.location||'', body.preferred_date||'', body.budget||'', body.job_number||'', body.client_company||'', body.client_branch||'', body.client_contact_name||'', body.client_contact_phone||'', body.client_contact_email||'', body.work_location_detail||'', body.work_datetime||'', vehicleCount, body.urgent_contact_note||'', body.products_maker||'', body.products_customer||'', body.products_partner||'', body.products_local||'', body.cost_labor||0, body.cost_travel||0, body.cost_other||0, body.cost_preliminary||0, body.cost_memo||'').run()

  const jobId = r.meta.last_row_id as number

  // Insert vehicles and their products
  if (body.vehicles && body.vehicles.length > 0) {
    for (let seq = 0; seq < body.vehicles.length; seq++) {
      const v = body.vehicles[seq]
      const vr = await c.env.DB.prepare(
        "INSERT INTO job_vehicles (job_id, seq, maker_name, car_model, car_model_code, vehicle_memo) VALUES (?,?,?,?,?,?)"
      ).bind(jobId, seq + 1, v.maker_name||'', v.car_model||'', v.car_model_code||'', v.vehicle_memo||'').run()
      const vehicleId = vr.meta.last_row_id as number

      if (v.products && v.products.length > 0) {
        for (const prod of v.products) {
          if (!prod.product_name) continue
          await c.env.DB.prepare(
            "INSERT INTO vehicle_products (vehicle_id, product_name, quantity, serial_number, memo) VALUES (?,?,?,?,?)"
          ).bind(vehicleId, prod.product_name, prod.quantity||1, prod.serial_number||'', prod.memo||'').run()
        }
      }
    }
  }

  // Auto-send notification message
  const vehInfo = vehicleCount > 0 ? '\n車両台数: ' + vehicleCount + '台' : ''
  await c.env.DB.prepare(
    "INSERT INTO messages (partner_id, direction, subject, body) VALUES (?, 'to_partner', ?, ?)"
  ).bind(body.partner_id, '新しい案件が届きました: ' + body.title,
    '新しい案件依頼が届きました。マイページの「案件一覧」からご確認ください。\n\n案件名: ' + body.title + '\n場所: ' + (body.location || '未定') + '\n車両: ' + (body.vehicle_type || '-') + '\n装置: ' + (body.device_type || '-') + vehInfo
  ).run()

  // Send email notification to partner (non-blocking)
  if (c.env.RESEND_API_KEY) {
    const partner = await c.env.DB.prepare(
      "SELECT email, company_name, representative_name FROM partners WHERE id = ?"
    ).bind(body.partner_id).first<{ email: string; company_name: string; representative_name: string }>()

    if (partner?.email) {
      const partnerName = partner.representative_name || partner.company_name || 'パートナー'
      
      // Load email template from DB (if exists)
      let template: any = null
      try {
        template = await c.env.DB.prepare("SELECT * FROM email_templates WHERE template_key = 'job_notification'").first()
      } catch {}
      
      const emailData = buildJobNotificationEmail({
        partnerName,
        jobTitle: body.title,
        jobNumber: body.job_number,
        location: body.location,
        vehicleType: body.vehicle_type,
        deviceType: body.device_type,
        vehicleCount: vehicleCount,
        preferredDate: body.preferred_date,
        urgentNote: body.urgent_contact_note,
      }, template)

      // Fire-and-forget: don't block job creation on email delivery
      c.executionCtx.waitUntil(
        sendMail(c.env.RESEND_API_KEY, {
          to: partner.email,
          subject: emailData.subject,
          html: emailData.html,
        }).then(result => {
          if (!result.success) console.error('Email notification failed for partner', body.partner_id, result.error)
          else console.log('Email notification sent to', partner.email)
        })
      )
    }
  }

  return c.json({ id: jobId }, 201)
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
    "SELECT id, job_id, vehicle_id, category, mime_type, file_name, caption, uploaded_by, created_at, supabase_url FROM job_photos WHERE job_id = ? AND vehicle_id IS NULL ORDER BY category, created_at"
  ).bind(id).all()

  // 添付ファイル一覧（メタデータのみ）
  const attachments = await c.env.DB.prepare(
    "SELECT id, job_id, file_name, mime_type, file_size, description, uploaded_by, created_at FROM job_attachments WHERE job_id = ? ORDER BY created_at DESC"
  ).bind(id).all()

  return c.json({ job: j, vehicles: vehicleDetails, photos: legacyPhotos.results, attachments: attachments.results })
})

// ===================== Photo Gallery API (写真管理) =====================
// IMPORTANT: Static routes MUST come before dynamic :photoId routes

// Get ALL photos for a job (all vehicles + legacy) with metadata
adminPartnerApi.get('/jobs/:id/photos/all', async (c) => {
  const jobId = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id, title, job_number FROM jobs WHERE id = ?").bind(jobId).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const photos = await c.env.DB.prepare(
    `SELECT jp.id, jp.job_id, jp.vehicle_id, jp.category, jp.mime_type, jp.file_name, jp.caption, jp.uploaded_by, jp.created_at, jp.supabase_url,
     jv.seq as vehicle_seq, jv.maker_name as vehicle_maker, jv.car_model as vehicle_model
     FROM job_photos jp LEFT JOIN job_vehicles jv ON jp.vehicle_id = jv.id
     WHERE jp.job_id = ? ORDER BY jp.vehicle_id NULLS FIRST, jp.category, jp.created_at`
  ).bind(jobId).all()
  return c.json({ job, photos: photos.results })
})

// Get photo as binary image (Supabase → R2 → Base64フォールバック)
adminPartnerApi.get('/jobs/:id/photos/:photoId/image', async (c) => {
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))
  const photo = await c.env.DB.prepare(
    "SELECT supabase_url, r2_key, photo_data, mime_type FROM job_photos WHERE id = ? AND job_id = ?"
  ).bind(photoId, id).first<any>()
  if (!photo) return c.notFound()

  // 1. Supabase URL → リダイレクト
  if (photo.supabase_url) {
    return c.redirect(photo.supabase_url, 302)
  }

  // 2. R2から取得
  if (photo.r2_key && c.env.PHOTOS) {
    const obj = await c.env.PHOTOS.get(photo.r2_key)
    if (obj) {
      return new Response(obj.body, {
        headers: {
          'Content-Type': obj.httpMetadata?.contentType || photo.mime_type || 'image/jpeg',
          'Cache-Control': 'public, max-age=604800',
          'ETag': obj.etag
        }
      })
    }
  }

  // 3. Base64フォールバック
  if (photo.photo_data) {
    const binaryStr = atob(photo.photo_data)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i)
    return new Response(bytes, {
      headers: {
        'Content-Type': photo.mime_type || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400'
      }
    })
  }

  return c.notFound()
})

// Get job photo data (individual JSON)
adminPartnerApi.get('/jobs/:id/photos/:photoId', async (c) => {
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))
  const photo = await c.env.DB.prepare("SELECT * FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).first<any>()
  if (!photo) return c.json({ error: 'Photo not found' }, 404)
  return c.json({ photo })
})

// Admin photo upload (Supabase優先 → R2 → Base64フォールバック)
adminPartnerApi.post('/jobs/:id/photos', async (c) => {
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ?").bind(id).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const formData = await c.req.formData()
  const file = formData.get('photo') as File | null
  const category = formData.get('category') as string

  const validCategories = ['caution_plate','pre_install','power_source','ground_point','completed','claim_caution_plate','claim_fault','claim_repair','other']
  if (!category || !validCategories.includes(category)) return c.json({ error: 'Invalid category' }, 400)
  if (!file || !(file instanceof File)) return c.json({ error: 'photo file required' }, 400)
  if (file.size > 25 * 1024 * 1024) return c.json({ error: 'ファイルサイズが大きすぎます（25MB以下）' }, 400)

  const mimeType = file.type || 'image/jpeg'

  // 1. Supabase Storage
  const supaConfig = getSupabaseConfig(c.env)
  if (supaConfig) {
    const storagePath = generateStoragePath(id, category, file.name || 'photo.jpg')
    const result = await uploadToSupabase(supaConfig, storagePath, file.stream(), mimeType)
    if (result.success) {
      const r = await c.env.DB.prepare(
        "INSERT INTO job_photos (job_id, category, photo_data, mime_type, file_name, caption, uploaded_by, r2_key, file_size, supabase_url) VALUES (?,?,'',?,?,?,?,'',?,?)"
      ).bind(id, category, mimeType, file.name || '', '', 'admin', file.size, result.publicUrl).run()
      return c.json({ id: r.meta.last_row_id, url: result.publicUrl }, 201)
    }
    console.error('Supabase upload failed:', result.error)
  }

  // 2. R2
  if (c.env.PHOTOS) {
    const ext = file.name?.split('.').pop()?.toLowerCase() || 'jpg'
    const r2Key = `jobs/${id}/photos/${category}/${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`
    await c.env.PHOTOS.put(r2Key, file.stream(), {
      httpMetadata: { contentType: mimeType },
      customMetadata: { jobId: String(id), category, uploadedBy: 'admin' }
    })
    const r = await c.env.DB.prepare(
      "INSERT INTO job_photos (job_id, category, photo_data, mime_type, file_name, caption, uploaded_by, r2_key, file_size, supabase_url) VALUES (?,?,'',?,?,?,?,?,?,'') "
    ).bind(id, category, mimeType, file.name || '', '', 'admin', r2Key, file.size).run()
    return c.json({ id: r.meta.last_row_id }, 201)
  }

  // 3. Base64フォールバック
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  if (bytes.length > 800_000) return c.json({ error: 'ストレージ未設定のため800KB以下のみ対応' }, 400)
  let binary = ''; for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const b64 = btoa(binary)
  const r = await c.env.DB.prepare(
    "INSERT INTO job_photos (job_id, category, photo_data, mime_type, file_name, caption, uploaded_by, r2_key, file_size, supabase_url) VALUES (?,?,?,?,?,?,?,'',?,'') "
  ).bind(id, category, b64, mimeType, file.name || '', '', 'admin', file.size).run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// Delete photo (admin) - Supabase/R2/D1全対応
adminPartnerApi.delete('/jobs/:id/photos/:photoId', async (c) => {
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))

  const photo = await c.env.DB.prepare("SELECT r2_key, supabase_url FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).first<any>()
  if (!photo) return c.json({ error: 'Not found' }, 404)

  // Supabase削除
  if (photo.supabase_url) {
    const supaConfig = getSupabaseConfig(c.env)
    if (supaConfig) {
      const prefix = `${supaConfig.url}/storage/v1/object/public/${supaConfig.bucket}/`
      if (photo.supabase_url.startsWith(prefix)) {
        const path = photo.supabase_url.slice(prefix.length)
        await deleteFromSupabase(supaConfig, [path]).catch(() => {})
      }
    }
  }

  if (photo.r2_key && c.env.PHOTOS) {
    await c.env.PHOTOS.delete(photo.r2_key).catch(() => {})
  }

  await c.env.DB.prepare("DELETE FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).run()
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
    "SELECT id, job_id, vehicle_id, category, mime_type, file_name, caption, uploaded_by, created_at, supabase_url FROM job_photos WHERE job_id = ? AND vehicle_id = ? ORDER BY category, created_at"
  ).bind(jobId, vid).all()
  return c.json({ photos: photos.results })
})

// Admin upload vehicle photo (Supabase優先 → R2 → Base64フォールバック)
adminPartnerApi.post('/jobs/:id/vehicles/:vid/photos', async (c) => {
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ?").bind(jobId).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const v = await c.env.DB.prepare("SELECT id FROM job_vehicles WHERE id = ? AND job_id = ?").bind(vid, jobId).first()
  if (!v) return c.json({ error: 'Vehicle not found' }, 404)

  const formData = await c.req.formData()
  const file = formData.get('photo') as File | null
  const category = formData.get('category') as string
  const validCategories = ['caution_plate','pre_install','power_source','ground_point','completed','claim_caution_plate','claim_fault','claim_repair','other']
  if (!category || !validCategories.includes(category)) return c.json({ error: 'Invalid category' }, 400)
  if (!file || !(file instanceof File)) return c.json({ error: 'photo file required' }, 400)
  if (file.size > 25 * 1024 * 1024) return c.json({ error: 'ファイルサイズが大きすぎます（25MB以下）' }, 400)

  const mimeType = file.type || 'image/jpeg'

  // 1. Supabase Storage
  const supaConfig = getSupabaseConfig(c.env)
  if (supaConfig) {
    const storagePath = generateStoragePath(jobId, category, file.name || 'photo.jpg', vid)
    const result = await uploadToSupabase(supaConfig, storagePath, file.stream(), mimeType)
    if (result.success) {
      const r = await c.env.DB.prepare(
        "INSERT INTO job_photos (job_id, vehicle_id, category, photo_data, mime_type, file_name, caption, uploaded_by, r2_key, file_size, supabase_url) VALUES (?,?,?,'',?,?,?,?,'',?,?)"
      ).bind(jobId, vid, category, mimeType, file.name||'', '', 'admin', file.size, result.publicUrl).run()
      return c.json({ id: r.meta.last_row_id, url: result.publicUrl }, 201)
    }
    console.error('Supabase upload failed:', result.error)
  }

  // 2. R2
  if (c.env.PHOTOS) {
    const ext = file.name?.split('.').pop()?.toLowerCase() || 'jpg'
    const r2Key = `jobs/${jobId}/vehicles/${vid}/${category}/${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`
    await c.env.PHOTOS.put(r2Key, file.stream(), {
      httpMetadata: { contentType: mimeType },
      customMetadata: { jobId: String(jobId), vehicleId: String(vid), category, uploadedBy: 'admin' }
    })
    const r = await c.env.DB.prepare(
      "INSERT INTO job_photos (job_id, vehicle_id, category, photo_data, mime_type, file_name, caption, uploaded_by, r2_key, file_size, supabase_url) VALUES (?,?,?,'',?,?,?,?,?,?,'') "
    ).bind(jobId, vid, category, mimeType, file.name||'', '', 'admin', r2Key, file.size).run()
    return c.json({ id: r.meta.last_row_id }, 201)
  }

  // 3. Base64フォールバック
  const buf = await file.arrayBuffer()
  const bytes = new Uint8Array(buf)
  if (bytes.length > 800_000) return c.json({ error: 'ストレージ未設定のため800KB以下のみ対応' }, 400)
  let binary = ''; for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
  const b64 = btoa(binary)
  const r = await c.env.DB.prepare(
    "INSERT INTO job_photos (job_id, vehicle_id, category, photo_data, mime_type, file_name, caption, uploaded_by, r2_key, file_size, supabase_url) VALUES (?,?,?,?,?,?,?,?,'',?,'') "
  ).bind(jobId, vid, category, b64, mimeType, file.name||'', '', 'admin', file.size).run()
  return c.json({ id: r.meta.last_row_id }, 201)
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

// Bulk delete jobs
adminPartnerApi.post('/jobs/bulk-delete', async (c) => {
  const { ids } = await c.req.json<{ ids: number[] }>()
  if (!ids || !ids.length) return c.json({ error: 'ids required' }, 400)
  if (ids.length > 100) return c.json({ error: 'Max 100 items at once' }, 400)
  const placeholders = ids.map(() => '?').join(',')
  // Delete related data first
  await c.env.DB.prepare(`DELETE FROM job_photos WHERE job_id IN (${placeholders})`).bind(...ids).run()
  await c.env.DB.prepare(`DELETE FROM vehicle_products WHERE vehicle_id IN (SELECT id FROM job_vehicles WHERE job_id IN (${placeholders}))`).bind(...ids).run()
  await c.env.DB.prepare(`DELETE FROM job_vehicles WHERE job_id IN (${placeholders})`).bind(...ids).run()
  await c.env.DB.prepare(`DELETE FROM job_attachments WHERE job_id IN (${placeholders})`).bind(...ids).run()
  await c.env.DB.prepare(`DELETE FROM messages WHERE job_id IN (${placeholders})`).bind(...ids).run()
  const r = await c.env.DB.prepare(`DELETE FROM jobs WHERE id IN (${placeholders})`).bind(...ids).run()
  return c.json({ success: true, deleted: r.meta.changes })
})

// ===================== Email Templates =====================

// Send test email (must be before :key routes)
adminPartnerApi.post('/email-templates/test', async (c) => {
  const body = await c.req.json<{ to: string; template_key: string }>()
  if (!body.to || !body.template_key) return c.json({ error: 'to and template_key required' }, 400)
  if (!c.env.RESEND_API_KEY) return c.json({ error: 'RESEND_API_KEY not configured' }, 500)
  
  const template = await c.env.DB.prepare("SELECT * FROM email_templates WHERE template_key = ?").bind(body.template_key).first<any>()
  
  const subject = (template?.subject || '【SVA】テストメール').replace('{{job_title}}', 'テスト案件')
  const { html } = buildJobNotificationEmail({
    partnerName: 'テスト パートナー',
    jobTitle: 'テスト案件名',
    jobNumber: 'TEST-001',
    location: '東京都',
    vehicleType: '大型車',
    deviceType: 'カメラ',
    vehicleCount: 3,
    preferredDate: '2026年4月1日',
    urgentNote: '',
  }, template)
  
  const result = await sendMail(c.env.RESEND_API_KEY, { to: body.to, subject, html })
  if (!result.success) return c.json({ error: result.error }, 500)
  return c.json({ success: true })
})

// List all email templates
adminPartnerApi.get('/email-templates', async (c) => {
  try {
    const data = await c.env.DB.prepare("SELECT * FROM email_templates ORDER BY template_key ASC").all()
    return c.json({ templates: data.results })
  } catch {
    return c.json({ templates: [] })
  }
})

// Get email template by key
adminPartnerApi.get('/email-templates/:key', async (c) => {
  const key = c.req.param('key')
  const t = await c.env.DB.prepare("SELECT * FROM email_templates WHERE template_key = ?").bind(key).first()
  if (!t) {
    // Return default values if table/row doesn't exist
    return c.json({ template: { template_key: key, subject: '', body_intro: '', body_footer: '', sender_name: 'SVA', cta_text: '', cta_url: '', is_active: 1 } })
  }
  return c.json({ template: t })
})

// Update/create email template
adminPartnerApi.put('/email-templates/:key', async (c) => {
  const key = c.req.param('key')
  const body = await c.req.json<{
    subject?: string; body_intro?: string; body_footer?: string;
    sender_name?: string; cta_text?: string; cta_url?: string; is_active?: number
  }>()
  
  const existing = await c.env.DB.prepare("SELECT id FROM email_templates WHERE template_key = ?").bind(key).first()
  if (existing) {
    await c.env.DB.prepare(
      `UPDATE email_templates SET subject=?, body_intro=?, body_footer=?, sender_name=?, cta_text=?, cta_url=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE template_key=?`
    ).bind(
      body.subject ?? '', body.body_intro ?? '', body.body_footer ?? '',
      body.sender_name ?? 'SVA', body.cta_text ?? '', body.cta_url ?? '',
      body.is_active ?? 1, key
    ).run()
  } else {
    await c.env.DB.prepare(
      `INSERT INTO email_templates (template_key, subject, body_intro, body_footer, sender_name, cta_text, cta_url, is_active) VALUES (?,?,?,?,?,?,?,?)`
    ).bind(key, body.subject ?? '', body.body_intro ?? '', body.body_footer ?? '', body.sender_name ?? 'SVA', body.cta_text ?? '', body.cta_url ?? '', body.is_active ?? 1).run()
  }
  return c.json({ success: true })
})

// ===================== Partner Invitations (招待リンク) =====================

// Generate invite token
function generateInviteToken(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

// List invitations
adminPartnerApi.get('/invitations', async (c) => {
  const invites = await c.env.DB.prepare(
    "SELECT * FROM partner_invitations ORDER BY created_at DESC LIMIT 100"
  ).all()
  return c.json({ invitations: invites.results })
})

// Create invitation
adminPartnerApi.post('/invitations', async (c) => {
  const body = await c.req.json<{
    memo?: string; rank?: string; max_uses?: number; expires_days?: number
  }>()

  const validRanks = ['standard', 'silver', 'gold', 'platinum']
  const rank = (body.rank && validRanks.includes(body.rank)) ? body.rank : 'standard'
  const maxUses = Math.max(1, body.max_uses || 1)
  const expiresDays = Math.max(1, Math.min(365, body.expires_days || 7))
  const expiresAt = new Date(Date.now() + expiresDays * 24 * 60 * 60 * 1000).toISOString()
  const token = generateInviteToken()

  const r = await c.env.DB.prepare(
    "INSERT INTO partner_invitations (token, memo, rank, max_uses, expires_at) VALUES (?,?,?,?,?)"
  ).bind(token, body.memo || '', rank, maxUses, expiresAt).run()

  return c.json({ id: r.meta.last_row_id, token, expires_at: expiresAt }, 201)
})

// Delete invitation
adminPartnerApi.delete('/invitations/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare("DELETE FROM partner_invitations WHERE id = ?").bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ===================== Inquiries (お問い合わせ管理) =====================

// List inquiries (with pagination, status filter, search)
adminPartnerApi.get('/inquiries', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20
  const offset = (page - 1) * limit
  const status = c.req.query('status') || ''
  const search = c.req.query('search') || ''

  let where = '1=1'
  const params: any[] = []
  if (status) { where += ' AND status = ?'; params.push(status) }
  if (search) {
    where += ' AND (name LIKE ? OR company LIKE ? OR email LIKE ? OR message LIKE ?)'
    const s = '%' + search + '%'
    params.push(s, s, s, s)
  }

  const countQ = `SELECT COUNT(*) as total FROM inquiries WHERE ${where}`
  const dataQ = `SELECT id, name, company, email, phone, category, message, status, admin_note, read_at, replied_at, created_at, updated_at FROM inquiries WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`

  const [cnt, data] = await Promise.all([
    c.env.DB.prepare(countQ).bind(...params).first<{ total: number }>(),
    c.env.DB.prepare(dataQ).bind(...params, limit, offset).all()
  ])
  return c.json({ inquiries: data.results, pagination: { page, limit, total: cnt?.total || 0, totalPages: Math.ceil((cnt?.total || 0) / limit) } })
})

// Get unread count (for alert badge)
adminPartnerApi.get('/inquiries/unread-count', async (c) => {
  const cnt = await c.env.DB.prepare("SELECT COUNT(*) as c FROM inquiries WHERE status = 'new'").first<{ c: number }>()
  return c.json({ count: cnt?.c || 0 })
})

// Get single inquiry
adminPartnerApi.get('/inquiries/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const inq = await c.env.DB.prepare("SELECT * FROM inquiries WHERE id = ?").bind(id).first()
  if (!inq) return c.json({ error: 'Not found' }, 404)

  // Mark as read if new
  if (!(inq as any).read_at) {
    await c.env.DB.prepare("UPDATE inquiries SET read_at = CURRENT_TIMESTAMP, status = CASE WHEN status = 'new' THEN 'read' ELSE status END, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(id).run()
  }

  return c.json({ inquiry: inq })
})

// Update inquiry status/note
adminPartnerApi.put('/inquiries/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ status?: string; admin_note?: string }>()

  const inq = await c.env.DB.prepare("SELECT * FROM inquiries WHERE id = ?").bind(id).first<any>()
  if (!inq) return c.json({ error: 'Not found' }, 404)

  const validStatuses = ['new', 'read', 'replied', 'in_progress', 'resolved', 'spam']
  if (body.status && !validStatuses.includes(body.status)) return c.json({ error: 'Invalid status' }, 400)

  const newStatus = body.status ?? inq.status
  const repliedAt = (newStatus === 'replied' && !inq.replied_at) ? new Date().toISOString() : inq.replied_at

  await c.env.DB.prepare(
    "UPDATE inquiries SET status = ?, admin_note = ?, replied_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(newStatus, body.admin_note ?? inq.admin_note, repliedAt, id).run()
  return c.json({ success: true })
})

// Delete inquiry
adminPartnerApi.delete('/inquiries/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare("DELETE FROM inquiries WHERE id = ?").bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// Bulk update status (mark multiple as read/spam/resolved)
adminPartnerApi.post('/inquiries/bulk-update', async (c) => {
  const body = await c.req.json<{ ids: number[]; status: string }>()
  if (!body.ids || body.ids.length === 0) return c.json({ error: 'ids required' }, 400)
  const validStatuses = ['read', 'replied', 'in_progress', 'resolved', 'spam']
  if (!validStatuses.includes(body.status)) return c.json({ error: 'Invalid status' }, 400)

  const placeholders = body.ids.map(() => '?').join(',')
  await c.env.DB.prepare(
    `UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`
  ).bind(body.status, ...body.ids).run()
  return c.json({ success: true, updated: body.ids.length })
})

// ===================== Product Master (製品マスタ) =====================

// List all products (active + inactive, with optional filter)
adminPartnerApi.get('/products', async (c) => {
  const active = c.req.query('active') // '' = all, '1' = active only, '0' = inactive only
  const category = c.req.query('category') || ''
  const search = c.req.query('search') || ''

  let where = '1=1'
  const params: any[] = []
  if (active === '1') { where += ' AND is_active = 1' }
  else if (active === '0') { where += ' AND is_active = 0' }
  if (category) { where += ' AND category = ?'; params.push(category) }
  if (search) { where += ' AND (product_name LIKE ? OR model_number LIKE ? OR description LIKE ?)'; const s = '%' + search + '%'; params.push(s, s, s) }

  const data = await c.env.DB.prepare(
    `SELECT * FROM product_master WHERE ${where} ORDER BY sort_order ASC, id ASC`
  ).bind(...params).all()
  return c.json({ products: data.results })
})

// Active products endpoint (used by forms without listing inactive)
// IMPORTANT: Must be before /products/:id to avoid route conflict
adminPartnerApi.get('/products/active', async (c) => {
  const data = await c.env.DB.prepare(
    "SELECT id, product_name, model_number, category FROM product_master WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  ).all()
  return c.json({ products: data.results })
})

// Get single product
adminPartnerApi.get('/products/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const p = await c.env.DB.prepare("SELECT * FROM product_master WHERE id = ?").bind(id).first()
  if (!p) return c.json({ error: 'Not found' }, 404)
  return c.json({ product: p })
})

// Create product
adminPartnerApi.post('/products', async (c) => {
  const body = await c.req.json<{
    product_name: string; model_number?: string; category?: string;
    description?: string; sort_order?: number; is_active?: number
  }>()
  if (!body.product_name) return c.json({ error: 'product_name required' }, 400)

  const validCategories = ['camera', 'sensor', 'light', 'control', 'recorder', 'monitor', 'other']
  const cat = (body.category && validCategories.includes(body.category)) ? body.category : 'other'

  const r = await c.env.DB.prepare(
    "INSERT INTO product_master (product_name, model_number, category, description, sort_order, is_active) VALUES (?,?,?,?,?,?)"
  ).bind(body.product_name, body.model_number || '', cat, body.description || '', body.sort_order ?? 0, body.is_active ?? 1).run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// Bulk create products (CSV import)
adminPartnerApi.post('/products/bulk', async (c) => {
  const body = await c.req.json<{
    products: Array<{ product_name: string; model_number?: string; category?: string }>
  }>()
  if (!body.products || !Array.isArray(body.products) || body.products.length === 0) {
    return c.json({ error: 'products array is required' }, 400)
  }
  if (body.products.length > 500) {
    return c.json({ error: '一度に登録できるのは500件までです' }, 400)
  }

  const validCategories = ['camera', 'sensor', 'light', 'control', 'recorder', 'monitor', 'other']

  // Get existing product names for dedup
  const existing = await c.env.DB.prepare("SELECT product_name FROM product_master").all<{ product_name: string }>()
  const existingNames = new Set((existing.results || []).map(p => p.product_name.toLowerCase()))

  let inserted = 0
  let skipped = 0
  const stmts: D1PreparedStatement[] = []

  for (const p of body.products) {
    const name = (p.product_name || '').trim()
    if (!name) { skipped++; continue }

    // Skip duplicates
    if (existingNames.has(name.toLowerCase())) {
      skipped++
      continue
    }

    const cat = (p.category && validCategories.includes(p.category)) ? p.category : 'other'
    stmts.push(
      c.env.DB.prepare(
        "INSERT INTO product_master (product_name, model_number, category, description, sort_order, is_active) VALUES (?,?,?,?,?,?)"
      ).bind(name, (p.model_number || '').trim(), cat, '', 0, 1)
    )
    existingNames.add(name.toLowerCase()) // prevent in-batch duplicates
    inserted++
  }

  // Execute in batches (D1 batch limit)
  if (stmts.length > 0) {
    const batchSize = 50
    for (let i = 0; i < stmts.length; i += batchSize) {
      const batch = stmts.slice(i, i + batchSize)
      await c.env.DB.batch(batch)
    }
  }

  return c.json({ inserted, skipped, total: body.products.length })
})

// Update product
adminPartnerApi.put('/products/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const p = await c.env.DB.prepare("SELECT * FROM product_master WHERE id = ?").bind(id).first<any>()
  if (!p) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    product_name?: string; model_number?: string; category?: string;
    description?: string; sort_order?: number; is_active?: number
  }>()

  const validCategories = ['camera', 'sensor', 'light', 'control', 'recorder', 'monitor', 'other']
  const cat = (body.category && validCategories.includes(body.category)) ? body.category : (p.category || 'other')

  await c.env.DB.prepare(
    "UPDATE product_master SET product_name=?, model_number=?, category=?, description=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
  ).bind(
    body.product_name ?? p.product_name,
    body.model_number ?? p.model_number,
    cat,
    body.description ?? p.description,
    body.sort_order ?? p.sort_order,
    body.is_active ?? p.is_active,
    id
  ).run()
  return c.json({ success: true })
})

// Delete product
adminPartnerApi.delete('/products/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare("DELETE FROM product_master WHERE id = ?").bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ==========================================
// Installation Requests (取付依頼) Admin API
// ==========================================

// List requests with pagination, status filter, search
adminPartnerApi.get('/requests', async (c) => {
  const page = Math.max(1, Number(c.req.query('page') || '1'))
  const limit = 20
  const offset = (page - 1) * limit
  const status = c.req.query('status') || ''
  const search = c.req.query('search') || ''

  const conditions: string[] = ['1=1']
  const params: any[] = []

  if (status) {
    conditions.push('status = ?')
    params.push(status)
  }
  if (search) {
    conditions.push('(company_name LIKE ? OR contact_person LIKE ? OR email LIKE ?)')
    const s = `%${search}%`
    params.push(s, s, s)
  }

  const where = conditions.join(' AND ')
  const countQ = `SELECT COUNT(*) as total FROM installation_requests WHERE ${where}`
  const dataQ = `SELECT id, company_name, department, contact_person, company_address, phone, email, disclosure, meeting_date, products_json, vehicles_json, sites_json, budget_estimate, notes, status, assigned_partner_id, created_at, updated_at FROM installation_requests WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`

  const cnt = await c.env.DB.prepare(countQ).bind(...params).first<{ total: number }>()
  const data = await c.env.DB.prepare(dataQ).bind(...params, limit, offset).all()

  return c.json({
    requests: data.results,
    pagination: {
      page,
      limit,
      total: cnt?.total || 0,
      pages: Math.ceil((cnt?.total || 0) / limit)
    }
  })
})

// Get single request detail
adminPartnerApi.get('/requests/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const req = await c.env.DB.prepare("SELECT * FROM installation_requests WHERE id = ?").bind(id).first()
  if (!req) return c.json({ error: 'Not found' }, 404)
  return c.json(req)
})

// Update request status / assign partner
adminPartnerApi.put('/requests/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{ status?: string; assigned_partner_id?: number }>()

  const req = await c.env.DB.prepare("SELECT * FROM installation_requests WHERE id = ?").bind(id).first<any>()
  if (!req) return c.json({ error: 'Not found' }, 404)

  const validStatuses = ['new', 'confirmed', 'assigned', 'scheduled', 'in_progress', 'completed', 'cancelled']
  const newStatus = (body.status && validStatuses.includes(body.status)) ? body.status : req.status
  const partnerId = body.assigned_partner_id !== undefined ? body.assigned_partner_id : req.assigned_partner_id

  await c.env.DB.prepare(
    "UPDATE installation_requests SET status = ?, assigned_partner_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(newStatus, partnerId, id).run()

  return c.json({ success: true })
})

// Delete request
adminPartnerApi.delete('/requests/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const r = await c.env.DB.prepare("DELETE FROM installation_requests WHERE id = ?").bind(id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// Count new requests (for badge)
adminPartnerApi.get('/requests-count', async (c) => {
  const cnt = await c.env.DB.prepare("SELECT COUNT(*) as c FROM installation_requests WHERE status = 'new'").first<{ c: number }>()
  return c.json({ count: cnt?.c || 0 })
})

export { adminPartnerApi }
