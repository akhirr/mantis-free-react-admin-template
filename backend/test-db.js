//import { Client } from 'pg';

//const client = new Client({
  //host: 'localhost',   // IP database
  //port: 5432,
  //user: 'postgres',
  //password: '12345',
  //database: 'dbekinerja'
//});

//client.connect()
  //.then(() => {
    //console.log('✅ Database connected');
    //return client.end();
  //})
  //.catch(err => {
    //console.error('❌ Connection error:', err.message);
  //});

  import pool from "./config/db.js";

try {
  const r = await pool.query("SELECT now() as server_time");
  console.log("✅ DB OK:", r.rows[0]);
  process.exit(0);
} catch (e) {
  console.error("❌ DB FAIL:", e.message);
  process.exit(1);
}