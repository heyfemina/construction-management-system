import pool from "../config/db.js";

const { rows } = await pool.query(
  "SELECT id FROM users WHERE email LIKE $1",
  ["smoke-%@example.com"]
);

const userIds = rows.map((row) => row.id);

if (userIds.length > 0) {
  const tables = [
    "reports",
    "payments",
    "receivables",
    "expenses",
    "labour_payments",
    "wages",
    "attendance",
    "labours",
    "vendor_payments",
    "material_usage",
    "material_purchases",
    "materials",
    "vendors",
    "sites",
    "clients",
  ];

  for (const table of tables) {
    await pool.query(
      `DELETE FROM ${table} WHERE user_id = ANY($1)`,
      [userIds]
    );
  }

  await pool.query(
    "DELETE FROM users WHERE id = ANY($1)",
    [userIds]
  );
}

console.log(`Removed ${userIds.length} smoke test user(s).`);
await pool.end();
