// ლოკალური ტესტ-სერვერი (Netlify-ის გარეშე): node tools/local-server.mjs → http://localhost:8888
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { useMemoryStore } from "../netlify/functions/lib/store.mjs";
import { handle as order } from "../netlify/functions/lib/h-order.mjs";
import { handle as status } from "../netlify/functions/lib/h-order-status.mjs";
import { handle as callback } from "../netlify/functions/lib/h-payment-callback.mjs";
useMemoryStore();
const PUB = path.resolve("public");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2" };
const routes = { "/api/order": order, "/api/order-status": status, "/api/payment-callback": callback };
http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:8888");
  if (routes[url.pathname]) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = await routes[url.pathname](new Request(url, { method: req.method, headers: req.headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) }), { ...process.env, SITE_URL: "http://localhost:8888" });
    res.writeHead(r.status, Object.fromEntries(r.headers)); return res.end(await r.text());
  }
  const f = path.join(PUB, path.normalize(url.pathname === "/" ? "/index.html" : url.pathname));
  if (!f.startsWith(PUB)) { res.writeHead(403); return res.end(); }
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": TYPES[path.extname(f)] || "application/octet-stream" }); res.end(b); }
  catch { res.writeHead(404); res.end("not found"); }
}).listen(8888, () => console.log("http://localhost:8888"));
