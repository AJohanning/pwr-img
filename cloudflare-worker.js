const ALLOWED = ["www.power.dk", "www.power.no", "www.power.se", "www.power.fi"];
const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" };

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });
    const req = new URL(request.url);

    let target = null;
    const m = req.pathname.match(/^\/power-(dk|no|se|fi)(\/.*)$/);
    if (m) {
      target = new URL(`https://www.power.${m[1]}${m[2]}${req.search}`);
    } else if (req.searchParams.has("url")) {
      try { target = new URL(req.searchParams.get("url")); }
      catch { return new Response("Ugyldig url", { status: 400, headers: CORS }); }
    }
    if (!target) return env.ASSETS.fetch(request);

    if (!ALLOWED.includes(target.hostname) || !target.pathname.startsWith("/x/p-")) {
      return new Response("Ikke tilladt", { status: 403, headers: CORS });
    }

    const res = await fetch(target, { headers: { "Accept": "application/json", "User-Agent": "Mozilla/5.0 (pwr-img)" } });
    const out = new Response(res.body, res);
    Object.entries(CORS).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  }
};