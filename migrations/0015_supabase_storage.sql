-- =============================================
-- Supabase Storage 移行
-- D1にはメタデータ + Supabase public URLのみ保存
-- 画像バイナリはSupabase Storageに保存
-- =============================================

-- Supabase Storage の公開URL
ALTER TABLE job_photos ADD COLUMN supabase_url TEXT NOT NULL DEFAULT '';

-- インデックス
CREATE INDEX IF NOT EXISTS idx_job_photos_supabase_url ON job_photos(supabase_url);

-- 画像取得の優先順位:
-- 1. supabase_url が空でなければ → 直接URLで表示（CDN配信、Workers経由不要）
-- 2. r2_key が空でなければ → R2から取得（PHOTOS binding必要）
-- 3. photo_data が空でなければ → Base64デコード（レガシー）
