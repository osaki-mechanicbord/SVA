import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { topPage } from './pages/top'
import { llmsTxt, llmsFullTxt, aiTxt, sitemapXml, robotsTxt } from './pages/llms'
import { adminPage } from './pages/admin'
import { adminSamplePage } from './pages/admin-sample'
import { columnListPage } from './pages/column-list'
import { columnDetailPage } from './pages/column-detail'
import { partnerLoginPage } from './pages/partner-login'
import { partnerMypagePage } from './pages/partner-mypage'
import { partnerInvitePage } from './pages/partner-invite'
import { privacyPage, termsPage, tokushohoPage, sitemapHtmlPage } from './pages/legal'
import { servicePage, getServiceSlugs, getServiceList } from './pages/service'
import { api } from './api/articles'
import { imagesApi } from './api/images'
import { partnerApi } from './api/partner'
import { adminPartnerApi } from './api/admin-partner'

type Bindings = { DB: D1Database; PHOTOS?: R2Bucket; SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string; SUPABASE_SERVICE_KEY?: string }

const app = new Hono<{ Bindings: Bindings }>()

// Security headers
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdn.jsdelivr.net", "https://static.cloudflareinsights.com"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
    fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'", "https://cloudflareinsights.com"],
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

// CMS Admin sample (vehicle detail management demo)
app.get('/admin/sample', (c) => {
  return c.html(adminSamplePage())
})

// Partner pages
app.get('/partner/login', (c) => {
  return c.html(partnerLoginPage())
})

app.get('/partner/mypage', (c) => {
  return c.html(partnerMypagePage())
})

// Partner invitation registration
app.get('/partner/invite/:token', (c) => {
  const token = c.req.param('token')
  return c.html(partnerInvitePage(token))
})

// ==========================================
// Service Pages (vehicle-specific)
// ==========================================
app.get('/service/:slug', (c) => {
  const slug = c.req.param('slug')
  const html = servicePage(slug)
  if (!html) {
    return c.html('<html><body><h1>404 - ページが見つかりません</h1><p><a href="/">トップに戻る</a></p></body></html>', 404)
  }
  return c.html(html)
})

// ==========================================
// Legal Pages
// ==========================================

app.get('/privacy', (c) => {
  return c.html(privacyPage())
})

app.get('/terms', (c) => {
  return c.html(termsPage())
})

app.get('/tokushoho', (c) => {
  return c.html(tokushohoPage())
})

app.get('/sitemap', async (c) => {
  try {
    const articles = await c.env.DB.prepare(
      "SELECT slug, title, category FROM articles WHERE status = 'published' ORDER BY published_at DESC"
    ).all()
    return c.html(sitemapHtmlPage(articles.results as any[]))
  } catch {
    return c.html(sitemapHtmlPage([]))
  }
})

// ==========================================
// SEO / LLMO Routes
// ==========================================

// llms.txt for LLMO (summary)
app.get('/llms.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=3600')
  return c.text(llmsTxt())
})

// llms-full.txt for LLMO (detailed)
app.get('/llms-full.txt', async (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=3600')
  // Include latest articles in llms-full.txt
  try {
    const articles = await c.env.DB.prepare(
      "SELECT slug, title, excerpt, category, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 20"
    ).all()
    return c.text(llmsFullTxt(articles.results as any[]))
  } catch {
    return c.text(llmsFullTxt([]))
  }
})

// ai.txt - AI policy
app.get('/ai.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.text(aiTxt())
})

// robots.txt
app.get('/robots.txt', (c) => {
  c.header('Content-Type', 'text/plain; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.text(robotsTxt())
})

// sitemap.xml - dynamic
app.get('/sitemap.xml', async (c) => {
  c.header('Content-Type', 'application/xml; charset=utf-8')
  c.header('Cache-Control', 'public, max-age=3600')
  try {
    const articles = await c.env.DB.prepare(
      "SELECT slug, updated_at FROM articles WHERE status = 'published' ORDER BY published_at DESC"
    ).all()
    return c.text(sitemapXml(articles.results as any[]))
  } catch {
    return c.text(sitemapXml([]))
  }
})

// API health
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', service: 'SVA - Special Vehicle Assist' })
})

// ==========================================
// Contact (お問い合わせ) - Public API
// ==========================================
app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json<{
      name: string; company: string; email: string;
      phone?: string; category: string; message: string
    }>()

    // Validation
    if (!body.name || !body.name.trim()) return c.json({ error: 'お名前は必須です' }, 400)
    if (!body.email || !body.email.trim()) return c.json({ error: 'メールアドレスは必須です' }, 400)
    if (!body.category) return c.json({ error: 'お問い合わせ種別を選択してください' }, 400)
    if (!body.message || !body.message.trim()) return c.json({ error: 'お問い合わせ内容は必須です' }, 400)

    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
      return c.json({ error: '有効なメールアドレスを入力してください' }, 400)
    }

    // Rate limiting check: same email within 5 minutes
    const recent = await c.env.DB.prepare(
      "SELECT COUNT(*) as cnt FROM inquiries WHERE email = ? AND created_at > datetime('now', '-5 minutes')"
    ).bind(body.email.trim()).first<{ cnt: number }>()
    if (recent && recent.cnt >= 3) {
      return c.json({ error: '短時間に複数回送信されています。しばらくお待ちください。' }, 429)
    }

    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || ''
    const ua = c.req.header('User-Agent') || ''

    const r = await c.env.DB.prepare(
      "INSERT INTO inquiries (name, company, email, phone, category, message, ip_address, user_agent) VALUES (?,?,?,?,?,?,?,?)"
    ).bind(
      body.name.trim(),
      (body.company || '').trim(),
      body.email.trim(),
      (body.phone || '').trim(),
      body.category,
      body.message.trim(),
      ip,
      ua.substring(0, 500)
    ).run()

    return c.json({ success: true, id: r.meta.last_row_id })
  } catch (e) {
    return c.json({ error: '送信に失敗しました。時間をおいて再度お試しください。' }, 500)
  }
})

export default app
