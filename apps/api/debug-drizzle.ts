import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { todos } from './src/db/schema';

console.log("Init DB...");
const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);
console.log("DB Init done.");

try {
    console.log("Running select...");
    const res = await db.select().from(todos).all();
    console.log("Select done:", res);
} catch (e) {
    console.error("Error:", e);
}
