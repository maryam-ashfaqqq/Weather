import pool from "./db.js";
export async function getHistory() {
  const [rows] = await pool.query("SELECT city AS label, city, created_at FROM history ORDER BY created_at DESC LIMIT 10");
  return rows;
}


export async function addHistory(city) {
  const cleanCity = city.trim();
  if (!cleanCity) return;

  
  const [old] = await pool.query("SELECT * FROM history WHERE city = ?", [cleanCity]);
  if (old.length > 0) return;

  await pool.query("INSERT INTO history (city) VALUES (?)", [cleanCity]);
}