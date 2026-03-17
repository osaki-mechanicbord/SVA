-- Email templates table for customizable email content
CREATE TABLE IF NOT EXISTS email_templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  template_key TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  body_intro TEXT NOT NULL DEFAULT '',
  body_footer TEXT NOT NULL DEFAULT '',
  sender_name TEXT NOT NULL DEFAULT 'SVA',
  cta_text TEXT NOT NULL DEFAULT '',
  cta_url TEXT NOT NULL DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert default template for job notification
INSERT OR IGNORE INTO email_templates (template_key, subject, body_intro, body_footer, sender_name, cta_text, cta_url)
VALUES (
  'job_notification',
  '【SVA】新しい取付依頼が届きました: {{job_title}}',
  'SVAから新しい取付依頼が届きました。\n内容をご確認のうえ、受諾・辞退のご対応をお願いいたします。',
  'このメールはSVA (Special Vehicle Assist) システムから自動送信されています。\nご不明点は sva-assist.com までお問い合わせください。',
  'SVA',
  'マイページで確認する',
  'https://sva-assist.com/partner/mypage'
);
