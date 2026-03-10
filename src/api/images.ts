import { Hono } from 'hono'

type Bindings = { DB: D1Database }

const imagesApi = new Hono<{ Bindings: Bindings }>()

// Max upload size: 2MB
const MAX_FILE_SIZE = 2 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

// ==========================================
// Public: 画像配信
// ==========================================
imagesApi.get('/images/:filename', async (c) => {
  const filename = c.req.param('filename')
  const image = await c.env.DB.prepare(
    "SELECT data, mime_type FROM images WHERE filename = ?"
  ).bind(filename).first<{ data: string; mime_type: string }>()

  if (!image) return c.notFound()

  const binaryStr = atob(image.data)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }

  c.header('Content-Type', image.mime_type)
  c.header('Cache-Control', 'public, max-age=31536000, immutable')
  return c.body(bytes.buffer as ArrayBuffer)
})

// ==========================================
// Admin: 画像管理API（認証必須）
// ==========================================

// 認証ミドルウェア
imagesApi.use('/admin/images/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})

// 画像アップロード
imagesApi.post('/admin/images/upload', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return c.json({ error: 'ファイルが選択されていません' }, 400)
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return c.json({
        error: '対応していないファイル形式です。JPEG, PNG, WebP, GIF, SVG のみアップロードできます。',
        allowed: ALLOWED_TYPES
      }, 400)
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1)
      return c.json({
        error: `ファイルサイズが上限を超えています（${sizeMB}MB）。2MB以下の画像を使用してください。`,
        maxSize: '2MB',
        actualSize: sizeMB + 'MB'
      }, 400)
    }

    // Generate unique filename
    const ext = getExtension(file.type)
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomStr}${ext}`

    // Read file as base64
    const arrayBuffer = await file.arrayBuffer()
    const uint8 = new Uint8Array(arrayBuffer)
    let binaryStr = ''
    for (let i = 0; i < uint8.length; i++) {
      binaryStr += String.fromCharCode(uint8[i])
    }
    const base64 = btoa(binaryStr)

    // Store in D1
    const result = await c.env.DB.prepare(
      `INSERT INTO images (filename, original_name, mime_type, size, data, created_at) VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(
      filename,
      file.name || 'unnamed',
      file.type,
      file.size,
      base64,
      new Date().toISOString()
    ).run()

    const imageUrl = `/media/images/${filename}`

    return c.json({
      id: result.meta.last_row_id,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      sizeFormatted: formatFileSize(file.size),
      url: imageUrl
    }, 201)
  } catch (err: any) {
    return c.json({ error: 'アップロードに失敗しました: ' + (err.message || '') }, 500)
  }
})

// 画像一覧
imagesApi.get('/admin/images', async (c) => {
  const page = Math.max(1, Number(c.req.query('page')) || 1)
  const limit = 20
  const offset = (page - 1) * limit

  const [countResult, dataResult] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) as total FROM images").first<{ total: number }>(),
    c.env.DB.prepare(
      "SELECT id, filename, original_name, mime_type, size, created_at FROM images ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all()
  ])

  const total = countResult?.total || 0
  const images = (dataResult.results || []).map((img: any) => ({
    ...img,
    url: `/media/images/${img.filename}`,
    sizeFormatted: formatFileSize(img.size)
  }))

  return c.json({
    images,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  })
})

// 画像削除
imagesApi.delete('/admin/images/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const result = await c.env.DB.prepare("DELETE FROM images WHERE id = ?").bind(id).run()
  if (result.meta.changes === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

// ===== Helpers =====
function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp',
    'image/gif': '.gif', 'image/svg+xml': '.svg'
  }
  return map[mimeType] || '.bin'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export { imagesApi }
