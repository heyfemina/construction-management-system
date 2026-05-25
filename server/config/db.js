import dotenv from "dotenv";
import pkg from "pg";
import { fileURLToPath } from "url";

dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
  quiet: true,
});

const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing. Add it to server/.env.");
}

const createPool = (connectionString) =>
  new Pool({
    connectionString,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,

    ssl: {
      rejectUnauthorized: false,
    },
  });

const getDirectSupabaseUrl = (connectionString) => {
  try {
    const url = new URL(connectionString);
    const projectRef = url.username.replace("postgres.", "");

    if (
      !url.hostname.includes("pooler.supabase.com") ||
      projectRef === url.username
    ) {
      return "";
    }

    url.hostname = `db.${projectRef}.supabase.co`;
    url.username = "postgres";
    url.port = "5432";

    return url.toString();
  } catch {
    return "";
  }
};

const isConnectionError = (error) =>
  [
    "EAI_AGAIN",
    "ECONNREFUSED",
    "ECONNRESET",
    "ETIMEDOUT",
    "ENOTFOUND",
    "EHOSTUNREACH",
    "EACCES",
  ].includes(error?.code);

const primaryPool = createPool(databaseUrl);
const fallbackUrl = getDirectSupabaseUrl(databaseUrl);
const fallbackPool = fallbackUrl ? createPool(fallbackUrl) : null;

let activePool = primaryPool;
let loggedFallbackConnection = false;

const runWithFallback = async (operation) => {
  try {
    return await operation(activePool);
  } catch (error) {
    if (!isConnectionError(error)) {
      throw error;
    }

    if (
      activePool === primaryPool &&
      fallbackPool
    ) {
      try {
        const result = await operation(fallbackPool);
        activePool = fallbackPool;
        if (!loggedFallbackConnection) {
          console.log("PostgreSQL connected through direct Supabase host");
          loggedFallbackConnection = true;
        }
        return result;
      } catch (fallbackError) {
        if (!isConnectionError(fallbackError)) {
          throw fallbackError;
        }
      }
    }

    const appError = new Error(
      "Could not complete this request. Please try again."
    );
    appError.code = "DB_UNAVAILABLE";
    throw appError;
  }
};

const pool = {
  query: (...args) =>
    runWithFallback((currentPool) => currentPool.query(...args)),
  connect: () =>
    runWithFallback((currentPool) => currentPool.connect()),
  end: async () => {
    await primaryPool.end();
    if (fallbackPool) {
      await fallbackPool.end();
    }
  },
};

pool.connect()
  .then((client) => {
    console.log("PostgreSQL Connected");
    client.release();
  })
  .catch(() => {
    console.log("PostgreSQL connection is not available yet");
  });

export default pool;
