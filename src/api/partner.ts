import { Hono } from 'hono'

type Bindings = { DB: D1Database }

const partnerApi = new Hono<{ Bindings: Bindings }>()

// --- Utility ---
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

function generateToken(): string {
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('')
}

// ==========================================
// Partner Auth API
// ==========================================

// 招待トークン検証（登録画面表示前にチェック）
partnerApi.get('/invite/:token', async (c) => {
  const token = c.req.param('token')
  const invite = await c.env.DB.prepare(
    "SELECT * FROM partner_invitations WHERE token = ?"
  ).bind(token).first<any>()

  if (!invite) return c.json({ error: 'この招待リンクは無効です' }, 404)
  if (new Date(invite.expires_at) < new Date()) return c.json({ error: 'この招待リンクは期限切れです' }, 410)
  if (invite.used_count >= invite.max_uses) return c.json({ error: 'この招待リンクは使用済みです' }, 410)

  return c.json({ valid: true, memo: invite.memo, rank: invite.rank })
})

// 招待トークンを使って初回登録
partnerApi.post('/invite/:token/register', async (c) => {
  const token = c.req.param('token')
  const body = await c.req.json<{
    email: string; password: string; company_name?: string;
    representative_name?: string; phone?: string; region?: string; specialties?: string;
    postal_code?: string; address?: string; invoice_number?: string
  }>()

  if (!body.email || !body.password) return c.json({ error: 'メールアドレスとパスワードは必須です' }, 400)
  if (body.password.length < 8) return c.json({ error: 'パスワードは8文字以上で設定してください' }, 400)

  // 招待トークン検証
  const invite = await c.env.DB.prepare(
    "SELECT * FROM partner_invitations WHERE token = ?"
  ).bind(token).first<any>()

  if (!invite) return c.json({ error: 'この招待リンクは無効です' }, 404)
  if (new Date(invite.expires_at) < new Date()) return c.json({ error: 'この招待リンクは期限切れです' }, 410)
  if (invite.used_count >= invite.max_uses) return c.json({ error: 'この招待リンクは使用済みです' }, 410)

  // メールアドレス重複チェック
  const exists = await c.env.DB.prepare("SELECT id FROM partners WHERE email = ?").bind(body.email).first()
  if (exists) return c.json({ error: 'このメールアドレスは既に登録されています' }, 409)

  // パートナー作成
  const passwordHash = await hashPassword(body.password)
  const r = await c.env.DB.prepare(
    `INSERT INTO partners (email, password_hash, company_name, representative_name, phone, region, specialties, rank, invited_by_token, postal_code, address, invoice_number) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    body.email, passwordHash,
    body.company_name || '', body.representative_name || '',
    body.phone || '', body.region || '', body.specialties || '',
    invite.rank, token,
    body.postal_code || '', body.address || '', body.invoice_number || ''
  ).run()

  // 招待使用回数を更新
  await c.env.DB.prepare(
    "UPDATE partner_invitations SET used_count = used_count + 1 WHERE id = ?"
  ).bind(invite.id).run()

  // 自動ログイン用トークン発行
  const sessionToken = generateToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const partnerId = r.meta.last_row_id

  await c.env.DB.prepare(
    "INSERT INTO partner_sessions (partner_id, token, expires_at) VALUES (?, ?, ?)"
  ).bind(partnerId, sessionToken, expiresAt).run()

  return c.json({
    success: true,
    token: sessionToken,
    partner: {
      id: partnerId,
      email: body.email,
      company_name: body.company_name || '',
      representative_name: body.representative_name || ''
    }
  }, 201)
})

// ログイン
partnerApi.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()
  if (!email || !password) return c.json({ error: 'メールアドレスとパスワードを入力してください' }, 400)

  const passwordHash = await hashPassword(password)
  const partner = await c.env.DB.prepare(
    "SELECT id, email, company_name, representative_name, phone, region, specialties, status, postal_code, address, invoice_number FROM partners WHERE email = ? AND password_hash = ?"
  ).bind(email, passwordHash).first()

  if (!partner) return c.json({ error: 'メールアドレスまたはパスワードが正しくありません' }, 401)
  if (partner.status === 'suspended') return c.json({ error: 'このアカウントは利用停止中です。運営にお問い合わせください。' }, 403)

  // セッショントークン生成（7日間有効）
  const token = generateToken()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

  await c.env.DB.prepare(
    "INSERT INTO partner_sessions (partner_id, token, expires_at) VALUES (?, ?, ?)"
  ).bind(partner.id, token, expiresAt).run()

  // 最終ログイン日時を更新
  await c.env.DB.prepare(
    "UPDATE partners SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(partner.id).run()

  return c.json({
    token,
    partner: {
      id: partner.id,
      email: partner.email,
      company_name: partner.company_name,
      representative_name: partner.representative_name,
      phone: partner.phone,
      region: partner.region,
      specialties: partner.specialties,
      postal_code: partner.postal_code,
      address: partner.address,
      invoice_number: partner.invoice_number,
    }
  })
})

// ログアウト
partnerApi.post('/logout', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return c.json({ success: true })

  const token = auth.slice(7)
  await c.env.DB.prepare("DELETE FROM partner_sessions WHERE token = ?").bind(token).run()
  return c.json({ success: true })
})

// セッション確認 & プロフィール取得
partnerApi.get('/me', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.slice(7)
  const session = await c.env.DB.prepare(
    "SELECT ps.partner_id, ps.expires_at FROM partner_sessions ps WHERE ps.token = ?"
  ).bind(token).first<{ partner_id: number; expires_at: string }>()

  if (!session) return c.json({ error: 'Unauthorized' }, 401)

  // 有効期限チェック
  if (new Date(session.expires_at) < new Date()) {
    await c.env.DB.prepare("DELETE FROM partner_sessions WHERE token = ?").bind(token).run()
    return c.json({ error: 'Session expired' }, 401)
  }

  const partner = await c.env.DB.prepare(
    "SELECT id, email, company_name, representative_name, phone, region, specialties, status, postal_code, address, invoice_number, last_login_at, created_at FROM partners WHERE id = ?"
  ).bind(session.partner_id).first()

  if (!partner || partner.status === 'suspended') return c.json({ error: 'Unauthorized' }, 401)

  return c.json({ partner })
})

// プロフィール更新
partnerApi.put('/me', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.slice(7)
  const session = await c.env.DB.prepare(
    "SELECT partner_id, expires_at FROM partner_sessions WHERE token = ?"
  ).bind(token).first<{ partner_id: number; expires_at: string }>()

  if (!session || new Date(session.expires_at) < new Date()) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json<{
    company_name?: string; representative_name?: string; phone?: string; region?: string; specialties?: string;
    postal_code?: string; address?: string; invoice_number?: string
  }>()

  const partner = await c.env.DB.prepare("SELECT * FROM partners WHERE id = ?").bind(session.partner_id).first()
  if (!partner) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    "UPDATE partners SET company_name = ?, representative_name = ?, phone = ?, region = ?, specialties = ?, postal_code = ?, address = ?, invoice_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(
    body.company_name ?? partner.company_name,
    body.representative_name ?? partner.representative_name,
    body.phone ?? partner.phone,
    body.region ?? partner.region,
    body.specialties ?? partner.specialties,
    body.postal_code ?? partner.postal_code,
    body.address ?? partner.address,
    body.invoice_number ?? partner.invoice_number,
    session.partner_id
  ).run()

  return c.json({ success: true })
})

// パスワード変更
partnerApi.put('/me/password', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  const token = auth.slice(7)
  const session = await c.env.DB.prepare(
    "SELECT partner_id, expires_at FROM partner_sessions WHERE token = ?"
  ).bind(token).first<{ partner_id: number; expires_at: string }>()

  if (!session || new Date(session.expires_at) < new Date()) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const { current_password, new_password } = await c.req.json<{ current_password: string; new_password: string }>()
  if (!current_password || !new_password) return c.json({ error: '現在のパスワードと新しいパスワードを入力してください' }, 400)
  if (new_password.length < 8) return c.json({ error: 'パスワードは8文字以上で設定してください' }, 400)

  const currentHash = await hashPassword(current_password)
  const partner = await c.env.DB.prepare(
    "SELECT id FROM partners WHERE id = ? AND password_hash = ?"
  ).bind(session.partner_id, currentHash).first()

  if (!partner) return c.json({ error: '現在のパスワードが正しくありません' }, 401)

  const newHash = await hashPassword(new_password)
  await c.env.DB.prepare(
    "UPDATE partners SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(newHash, session.partner_id).run()

  // 他のセッションを無効化（現在のセッション以外）
  await c.env.DB.prepare(
    "DELETE FROM partner_sessions WHERE partner_id = ? AND token != ?"
  ).bind(session.partner_id, token).run()

  return c.json({ success: true })
})

// ==========================================
// Partner Jobs & Messages (マイページ用)
// ==========================================

// Auth helper middleware
async function getPartnerId(c: any): Promise<number | null> {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const session = await c.env.DB.prepare(
    "SELECT partner_id, expires_at FROM partner_sessions WHERE token = ?"
  ).bind(token).first<{ partner_id: number; expires_at: string }>()
  if (!session || new Date(session.expires_at) < new Date()) return null
  return session.partner_id
}

// 案件一覧
partnerApi.get('/me/jobs', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20; const offset = (page - 1) * limit
  const status = c.req.query('status') || ''

  let where = 'partner_id = ?'
  const params: any[] = [pid]
  if (status) { where += ' AND status = ?'; params.push(status) }

  const [cnt, data] = await Promise.all([
    c.env.DB.prepare(`SELECT COUNT(*) as total FROM jobs WHERE ${where}`).bind(...params).first<{ total: number }>(),
    c.env.DB.prepare(`SELECT j.*,
      (SELECT COUNT(*) FROM job_vehicles WHERE job_id = j.id) as actual_vehicle_count,
      (SELECT COUNT(*) FROM job_vehicles WHERE job_id = j.id AND status = 'completed') as vehicle_done_count,
      (SELECT COUNT(*) FROM vehicle_products vp JOIN job_vehicles jv ON vp.vehicle_id = jv.id WHERE jv.job_id = j.id) as product_count
      FROM jobs j WHERE j.${where} ORDER BY j.created_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all()
  ])
  return c.json({ jobs: data.results, pagination: { page, limit, total: cnt?.total || 0, totalPages: Math.ceil((cnt?.total || 0) / limit) } })
})

