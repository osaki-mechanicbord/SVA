-- =============================================
-- パートナーテーブルに住所とインボイス番号を追加
-- =============================================

-- 住所 (郵便番号 + 住所)
ALTER TABLE partners ADD COLUMN postal_code TEXT NOT NULL DEFAULT '';
ALTER TABLE partners ADD COLUMN address TEXT NOT NULL DEFAULT '';

-- インボイス番号 (適格請求書発行事業者登録番号: T + 13桁数字)
ALTER TABLE partners ADD COLUMN invoice_number TEXT NOT NULL DEFAULT '';
