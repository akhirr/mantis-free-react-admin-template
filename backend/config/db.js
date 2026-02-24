//import pkg from "pg";
//import dotenv from "dotenv";

//dotenv.config();

//const { Pool } = pkg;

//const pool = new Pool({
  //host: process.env.DB_HOST || "localhost",
  //user: process.env.DB_USER || "postgres",
  //password: process.env.DB_PASS || "12345",
  //database: process.env.DB_NAME || "dbekinerja",
  //port: process.env.DB_PORT || 5432,
  //ssl: false
//});

// Test koneksi saat server start
//pool.on("connect", () => {
  //console.log("✅ PostgreSQL Connected");
//});

//pool.on("error", (err) => {
  //console.error("❌ PostgreSQL Error:", err);
  //process.exit(1);
//});

//export default pool; 
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

function makePool(prefix, defaults) {
  const pool = new Pool({
    host: process.env[`${prefix}_HOST`] ?? defaults.host,
    port: Number(process.env[`${prefix}_PORT`] ?? defaults.port),
    user: process.env[`${prefix}_USER`] ?? defaults.user,
    password: process.env[`${prefix}_PASS`] ?? defaults.password,
    database: process.env[`${prefix}_NAME`] ?? defaults.database,

    // Kalau DB publik kamu pakai SSL, ubah jadi { rejectUnauthorized: false }
    ssl: false,
  });

  pool.on("connect", () => {
    console.log(`✅ PostgreSQL Connected (${prefix})`);
  });

  pool.on("error", (err) => {
    console.error(`❌ PostgreSQL Error (${prefix}):`, err);
  });

  return pool;
}

export const poolLocal = makePool("DBL", {
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "12345",
  database: "dbekinerja",
});

export const poolPublic = makePool("DBP", {
  host: "103.169.42.166",
  port: 5430,
  user: "postgres",
  password: "DBEkinP4sid!!",
  database: "dbsaiber",
});

// Helper: pilih pool berdasarkan nama
export function getPool(which = process.env.DB_ACTIVE) {
  return which === "public" ? poolPublic : poolLocal;
}

// Biar kode lama yang `import pool from ...` tetap jalan:
const pool = getPool();
export default pool;