import pool from "./db.js";

const ownedTables = [
  "sites",
  "vendors",
  "materials",
  "labours",
  "expenses",
  "receivables",
  "payments",
  "reports",
  "clients",
  "material_stock",
  "material_purchases",
  "material_usage",
  "vendor_transactions",
  "attendance",
  "wages",
  "vendor_payments",
  "labour_payments",
];

export default async function ensureSchema() {
  for (const table of ownedTables) {
    await pool.query(
      `ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS user_id INTEGER`
    );
  }

  await pool.query(
    "ALTER TABLE labour_payments ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)"
  );

  await pool.query(
    "ALTER TABLE vendor_payments ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50)"
  );

  await pool.query(
    "ALTER TABLE vendors ADD COLUMN IF NOT EXISTS site_id INTEGER REFERENCES sites(id) ON DELETE SET NULL"
  );
}
