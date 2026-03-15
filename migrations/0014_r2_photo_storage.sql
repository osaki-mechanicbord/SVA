-- =============================================
-- R2オブジェクトストレージ移行
-- photo_data (Base64 TEXT) → r2_key (R2オブジェクトキー)
-- =============================================

-- R2キーカラム追加（新規写真はR2に保存）
ALTER TABLE job_photos ADD COLUMN r2_key TEXT NOT NULL DEFAULT '';

-- ファイルサイズカラム追加（バイト単位）
ALTER TABLE job_photos ADD COLUMN file_size INTEGER NOT NULL DEFAULT 0;

-- R2キーのインデックス
CREATE INDEX IF NOT EXISTS idx_job_photos_r2_key ON job_photos(r2_key);

-- 注: 既存のphoto_dataカラムは後方互換のため残す
-- 新規写真: r2_key にR2パス、photo_data は空文字
-- 既存写真: photo_data にBase64データ、r2_key は空文字
-- 画像取得時: r2_key が空でなければR2から取得、空ならphoto_dataからデコード
