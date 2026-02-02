import { db } from "./db";

console.log("Mock DB test:");
const result = await db.select().from({} as any).all();
console.log(JSON.stringify(result, null, 2));
