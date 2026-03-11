-- =============================================
-- 案件詳細情報の充実 & 作業写真テーブル
-- =============================================

-- 送り状NO（荷物追跡用）
ALTER TABLE jobs ADD COLUMN tracking_number TEXT NOT NULL DEFAULT '';

-- 車両情報（自由入力）
ALTER TABLE jobs ADD COLUMN maker_name TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN car_model TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN car_model_code TEXT NOT NULL DEFAULT '';

-- 作業報告
ALTER TABLE jobs ADD COLUMN work_report TEXT NOT NULL DEFAULT '';

-- パートナーメモ（自由記載欄 - 既存 partner_memo はステータス用、こちらは作業全般メモ）
ALTER TABLE jobs ADD COLUMN general_memo TEXT NOT NULL DEFAULT '';

-- =============================================
-- 作業写真テーブル（案件ごとに写真を格納）
-- =============================================
CREATE TABLE IF NOT EXISTS job_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  -- 写真カテゴリ
  -- 通常作業: caution_plate(コーションプレート), pre_install(取付前製品), power_source(電源取得箇所), ground_point(アース取得箇所), completed(取付完了)
  -- クレーム作業: claim_caution_plate(コーションプレート), claim_fault(故障原因箇所/不良個所), claim_repair(修理内容)
  category TEXT NOT NULL CHECK(category IN (
    'caution_plate', 'pre_install', 'power_source', 'ground_point', 'completed',
    'claim_caution_plate', 'claim_fault', 'claim_repair', 'other'
  )),
  -- 写真データ（Base64）
  photo_data TEXT NOT NULL,
  mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
  file_name TEXT NOT NULL DEFAULT '',
  -- メタ情報
  caption TEXT NOT NULL DEFAULT '',
  uploaded_by TEXT NOT NULL DEFAULT 'partner',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_job_photos_job_id ON job_photos(job_id);
CREATE INDEX IF NOT EXISTS idx_job_photos_category ON job_photos(category);
