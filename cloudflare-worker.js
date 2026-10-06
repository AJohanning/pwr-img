// Videresender kald til POWER's offentlige produktdata og serverer siden (index.html).
// Tilladt: /power-dk/api/v2/products?ids=...  og  /power-dk/x/p-{id}/?spa=true
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" };

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const req = new URL(request.url);

    const m = req.pathname.match(/^\/power-(dk|no|se|fi)(\/.*)$/);
    if (!m) return env.ASSETS.fetch(request);

    const path = m[2];
    if (!(path === "/api/v2/products" || path.startsWith("/x/p-"))) {
      return new Response("Ikke tilladt", { status: 403, headers: CORS });
    }

    const target = `https://www.power.${m[1]}${path}${req.search}`;
    const res = await fetch(target, { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0 (pwr-img)" } });
    const out = new Response(res.body, res);
    Object.entries(CORS).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  }
};
