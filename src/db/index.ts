import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
  __memoryDbFallback?: any;
};

let pool: Pool | null = null;
let dbInstance: any = null;
export let isDatabaseAvailable = false;

// Try to create real pool if DATABASE_URL exists
if (databaseUrl) {
  try {
    pool =
      globalForDb.__arenaNextJsPostgresqlPool ??
      new Pool({
        connectionString: databaseUrl,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });

    if (process.env.NODE_ENV !== "production") {
      globalForDb.__arenaNextJsPostgresqlPool = pool;
    }

    dbInstance = drizzle(pool);
    isDatabaseAvailable = true;
    
    // Test connection async (don't block)
    pool.query("SELECT 1").then(() => {
      console.log("✅ Database connected successfully");
      isDatabaseAvailable = true;
    }).catch((err) => {
      console.error("❌ Database connection failed, using fallback:", err.message);
      isDatabaseAvailable = false;
    });
  } catch (err) {
    console.error("Failed to create pool, using memory fallback:", err);
    isDatabaseAvailable = false;
  }
} else {
  console.warn("⚠️ DATABASE_URL not set, using in-memory fallback for Vercel demo. Set DATABASE_URL in Vercel env vars for persistent storage.");
  isDatabaseAvailable = false;
}

export const poolExport = pool;
export const db = dbInstance;

// Mock DB for fallback - will be replaced by memory implementation in routes
export const getDbStatus = () => ({
  available: isDatabaseAvailable && !!databaseUrl,
  hasUrl: !!databaseUrl,
  isVercel: !!process.env.VERCEL,
});
