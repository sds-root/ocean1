import { spawn } from "bun";

console.log("Starting server for verification...");
const server = spawn(["bun", "run", "apps/api/src/index.ts"], {
  cwd: process.cwd(),
  stdout: "pipe",
  stderr: "pipe",
});

// Wait for server to start
await new Promise(resolve => setTimeout(resolve, 3000));

try {
  console.log("Fetching /api/todos...");
  const response = await fetch("http://localhost:3000/api/todos");
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  console.log("Data received:", data);
  
  if (Array.isArray(data)) {
    console.log("✅ Server verification SUCCESS");
    process.exit(0);
  } else {
    console.error("❌ Verification FAILED: Expected array");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Verification FAILED:", error);
  // Read stderr to see if there were server errors
  // We can't easily read the stream here without blocking, but let's just exit
  process.exit(1);
} finally {
  server.kill();
}
