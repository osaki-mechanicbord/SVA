-- =============================================
-- 案件トラッキング用ステータスカラム追加
-- 共通確認ステータス（SVA・パートナー双方が編集可能）
-- =============================================

-- 製品発送ステータス: not_shipped(未発送), shipped(発送済), received(受取済)
ALTER TABLE jobs ADD COLUMN shipping_status TEXT NOT NULL DEFAULT 'not_shipped'
  CHECK(shipping_status IN ('not_shipped', 'shipped', 'received'));

-- 発送日
ALTER TABLE jobs ADD COLUMN shipped_at DATETIME;

-- 受取確認日
ALTER TABLE jobs ADD COLUMN received_at DATETIME;

-- 日程調整ステータス: not_started(未着手), contacting(連絡中), waiting_callback(折り返し待ち), date_confirmed(作業日決定)
ALTER TABLE jobs ADD COLUMN schedule_status TEXT NOT NULL DEFAULT 'not_started'
  CHECK(schedule_status IN ('not_started', 'contacting', 'waiting_callback', 'date_confirmed'));

-- 確定作業日
ALTER TABLE jobs ADD COLUMN confirmed_work_date TEXT NOT NULL DEFAULT '';

-- 作業完了ステータス: scheduling(日程調整中), completed(完了), user_postponed(ユーザー都合延期), self_postponed(自己都合延期), maker_postponed(メーカー都合延期), cancelled(キャンセル)
ALTER TABLE jobs ADD COLUMN work_status TEXT NOT NULL DEFAULT 'scheduling'
  CHECK(work_status IN ('scheduling', 'completed', 'user_postponed', 'self_postponed', 'maker_postponed', 'cancelled'));

-- 作業完了日
ALTER TABLE jobs ADD COLUMN work_completed_at DATETIME;

-- ステータス更新メモ（更新理由や備考）
ALTER TABLE jobs ADD COLUMN status_note TEXT NOT NULL DEFAULT '';

-- 最終ステータス更新者 (admin / partner)
ALTER TABLE jobs ADD COLUMN last_status_updated_by TEXT NOT NULL DEFAULT '';

-- 最終ステータス更新日時
ALTER TABLE jobs ADD COLUMN last_status_updated_at DATETIME;
