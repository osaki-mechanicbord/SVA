import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { topPage } from './pages/top'
import { llmsTxt } from './pages/llms'
import { adminPage } from './pages/admin'
import { columnListPage } from './pages/column-list'
import { columnDetailPage } from './pages/column-detail'
import { partnerLoginPage } from './pages/partner-login'
import { partnerMypagePage } from './pages/partner-mypage'
import { api } from './api/articles'
import { imagesApi } from './api/images'
import { partnerApi } from './api/partner'
import { adminPartnerApi } from './api/admin-partner'

type Bindings = { DB: D1Database }

const app = new Hono<{ Bindings: Bindings }>()

// Security headers
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
  },
  strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
}))

app.use('/api/*', cors())

// ==========================================
// API Routes
// ==========================================
app.route('/api', api)
app.route('/api/partner', partnerApi)
app.route('/api/admin', adminPartnerApi)
app.route('/media', imagesApi)
app.route('/api', imagesApi)

// ==========================================
// Page Routes
// ==========================================

// Top page (with latest articles from DB)
app.get('/', async (c) => {
  try {
    const result = await c.env.DB.prepare(
      "SELECT slug, title, excerpt, category, thumbnail_url, author, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 3"
    ).all()
    return c.html(topPage(result.results as any[]))
  } catch {
    return c.html(topPage([]))
  }
})

// Column list page
app.get('/column', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const category = c.req.query('category') || ''
  const limit = 9
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

  try {
    const [countResult, dataResult] = await Promise.all([
      c.env.DB.prepare(countQuery).bind(...params).first<{ total: number }>(),
      c.env.DB.prepare(dataQuery).bind(...params, limit, offset).all()
    ])

    const total = countResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    return c.html(columnListPage(
      dataResult.results as any[],
      { page, limit, total, totalPages },
      category
    ))
  } catch {
    return c.html(columnListPage([], { page: 1, limit, total: 0, totalPages: 0 }, ''))
  }
})

// Column article detail page
app.get('/column/:slug', async (c) => {
  const slug = c.req.param('slug')

  try {
    const article = await c.env.DB.prepare(
      "SELECT * FROM articles WHERE slug = ? AND status = 'published'"
    ).bind(slug).first()

    if (!article) {
      return c.html('<html><body><h1>404 - 記事が見つかりません</h1><p><a href="/column">コラム一覧に戻る</a></p></body></html>', 404)
    }

    // Related articles (same category, excluding current)
    const related = await c.env.DB.prepare(
      "SELECT slug, title, category, published_at FROM articles WHERE status = 'published' AND category = ? AND slug != ? ORDER BY published_at DESC LIMIT 5"
    ).bind(article.category, slug).all()

    return c.html(columnDetailPage(article as any, related.results as any[]))
  } catch {
    return c.html('<html><body><h1>エラーが発生しました</h1><p><a href="/column">コラム一覧に戻る</a></p></body></html>', 500)
  }
})

// CMS Admin page
app.get('/admin', (c) => {
  return c.html(adminPage())
})

// Partner pages
app.get('/partner/login', (c) => {
  return c.html(partnerLoginPage())
})

app.get('/partner/mypage', (c) => {
  return c.html(partnerMypagePage())
})

// llms.txt for LLMO
app.get('/llms.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  return c.text(llmsTxt())
})

// API health
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'SVA - Special Vehicle Assist' })
})

export default app
