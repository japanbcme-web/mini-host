import { getStore } from "@netlify/blobs";
export default async (req, context) => {
  const id = String(context.params.id || "");
  if (!/^[a-f0-9]{10}$/.test(id)) return new Response("Not found", { status: 404 });
  const html = await getStore("sites").get(id);
  if (html === null) return new Response("Not found", { status: 404 });
  return new Response(html, { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Security-Policy": "sandbox allow-scripts allow-forms allow-popups allow-modals",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "public, max-age=300"
  }});
};
export const config = { path: "/s/:id" };
