export interface Env {
  ASSETS: Fetcher;
}

function parseRange(value: string | null, size: number): { start: number; end: number } | null {
  const match = /^bytes=(\d+)-(\d*)$/.exec(value ?? "");
  if (!match) return null;
  const start = Number(match[1]);
  const requestedEnd = match[2] === "" ? size - 1 : Number(match[2]);
  if (!Number.isSafeInteger(start) || start >= size) return null;
  const end = Math.min(requestedEnd, size - 1);
  if (!Number.isSafeInteger(end) || end < start) return null;
  return { start, end };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Streaming otimizado com suporte a HTTP Range (status 206) para arquivos .mp4
    if (!url.pathname.endsWith(".mp4") || !request.headers.has("Range")) {
      return env.ASSETS.fetch(request);
    }

    const upstreamHeaders = new Headers(request.headers);
    upstreamHeaders.delete("Range");

    const upstream = await env.ASSETS.fetch(new Request(request, { headers: upstreamHeaders }));
    if (!upstream.ok) return upstream;

    const bytes = new Uint8Array(await upstream.arrayBuffer());
    const range = parseRange(request.headers.get("Range"), bytes.byteLength);

    if (!range) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${bytes.byteLength}` }
      });
    }

    const body = bytes.slice(range.start, range.end + 1);
    const headers = new Headers(upstream.headers);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Range", `bytes ${range.start}-${range.end}/${bytes.byteLength}`);
    headers.set("Content-Length", String(body.byteLength));

    return new Response(request.method === "HEAD" ? null : body, {
      status: 206,
      headers
    });
  }
};
