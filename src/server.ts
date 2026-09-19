import { createServer } from "node:http";
import { signOutOtherSessions } from "./session_inventory.js";

createServer(async (req, res) => {
  if (req.method !== "POST" || req.url !== "/sessions/sign-out-others") { res.writeHead(404).end(); return; }
  let raw = ""; for await (const chunk of req) raw += chunk;
  try { const result = await signOutOtherSessions(JSON.parse(raw)); res.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify(result)); }
  catch (error) { res.writeHead(400, { "content-type": "application/json" }).end(JSON.stringify({ error: error instanceof Error ? error.message : "invalid request" })); }
}).listen(Number(process.env.PORT ?? 3000));
