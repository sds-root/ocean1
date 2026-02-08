import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { db } from "./db";
import { todos } from "./db/schema";

const app = new Elysia()
  .use(cors())
  .get("/", () => "Hello Elysia")
  .get("/api/todos", async () => {
    return await db.select().from(todos).all();
  })
  .post("/api/chat", async ({ body }: { body: any }) => {
    const { messages, selectedService } = body;
    const provider = process.env.LLM_PROVIDER || "gemini";

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    // const ollama = createOpenAI({
    //   baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/api",
    // });

    const model = provider === "ollama" 
      ? createOpenAI({ 
          baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434/v1", // Corrected: /v1 for OpenAI compatibility
          apiKey: "ollama" 
        })(process.env.OLLAMA_MODEL || "llama3") 
      : google("gemini-2.0-flash");

    try {
      const result = streamText({
        model,
        messages,
        system: `너는 유능한 비서야. 사용자의 언어에 맞춰 짧고 자연스럽게 다음 서비스에 관련해 답해줘: ${selectedService || "Unknown"}.`,
      });

      // Use the standard Data Stream Protocol for v6
      // NOTE: In v6, toDataStreamResponse has been renamed to toUIMessageStreamResponse?
      // Wait, user still gets "is not a function".
      // Let's check if the method is actually called `toTextStreamResponse` or similar based on latest docs.
      // Based on Vercel AI SDK v6 docs, `streamText` result has `toDataStreamResponse`.
      // BUT if it fails, let's try `toTextStreamResponse` which is definitely there for simple text.
      return result.toTextStreamResponse({
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        }
      });
    } catch (error) {
      console.error("Handler Error:", error); // Check terminal for this log
      return new Response(JSON.stringify({ error: (error as any)?.message || "Internal Server Error" }), { status: 500 });
    }
  })
  .listen(3000);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
