-- =============================================
-- 車両明細 & 商品構成テーブル
-- 案件(jobs) → 車両明細(job_vehicles) → 取付商品(vehicle_products)
-- job_photos に vehicle_id を追加して車両単位で写真管理
-- =============================================

-- 車両明細テーブル（案件に紐づく個々の車両）
CREATE TABLE IF NOT EXISTS job_vehicles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  seq INTEGER NOT NULL DEFAULT 1,
  maker_name TEXT NOT NULL DEFAULT '',
  car_model TEXT NOT NULL DEFAULT '',
  car_model_code TEXT NOT NULL DEFAULT '',
  vehicle_memo TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','in_progress','completed','issue')),
  work_report TEXT NOT NULL DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_job_vehicles_job_id ON job_vehicles(job_id);
CREATE INDEX IF NOT EXISTS idx_job_vehicles_status ON job_vehicles(status);

-- 車両ごとの取付商品テーブル
CREATE TABLE IF NOT EXISTS vehicle_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vehicle_id INTEGER NOT NULL,
  product_name TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  serial_number TEXT NOT NULL DEFAULT '',
  memo TEXT NOT NULL DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES job_vehicles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vehicle_products_vehicle_id ON vehicle_products(vehicle_id);

-- job_photos に vehicle_id カラム追加（既存写真は vehicle_id=NULL で案件全体扱い）
ALTER TABLE job_photos ADD COLUMN vehicle_id INTEGER REFERENCES job_vehicles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_job_photos_vehicle_id ON job_photos(vehicle_id);
