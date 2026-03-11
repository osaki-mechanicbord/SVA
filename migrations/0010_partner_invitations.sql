-- =============================================
-- パートナー招待リンク管理テーブル
-- 管理者が発行 → パートナーが初回登録
-- =============================================

CREATE TABLE IF NOT EXISTS partner_invitations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE NOT NULL,
  memo TEXT NOT NULL DEFAULT '',
  rank TEXT NOT NULL DEFAULT 'standard' CHECK(rank IN ('standard','silver','gold','platinum')),
  max_uses INTEGER NOT NULL DEFAULT 1,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  created_by TEXT NOT NULL DEFAULT 'admin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invite_token ON partner_invitations(token);
CREATE INDEX IF NOT EXISTS idx_invite_expires ON partner_invitations(expires_at);

-- パートナーテーブルに招待元を記録
ALTER TABLE partners ADD COLUMN invited_by_token TEXT NOT NULL DEFAULT '';
