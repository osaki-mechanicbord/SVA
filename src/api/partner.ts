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

// ログイン
partnerApi.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()
  if (!email || !password) return c.json({ error: 'メールアドレスとパスワードを入力してください' }, 400)

  const passwordHash = await hashPassword(password)
  const partner = await c.env.DB.prepare(
    "SELECT id, email, company_name, representative_name, phone, region, specialties, status FROM partners WHERE email = ? AND password_hash = ?"
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
    "SELECT id, email, company_name, representative_name, phone, region, specialties, status, last_login_at, created_at FROM partners WHERE id = ?"
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
    company_name?: string; representative_name?: string; phone?: string; region?: string; specialties?: string
  }>()

  const partner = await c.env.DB.prepare("SELECT * FROM partners WHERE id = ?").bind(session.partner_id).first()
  if (!partner) return c.json({ error: 'Not found' }, 404)

  await c.env.DB.prepare(
    "UPDATE partners SET company_name = ?, representative_name = ?, phone = ?, region = ?, specialties = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
  ).bind(
    body.company_name ?? partner.company_name,
    body.representative_name ?? partner.representative_name,
    body.phone ?? partner.phone,
    body.region ?? partner.region,
    body.specialties ?? partner.specialties,
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
    c.env.DB.prepare(`SELECT * FROM jobs WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).bind(...params, limit, offset).all()
  ])
  return c.json({ jobs: data.results, pagination: { page, limit, total: cnt?.total || 0, totalPages: Math.ceil((cnt?.total || 0) / limit) } })
})

// 案件詳細
partnerApi.get('/me/jobs/:id', async (c) => {
  const pid = await getPartnerId(c)
  if (!pid) return c.json({ error: 'Unauthorized' }, 401)
  const id = Number(c.req.param('id'))
  const job = await c.env.DB.prepare("SELECT * FROM jobs WHERE id = ? AND partner_id = ?").bind(id, pid).first()
  if (!job) return c.json({ error: 'Not found' }, 404)
  return c.json({ job })
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

export { partnerApi }
