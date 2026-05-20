import pool from "../config/db.js";

const tables = [
  "users",
  "sites",
  "materials",
  "vendors",
  "material_purchases",
  "material_usage",
  "vendor_payments",
  "labours",
  "attendance",
  "wages",
  "labour_payments",
  "clients",
  "receivables",
  "payments",
  "expenses",
  "reports",
];

try {
  const { rows } = await pool.query(
    `
    SELECT table_name, column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = $1
      AND table_name = ANY($2)
    ORDER BY table_name, ordinal_position
    `,
    ["public", tables]
  );

  console.log(JSON.stringify(rows, null, 2));
} finally {
  await pool.end();
}
