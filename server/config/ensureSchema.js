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
  "material_purchases",
  "material_usage",
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
}
