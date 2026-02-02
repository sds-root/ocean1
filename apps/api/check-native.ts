import Database from "better-sqlite3";

try {
  console.log("Opening database...");
  const db = new Database("apps/api/sqlite.db");
  
  console.log("Creating table if not exists...");
  db.exec("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
  
  console.log("Inserting data...");
  db.prepare("INSERT INTO test (name) VALUES (?)").run("Bun");
  
  console.log("Querying data...");
  const result = db.prepare("SELECT * FROM test").all();
  console.log("Result:", result);
  
  console.log("✅ better-sqlite3 check passed");
  process.exit(0);
} catch (error) {
  console.error("❌ better-sqlite3 check failed:", error);
  process.exit(1);
}
