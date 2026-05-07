import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();

const db = new sqlite.Database(
  "./receipts.db",
  (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Connected to SQLite database");
    }
  }
);

db.run(`
CREATE TABLE IF NOT EXISTS receipts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant TEXT,
  date TEXT,
  lineItems TEXT,
  total REAL
)
`);

export default db;