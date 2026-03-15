/**
 * Supabase Storage ヘルパー
 * Cloudflare Workers環境からSupabase Storage REST APIを呼び出す
 * 
 * 必要な環境変数:
 *   SUPABASE_URL: https://xxxxxxxx.supabase.co
 *   SUPABASE_ANON_KEY: eyJhbGciOi... (公開anonキー)
 *   SUPABASE_SERVICE_KEY: eyJhbGciOi... (サービスロールキー、オプション)
 */

export interface SupabaseConfig {
  url: string       // SUPABASE_URL
  anonKey: string   // SUPABASE_ANON_KEY
  serviceKey?: string // SUPABASE_SERVICE_KEY (オプション、RLSバイパス用)
  bucket: string    // バケット名 (default: 'photos')
}

export interface UploadResult {
  success: boolean
  publicUrl: string     // CDN付き公開URL
  storagePath: string   // Supabase内パス
  error?: string
}

/**
 * Supabase Storageに画像をアップロード
 * バイナリデータをそのままPUT（Base64変換不要）
 */
export async function uploadToSupabase(
  config: SupabaseConfig,
  path: string,
  data: ArrayBuffer | ReadableStream,
  contentType: string
): Promise<UploadResult> {
  const bucket = config.bucket || 'photos'
  const apiKey = config.serviceKey || config.anonKey
  
  // Supabase Storage REST API: Upload file
  const uploadUrl = `${config.url}/storage/v1/object/${bucket}/${path}`
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'apikey': config.anonKey,
        'Content-Type': contentType,
        'x-upsert': 'true', // 上書き許可
      },
      body: data,
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        publicUrl: '',
        storagePath: path,
        error: `Supabase upload failed (${response.status}): ${errorText}`
      }
    }

    // 公開URLを生成
    const publicUrl = `${config.url}/storage/v1/object/public/${bucket}/${path}`

    return {
      success: true,
      publicUrl,
      storagePath: path,
    }
  } catch (e: any) {
    return {
      success: false,
      publicUrl: '',
      storagePath: path,
      error: `Network error: ${e.message || 'Unknown'}`
    }
  }
}

/**
 * Supabase Storageからファイルを削除
 */
export async function deleteFromSupabase(
  config: SupabaseConfig,
  paths: string[]
): Promise<boolean> {
  const bucket = config.bucket || 'photos'
  const apiKey = config.serviceKey || config.anonKey
  
  const deleteUrl = `${config.url}/storage/v1/object/${bucket}`
  
  try {
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'apikey': config.anonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prefixes: paths }),
    })
    return response.ok
  } catch {
    return false
  }
}

/**
 * Supabase設定を環境変数から取得
 */
export function getSupabaseConfig(env: any): SupabaseConfig | null {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) return null
  return {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceKey: env.SUPABASE_SERVICE_KEY || undefined,
    bucket: 'photos',
  }
}

/**
 * アップロード用のパスを生成
 * 形式: jobs/{jobId}/vehicles/{vid}/{category}/{timestamp}_{random}.{ext}
 */
export function generateStoragePath(
  jobId: number,
  category: string,
  fileName: string,
  vehicleId?: number
): string {
  const ext = fileName?.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const name = `${timestamp}_${random}.${ext}`
  
  if (vehicleId) {
    return `jobs/${jobId}/vehicles/${vehicleId}/${category}/${name}`
  }
  return `jobs/${jobId}/photos/${category}/${name}`
}
