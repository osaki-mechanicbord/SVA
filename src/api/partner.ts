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

export { partnerApi }