// 案件詳細（車両数・商品数・写真数の集計付き）
// ★ お客様詳細情報は受諾(accepted)以降のステータスでのみ返す
partnerApi.get('/me/jobs/:id', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first<any>()
  if (!job) return c.json({ error: 'Not found' }, 404)

  // お客様詳細情報は pending / declined の場合は隠す
  const clientInfoAllowed = !['pending', 'declined'].includes(job.status)
  const safeJob = { ...job }
  if (!clientInfoAllowed) {
    // 機密情報を除外
    safeJob.client_company = ''
    safeJob.client_branch = ''
    safeJob.client_contact_name = ''
    safeJob.client_contact_phone = ''
    safeJob.client_contact_email = ''
    safeJob.work_location_detail = ''
    safeJob.work_datetime = ''
    safeJob.vehicle_count = 0
    safeJob.urgent_contact_note = ''
    safeJob.products_maker = ''
    safeJob.products_customer = ''
    safeJob.products_partner = ''
    safeJob.products_local = ''
    safeJob.cost_labor = 0
    safeJob.cost_travel = 0
    safeJob.cost_other = 0
    safeJob.cost_preliminary = 0
    safeJob.cost_memo = ''
  }

  // 車両明細+集計
  const vehicles = await c.env.DB.prepare(
    "SELECT * FROM job_vehicles WHERE job_id = ? ORDER BY seq"
  ).bind(id).all()

  // 各車両の商品・写真数を取得
  const vehicleDetails = await Promise.all((vehicles.results as any[]).map(async (v: any) => {
    const [products, photoCounts] = await Promise.all([
      c.env.DB.prepare("SELECT * FROM vehicle_products WHERE vehicle_id = ? ORDER BY id").bind(v.id).all(),
      c.env.DB.prepare("SELECT category, COUNT(*) as cnt FROM job_photos WHERE vehicle_id = ? GROUP BY category").bind(v.id).all()
    ])
    const photoMap: any = {}
    ;(photoCounts.results as any[]).forEach((r: any) => { photoMap[r.category] = r.cnt })
    return { ...v, products: products.results, photo_counts: photoMap }
  }))

  // 添付ファイル一覧（メタデータのみ）
  const attachments = await c.env.DB.prepare(
    "SELECT id, job_id, file_name, mime_type, file_size, description, uploaded_by, created_at FROM job_attachments WHERE job_id = ? ORDER BY created_at DESC"
  ).bind(id).all()

  return c.json({ job: safeJob, vehicles: vehicleDetails, attachments: attachments.results, client_info_allowed: clientInfoAllowed })
})

