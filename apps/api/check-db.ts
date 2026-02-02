import { db } from "./src/db";
import { todos } from "./src/db/schema";

try {
  const result = await db.select().from(todos).all();
  console.log("Database connection successful. Todos count:", result.length);
  process.exit(0);
} catch (error) {
  console.error("Database check failed:", error);
  process.exit(1);
}
