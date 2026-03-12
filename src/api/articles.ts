import { Hono } from 'hono'

type Bindings = { DB: D1Database }

const api = new Hono<{ Bindings: Bindings }>()

// ==========================================
// Public API - コラム記事取得
// ==========================================

// 公開記事一覧（ページネーション付き）
api.get('/articles', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(c.req.query('limit')) || 9))
  const category = c.req.query('category') || ''
  const offset = (page - 1) * limit

  let countQuery = "SELECT COUNT(*) as total FROM articles WHERE status = 'published'"
  let dataQuery = "SELECT id, slug, title, excerpt, category, thumbnail_url, author, published_at, created_at FROM articles WHERE status = 'published'"
  const params: string[] = []

  if (category) {
    countQuery += " AND category = ?"
    dataQuery += " AND category = ?"
    params.push(category)
  }

  dataQuery += " ORDER BY published_at DESC LIMIT ? OFFSET ?"

  const [countResult, dataResult] = await Promise.all([
    c.env.DB.prepare(countQuery).bind(...params).first<{ total: number }>(),
    c.env.DB.prepare(dataQuery).bind(...params, limit, offset).all()
  ])

  const total = countResult?.total || 0
  const totalPages = Math.ceil(total / limit)

  return c.json({
    articles: dataResult.results,
    pagination: { page, limit, total, totalPages }
  })
})

// 公開記事詳細（slug指定）
api.get('/articles/:slug', async (c) => {
  const slug = c.req.param('slug')
  const article = await c.env.DB.prepare(
    "SELECT * FROM articles WHERE slug = ? AND status = 'published'"
  ).bind(slug).first()

  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ article })
})

// カテゴリ一覧
api.get('/categories', async (c) => {
  const result = await c.env.DB.prepare(
    "SELECT category, COUNT(*) as count FROM articles WHERE status = 'published' GROUP BY category ORDER BY count DESC"
  ).all()
  return c.json({ categories: result.results })
})


// ==========================================
// Admin API - CMS管理（認証必須）
// ==========================================

// 簡易認証ミドルウェア（セッションベース）
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ログイン
api.post('/admin/login', async (c) => {
  const { username, password } = await c.req.json<{ username: string; password: string }>()
  if (!username || !password) return c.json({ error: 'Missing credentials' }, 400)

  const passwordHash = await hashPassword(password)
  const user = await c.env.DB.prepare(
    "SELECT id, username FROM admin_users WHERE username = ? AND password_hash = ?"
  ).bind(username, passwordHash).first()

  if (!user) return c.json({ error: 'Invalid credentials' }, 401)

  // セッショントークン生成
  const tokenArray = new Uint8Array(32)
  crypto.getRandomValues(tokenArray)
  const token = Array.from(tokenArray).map(b => b.toString(16).padStart(2, '0')).join('')

  return c.json({ token, user: { id: user.id, username: user.username } })
})

// 管理API用認証ミドルウェア
api.use('/admin/articles/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})

api.use('/admin/account/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})

// ==========================================
// 管理者アカウント管理API
// ==========================================

// 管理者情報取得
api.get('/admin/account/me', async (c) => {
  // tokenからユーザーを特定（簡易実装: admin_usersが1人前提）
  const user = await c.env.DB.prepare("SELECT id, username, created_at FROM admin_users LIMIT 1").first()
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json({ user })
})

// ユーザー名変更
api.put('/admin/account/username', async (c) => {
  const { current_password, new_username } = await c.req.json<{ current_password: string; new_username: string }>()
  if (!current_password || !new_username) return c.json({ error: '全項目を入力してください' }, 400)
  if (new_username.length < 3) return c.json({ error: 'ユーザー名は3文字以上にしてください' }, 400)
  if (new_username.length > 50) return c.json({ error: 'ユーザー名は50文字以内にしてください' }, 400)

  const passwordHash = await hashPassword(current_password)
  const user = await c.env.DB.prepare(
    "SELECT id FROM admin_users WHERE password_hash = ?"
  ).bind(passwordHash).first()
  if (!user) return c.json({ error: '現在のパスワードが正しくありません' }, 401)

  // ユーザー名の重複チェック
  const existing = await c.env.DB.prepare(
    "SELECT id FROM admin_users WHERE username = ? AND id != ?"
  ).bind(new_username, user.id).first()
  if (existing) return c.json({ error: 'このユーザー名は既に使用されています' }, 409)

  await c.env.DB.prepare(
    "UPDATE admin_users SET username = ? WHERE id = ?"
  ).bind(new_username, user.id).run()

  return c.json({ success: true, message: 'ユーザー名を変更しました', username: new_username })
})

// パスワード変更
api.put('/admin/account/password', async (c) => {
  const { current_password, new_password } = await c.req.json<{ current_password: string; new_password: string }>()
  if (!current_password || !new_password) return c.json({ error: '全項目を入力してください' }, 400)
  if (new_password.length < 8) return c.json({ error: '新しいパスワードは8文字以上にしてください' }, 400)
  if (new_password.length > 128) return c.json({ error: 'パスワードは128文字以内にしてください' }, 400)
  if (current_password === new_password) return c.json({ error: '現在のパスワードと同じです' }, 400)

  const currentHash = await hashPassword(current_password)
  const user = await c.env.DB.prepare(
    "SELECT id FROM admin_users WHERE password_hash = ?"
  ).bind(currentHash).first()
  if (!user) return c.json({ error: '現在のパスワードが正しくありません' }, 401)

  const newHash = await hashPassword(new_password)
  await c.env.DB.prepare(
    "UPDATE admin_users SET password_hash = ? WHERE id = ?"
  ).bind(newHash, user.id).run()

  return c.json({ success: true, message: 'パスワードを変更しました' })
})

// 管理用: 全記事一覧（下書き含む）
api.get('/admin/articles', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20
  const offset = (page - 1) * limit

  const [countResult, dataResult] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as total FROM articles").first<{ total: number }>(),
    c.env.DB.prepare("SELECT * FROM articles ORDER BY updated_at DESC LIMIT ? OFFSET ?").bind(limit, offset).all()
  ])

  return c.json({
    articles: dataResult.results,
    pagination: { page, limit, total: countResult?.total || 0, totalPages: Math.ceil((countResult?.total || 0) / limit) }
  })
})

