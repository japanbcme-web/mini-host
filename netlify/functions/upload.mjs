import { getStore } from "@netlify/blobs";
const MAX = 2 * 1024 * 1024;
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
export default async (req) => {
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let b;
  try { b = await req.json(); } catch { return json({ error: "طلب غير صالح" }, 400); }
  const html = typeof b.html === "string" ? b.html : "";
  const name = String(b.name || "site.html").slice(0, 100);
  if (!html.trim()) return json({ error: "الملف فارغ" }, 400);
  if (new TextEncoder().encode(html).length > MAX) return json({ error: "الملف أكبر من 2 ميجا" }, 413);
  if (!/<\s*(html|body|head|div|h1|p|script)\b/i.test(html)) return json({ error: "الملف لا يبدو ملف HTML" }, 400);
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  await getStore("sites").set(id, html, { metadata: { name, createdAt: Date.now() } });
  return json({ id });
};
export const config = { path: "/api/upload" };
