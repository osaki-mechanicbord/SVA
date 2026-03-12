-- 製品マスタテーブル
CREATE TABLE IF NOT EXISTS product_master (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name TEXT NOT NULL,
  model_number TEXT DEFAULT '',
  category TEXT DEFAULT 'camera',
  description TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_master_active ON product_master(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_product_master_category ON product_master(category);

-- 初期シードデータ（既存ハードコード製品をDB化）
INSERT OR IGNORE INTO product_master (product_name, model_number, category, description, sort_order, is_active) VALUES
  ('人検知AIカメラ FLC-1', 'FLC-1', 'camera', 'フォークリフト用 人検知AIカメラ スタンダードモデル', 10, 1),
  ('人検知AIカメラ FLC-2', 'FLC-2', 'camera', 'フォークリフト用 人検知AIカメラ 上位モデル', 20, 1),
  ('フォークリフト用バックカメラ', 'BC-100', 'camera', 'フォークリフト後方確認用カメラ', 30, 1),
  ('衝突防止センサー', 'CPS-200', 'sensor', '接近検知・衝突防止センサー', 40, 1),
  ('安全灯（ブルーライト）', 'SL-B01', 'light', 'フォークリフト進行方向警告灯（青）', 50, 1),
  ('安全灯（レッドゾーンライト）', 'SL-R01', 'light', 'フォークリフト危険区域表示灯（赤）', 60, 1),
  ('速度制限装置', 'SPD-100', 'control', '走行速度制限制御装置', 70, 1),
  ('ドライブレコーダー DR-100', 'DR-100', 'recorder', 'フォークリフト用ドライブレコーダー', 80, 1),
  ('タイヤ空気圧モニター', 'TPM-50', 'monitor', 'タイヤ空気圧リアルタイムモニタリング', 90, 1),
  ('バッテリーモニター', 'BM-30', 'monitor', 'バッテリー残量・健康状態モニター', 100, 1);
