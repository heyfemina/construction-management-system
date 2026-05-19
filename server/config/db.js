import dotenv from "dotenv";
import pkg from "pg";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to server/.env.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then((client) => {
    console.log(
      "Supabase PostgreSQL Connected"
    );
    client.release();
  })
  .catch((err) => {
    console.log(
      "FULL DATABASE ERROR:"
    );

    console.log(err);
  });

export default pool;