// ========== 車両明細 CRUD ==========

// 車両追加
partnerApi.post('/me/jobs/:id/vehicles', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    maker_name?: string; car_model?: string; car_model_code?: string; vehicle_memo?: string
  }>()

  // 次のseq番号を取得
  const maxSeq = await c.env.DB.prepare("SELECT MAX(seq) as m FROM job_vehicles WHERE job_id = ?").bind(jobId).first<{m:number}>()
  const seq = (maxSeq?.m || 0) + 1

  const r = await c.env.DB.prepare(
    "INSERT INTO job_vehicles (job_id, seq, maker_name, car_model, car_model_code, vehicle_memo) VALUES (?,?,?,?,?,?)"
  ).bind(jobId, seq, body.maker_name||'', body.car_model||'', body.car_model_code||'', body.vehicle_memo||'').run()
  return c.json({ id: r.meta.last_row_id, seq }, 201)
})

// 車両更新（情報・ステータス・作業報告）
partnerApi.put('/me/jobs/:id/vehicles/:vid', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
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

// 車両削除
partnerApi.delete('/me/jobs/:id/vehicles/:vid', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const r = await c.env.DB.prepare("DELETE FROM job_vehicles WHERE id = ? AND job_id = ?").bind(vid, jobId).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ========== 車両商品 CRUD ==========

// 商品追加
partnerApi.post('/me/jobs/:id/vehicles/:vid/products', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const v = await c.env.DB.prepare("SELECT id FROM job_vehicles WHERE id = ? AND job_id = ?").bind(vid, jobId).first()
  if (!v) return c.json({ error: 'Vehicle not found' }, 404)

  const body = await c.req.json<{ product_name: string; quantity?: number; serial_number?: string; memo?: string }>()
  if (!body.product_name) return c.json({ error: 'product_name required' }, 400)

  const r = await c.env.DB.prepare(
    "INSERT INTO vehicle_products (vehicle_id, product_name, quantity, serial_number, memo) VALUES (?,?,?,?,?)"
  ).bind(vid, body.product_name, body.quantity||1, body.serial_number||'', body.memo||'').run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// 商品更新
partnerApi.put('/me/jobs/:id/vehicles/:vid/products/:pid2', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const prodId = Number(c.req.param('pid2'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const p = await c.env.DB.prepare("SELECT * FROM vehicle_products WHERE id = ? AND vehicle_id = ?").bind(prodId, vid).first<any>()
  if (!p) return c.json({ error: 'Product not found' }, 404)

  const body = await c.req.json<{ product_name?: string; quantity?: number; serial_number?: string; memo?: string }>()
  await c.env.DB.prepare(
    "UPDATE vehicle_products SET product_name=?, quantity=?, serial_number=?, memo=? WHERE id=?"
  ).bind(body.product_name??p.product_name, body.quantity??p.quantity, body.serial_number??p.serial_number, body.memo??p.memo, prodId).run()
  return c.json({ success: true })
})

// 商品削除
partnerApi.delete('/me/jobs/:id/vehicles/:vid/products/:pid2', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const prodId = Number(c.req.param('pid2'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const r = await c.env.DB.prepare("DELETE FROM vehicle_products WHERE id = ? AND vehicle_id = ?").bind(prodId, vid).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ========== 車両単位の写真 ==========

// 車両写真アップロード
partnerApi.post('/me/jobs/:id/vehicles/:vid/photos', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const v = await c.env.DB.prepare("SELECT id FROM job_vehicles WHERE id = ? AND job_id = ?").bind(vid, jobId).first()
  if (!v) return c.json({ error: 'Vehicle not found' }, 404)

  const body = await c.req.json<{ category: string; photo_data: string; mime_type?: string; file_name?: string; caption?: string }>()
  const validCategories = ['caution_plate','pre_install','power_source','ground_point','completed','claim_caution_plate','claim_fault','claim_repair','other']
  if (!body.category || !validCategories.includes(body.category)) return c.json({ error: 'Invalid category' }, 400)
  if (!body.photo_data) return c.json({ error: 'photo_data required' }, 400)
  if (body.photo_data.length > 7_000_000) return c.json({ error: 'ファイルサイズが大きすぎます' }, 400)

  const r = await c.env.DB.prepare(
    "INSERT INTO job_photos (job_id, vehicle_id, category, photo_data, mime_type, file_name, caption, uploaded_by) VALUES (?,?,?,?,?,?,?,?)"
  ).bind(jobId, vid, body.category, body.photo_data, body.mime_type||'image/jpeg', body.file_name||'', body.caption||'', 'partner').run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// 車両写真一覧
partnerApi.get('/me/jobs/:id/vehicles/:vid/photos', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const jobId = Number(c.req.param('id'))
  const vid = Number(c.req.param('vid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(jobId, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const photos = await c.env.DB.prepare(
    "SELECT id, job_id, vehicle_id, category, mime_type, file_name, caption, uploaded_by, created_at FROM job_photos WHERE job_id = ? AND vehicle_id = ? ORDER BY category, created_at"
  ).bind(jobId, vid).all()
  return c.json({ photos: photos.results })
})

// 添付ファイルダウンロード（パートナーが現地で確認・ダウンロード）
partnerApi.get('/me/jobs/:id/attachments/:aid', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const aid = Number(c.req.param('aid'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  const att = await c.env.DB.prepare("SELECT * FROM job_attachments WHERE id = ? AND job_id = ?").bind(aid, id).first<any>()
  if (!att) return c.json({ error: 'Not found' }, 404)
  return c.json({ attachment: att })
})

// 案件ステータス更新 (パートナー側: accept / decline / メモ)
partnerApi.put('/me/jobs/:id', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{ status?: string; partner_memo?: string }>()
  const allowedStatuses = ['accepted', 'declined', 'in_progress', 'completed']
  if (body.status && !allowedStatuses.includes(body.status)) return c.json({ error: 'Invalid status' }, 400)

  await c.env.DB.prepare(
    "UPDATE jobs SET status = ?, partner_memo = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(body.status ?? job.status, body.partner_memo ?? job.partner_memo, id).run()
  return c.json({ success: true })
})

// 案件詳細情報更新 (送り状NO・車両情報・作業報告・メモ)
partnerApi.put('/me/jobs/:id/details', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const j = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first<any>()
  if (!j) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    tracking_number?: string; maker_name?: string; car_model?: string; car_model_code?: string;
    work_report?: string; general_memo?: string
  }>()

  await c.env.DB.prepare(
    `UPDATE jobs SET tracking_number=?, maker_name=?, car_model=?, car_model_code=?, work_report=?, general_memo=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.tracking_number ?? j.tracking_number, body.maker_name ?? j.maker_name,
    body.car_model ?? j.car_model, body.car_model_code ?? j.car_model_code,
    body.work_report ?? j.work_report, body.general_memo ?? j.general_memo, id
  ).run()
  return c.json({ success: true })
})

// 写真アップロード (パートナーが現場で撮影した写真を案件に紐付け)
partnerApi.post('/me/jobs/:id/photos', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    category: string; photo_data: string; mime_type?: string; file_name?: string; caption?: string
  }>()

  const validCategories = ['caution_plate','pre_install','power_source','ground_point','completed','claim_caution_plate','claim_fault','claim_repair','other']
  if (!body.category || !validCategories.includes(body.category)) return c.json({ error: 'Invalid category' }, 400)
  if (!body.photo_data) return c.json({ error: 'photo_data required' }, 400)

  // Limit photo_data size (approx 5MB base64)
  if (body.photo_data.length > 7_000_000) return c.json({ error: 'ファイルサイズが大きすぎます（5MB以下にしてください）' }, 400)

  const r = await c.env.DB.prepare(
    "INSERT INTO job_photos (job_id, category, photo_data, mime_type, file_name, caption, uploaded_by) VALUES (?,?,?,?,?,?,?)"
  ).bind(id, body.category, body.photo_data, body.mime_type || 'image/jpeg', body.file_name || '', body.caption || '', 'partner').run()

  return c.json({ id: r.meta.last_row_id }, 201)
})

// 写真一覧取得 (メタデータのみ、データは含まない)
partnerApi.get('/me/jobs/:id/photos', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const photos = await c.env.DB.prepare(
    "SELECT id, job_id, category, mime_type, file_name, caption, uploaded_by, created_at FROM job_photos WHERE job_id = ? ORDER BY category, created_at"
  ).bind(id).all()
  return c.json({ photos: photos.results })
})

// 写真データ取得 (個別)
partnerApi.get('/me/jobs/:id/photos/:photoId', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const photo = await c.env.DB.prepare("SELECT * FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).first<any>()
  if (!photo) return c.json({ error: 'Photo not found' }, 404)
  return c.json({ photo })
})

// 写真削除
partnerApi.delete('/me/jobs/:id/photos/:photoId', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const photoId = Number(c.req.param('photoId'))
  const job = await c.env.DB.prepare("SELECT id FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)

  const r = await c.env.DB.prepare("DELETE FROM job_photos WHERE id = ? AND job_id = ?").bind(photoId, id).run()
  if (r.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// 案件トラッキングステータス更新 (パートナー側 - 共通ステータス編集)
partnerApi.put('/me/jobs/:id/tracking', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const j = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first<any>()
  if (!j) return c.json({ error: 'Not found' }, 404)

  const body = await c.req.json<{
    shipping_status?: string; shipped_at?: string; received_at?: string;
    schedule_status?: string; confirmed_work_date?: string;
    work_status?: string; work_completed_at?: string;
    status_note?: string
  }>()

  const shippingValid = ['not_shipped', 'shipped', 'received']
  const scheduleValid = ['not_started', 'contacting', 'waiting_callback', 'date_confirmed']
  const workValid = ['scheduling', 'completed', 'user_postponed', 'self_postponed', 'maker_postponed', 'cancelled']

  if (body.shipping_status && !shippingValid.includes(body.shipping_status)) return c.json({ error: 'Invalid shipping_status' }, 400)
  if (body.schedule_status && !scheduleValid.includes(body.schedule_status)) return c.json({ error: 'Invalid schedule_status' }, 400)
  if (body.work_status && !workValid.includes(body.work_status)) return c.json({ error: 'Invalid work_status' }, 400)

  let shippedAt = body.shipped_at ?? j.shipped_at
  let receivedAt = body.received_at ?? j.received_at
  let workCompletedAt = body.work_completed_at ?? j.work_completed_at
  if (body.shipping_status === 'shipped' && !j.shipped_at && !body.shipped_at) shippedAt = new Date().toISOString()
  if (body.shipping_status === 'received' && !j.received_at && !body.received_at) receivedAt = new Date().toISOString()
  if (body.work_status === 'completed' && !j.work_completed_at && !body.work_completed_at) workCompletedAt = new Date().toISOString()

  await c.env.DB.prepare(
    `UPDATE jobs SET shipping_status=?, shipped_at=?, received_at=?, schedule_status=?, confirmed_work_date=?, work_status=?, work_completed_at=?, status_note=?, last_status_updated_by='partner', last_status_updated_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?`
  ).bind(
    body.shipping_status ?? j.shipping_status, shippedAt, receivedAt,
    body.schedule_status ?? j.schedule_status, body.confirmed_work_date ?? j.confirmed_work_date,
    body.work_status ?? j.work_status, workCompletedAt,
    body.status_note ?? j.status_note, id
  ).run()
  return c.json({ success: true })
})

// メッセージ一覧
partnerApi.get('/me/messages', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const msgs = await c.env.DB.prepare(
    "SELECT * FROM messages WHERE partner_id = ? ORDER BY created_at DESC LIMIT 100"
  ).bind(pid).all()
  // 未読数
  const unread = await c.env.DB.prepare(
    "SELECT COUNT(*) as c FROM messages WHERE partner_id = ? AND direction = 'to_partner' AND is_read = 0"
  ).bind(pid).first<{ c: number }>()
  return c.json({ messages: msgs.results, unread_count: unread?.c || 0 })
})

// メッセージ既読
partnerApi.put('/me/messages/:id/read', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  await c.env.DB.prepare(
    "UPDATE messages SET is_read = 1 WHERE id = ? AND partner_id = ?"
  ).bind(id, pid).run()
  return c.json({ success: true })
})

// パートナーからメッセージ返信
partnerApi.post('/me/messages', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const { subject, body } = await c.req.json<{ subject: string; body: string }>()
  if (!body) return c.json({ error: 'body required' }, 400)
  const r = await c.env.DB.prepare(
    "INSERT INTO messages (partner_id, direction, subject, body) VALUES (?, 'from_partner', ?, ?)"
  ).bind(pid, subject || '返信', body).run()
  return c.json({ id: r.meta.last_row_id }, 201)
})

// ダッシュボード統計
partnerApi.get('/me/stats', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const [pending, active, total, unread] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as c FROM jobs WHERE partner_id = ? AND status = 'pending'").bind(pid).first<{ c: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM jobs WHERE partner_id = ? AND status IN ('accepted','in_progress')").bind(pid).first<{ c: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM jobs WHERE partner_id = ?").bind(pid).first<{ c: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) as c FROM messages WHERE partner_id = ? AND direction = 'to_partner' AND is_read = 0").bind(pid).first<{ c: number }>()
  ])
  return c.json({ stats: { pending_jobs: pending?.c || 0, active_jobs: active?.c || 0, total_jobs: total?.c || 0, unread_messages: unread?.c || 0 } })
})

// ==========================================
// Product Master (公開 - ログイン不要)
// ==========================================
partnerApi.get('/products/active', async (c) => {
  const data = await c.env.DB.prepare(
    "SELECT id, product_name, model_number, category FROM product_master WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"
  ).all()
  return c.json({ products: data.results })
})

export { partnerApi }