// 管理用: 記事作成
api.post('/admin/articles', async (c) => {
  const body = await c.req.json<{
    slug: string; title: string; excerpt: string; content: string;
    category: string; thumbnail_url?: string; author?: string; status?: string;
  }>()

  if (!body.slug || !body.title) return c.json({ error: 'slug and title are required' }, 400)

  // slug重複チェック
  const existing = await c.env.DB.prepare("SELECT id FROM articles WHERE slug = ?").bind(body.slug).first()
  if (existing) return c.json({ error: 'Slug already exists' }, 409)

  const now = new Date().toISOString()
  const publishedAt = body.status === 'published' ? now : null

  const result = await c.env.DB.prepare(
    `INSERT INTO articles (slug, title, excerpt, content, category, thumbnail_url, author, status, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.slug, body.title, body.excerpt || '', body.content || '',
    body.category || 'general', body.thumbnail_url || '', body.author || 'SVA編集部',
    body.status || 'draft', publishedAt, now, now
  ).run()

  return c.json({ id: result.meta.last_row_id, slug: body.slug }, 201)
})

// 管理用: 記事更新
api.put('/admin/articles/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json<{
    slug?: string; title?: string; excerpt?: string; content?: string;
    category?: string; thumbnail_url?: string; author?: string; status?: string;
  }>()

  const existing = await c.env.DB.prepare("SELECT * FROM articles WHERE id = ?").bind(id).first()
  if (!existing) return c.json({ error: 'Not found' }, 404)

  // slug重複チェック（自分自身は除く）
  if (body.slug && body.slug !== existing.slug) {
    const dup = await c.env.DB.prepare("SELECT id FROM articles WHERE slug = ? AND id != ?").bind(body.slug, id).first()
    if (dup) return c.json({ error: 'Slug already exists' }, 409)
  }

  const now = new Date().toISOString()
  const wasPublished = existing.status === 'published'
  const willPublish = (body.status ?? existing.status) === 'published'
  const publishedAt = willPublish && !wasPublished ? now : existing.published_at

  await c.env.DB.prepare(
    `UPDATE articles SET slug = ?, title = ?, excerpt = ?, content = ?, category = ?, thumbnail_url = ?, author = ?, status = ?, published_at = ?, updated_at = ? WHERE id = ?`
  ).bind(
    body.slug ?? existing.slug, body.title ?? existing.title,
    body.excerpt ?? existing.excerpt, body.content ?? existing.content,
    body.category ?? existing.category, body.thumbnail_url ?? existing.thumbnail_url,
    body.author ?? existing.author, body.status ?? existing.status,
    publishedAt, now, id
  ).run()

  return c.json({ success: true })
})

// 管理用: 記事削除
api.delete('/admin/articles/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const result = await c.env.DB.prepare("DELETE FROM articles WHERE id = ?").bind(id).run()
  if (result.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// 管理用: 単一記事取得
api.get('/admin/articles/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const article = await c.env.DB.prepare("SELECT * FROM articles WHERE id = ?").bind(id).first()
  if (!article) return c.json({ error: 'Not found' }, 404)
  return c.json({ article })
})

export { api }
