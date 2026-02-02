import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { db } from "./db";
import { todos } from "./db/schema";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/api/todos", async () => {
    return await db.select().from(todos).all();
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
