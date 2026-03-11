-- =============================================
-- 案件No（自由入力）& PDF添付ファイル管理
-- =============================================

-- 案件Noカラム追加（SVA側が自由入力、パートナーが請求時に使用）
ALTER TABLE jobs ADD COLUMN job_number TEXT NOT NULL DEFAULT '';

-- 案件No検索用インデックス
CREATE INDEX IF NOT EXISTS idx_jobs_job_number ON jobs(job_number);

-- 案件添付ファイルテーブル（取付詳細マニュアルPDF等）
CREATE TABLE IF NOT EXISTS job_attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  file_name TEXT NOT NULL DEFAULT '',
  file_data TEXT NOT NULL,          -- Base64エンコード
  mime_type TEXT NOT NULL DEFAULT 'application/pdf',
  file_size INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  uploaded_by TEXT NOT NULL DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_job_attachments_job_id ON job_attachments(job_id);
