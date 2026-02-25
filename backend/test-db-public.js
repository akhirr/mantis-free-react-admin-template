import pool from "./config/db.js";

try {
  const r1 = await pool.query("SELECT current_database() db, inet_server_addr() ip, inet_server_port() port");
  console.log("Connected to:", r1.rows[0]);

  const r2 = await pool.query('SELECT COUNT(*)::int AS total FROM public.absen');
  console.log("Total rows public.absen:", r2.rows[0].total);

  const r3 = await pool.query("SELECT id, nip, filepath, \"createdAt\" FROM public.absen ORDER BY id DESC LIMIT 5");
  console.table(r3.rows);

  process.exit(0);
} catch (e) {
  console.error("DB TEST FAILED:", e.message);
  console.error(e);
  process.exit(1);
}