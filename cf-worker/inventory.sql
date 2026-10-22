CREATE TABLE IF NOT EXISTS static_inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL DEFAULT 1,
  card_info TEXT NOT NULL,
  account TEXT, password TEXT,
  is_sold INTEGER NOT NULL DEFAULT 0,
  sold_to TEXT, sold_at INTEGER, created_at INTEGER
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_card ON static_inventory(card_info);
