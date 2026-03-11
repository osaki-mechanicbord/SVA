-- =============================================
-- お客様詳細情報 & 費用情報カラム追加
-- 受諾→対応開始後にパートナーへ開示される情報
-- =============================================

-- お客様詳細情報
ALTER TABLE jobs ADD COLUMN client_company TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN client_branch TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN client_contact_name TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN client_contact_phone TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN client_contact_email TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN work_location_detail TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN work_datetime TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN vehicle_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN urgent_contact_note TEXT NOT NULL DEFAULT '';

-- 取付製品準備区分
ALTER TABLE jobs ADD COLUMN products_maker TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN products_customer TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN products_partner TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN products_local TEXT NOT NULL DEFAULT '';

-- 費用情報（税抜金額で保存、表示時に10%計算）
ALTER TABLE jobs ADD COLUMN cost_labor INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN cost_travel INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN cost_other INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN cost_preliminary INTEGER NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN cost_memo TEXT NOT NULL DEFAULT '';
