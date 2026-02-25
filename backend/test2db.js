import { poolLocal, poolPublic } from "./config/db.js";

async function test() {
  const a = await poolLocal.query("SELECT current_database() db, now() t");
  console.log("LOCAL:", a.rows[0]);

  const b = await poolPublic.query("SELECT current_database() db, now() t");
  console.log("PUBLIC:", b.rows[0]);

  const c = await poolPublic.query('SELECT COUNT(*)::int total FROM public.absen');
  console.log("PUBLIC absen total:", c.rows[0].total);

  process.exit(0);
}

test().catch((e) => {
  console.error("TEST FAILED:", e.message);
  process.exit(1);
});