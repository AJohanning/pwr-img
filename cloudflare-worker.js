// Kun nødvendig hvis siden hostes på GitHub Pages.
// Opret en gratis Worker på dash.cloudflare.com, indsæt denne kode, og sæt PROXY_URL i index.html.
const ALLOWED = ["www.power.dk", "www.power.no", "www.power.se", "www.power.fi"];

export default {
  async fetch(request) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    const target = new URL(request.url).searchParams.get("url");
    let url;
    try { url = new URL(target); } catch { return new Response("Mangler ?url=", { status: 400, headers: cors }); }
    if (!ALLOWED.includes(url.hostname) || !url.pathname.startsWith("/x/p-")) {
      return new Response("Ikke tilladt", { status: 403, headers: cors });
    }

    const res = await fetch(url, { headers: { "Accept": "application/json" } });
    const out = new Response(res.body, res);
    Object.entries(cors).forEach(([k, v]) => out.headers.set(k, v));
    return out;
  }
};
