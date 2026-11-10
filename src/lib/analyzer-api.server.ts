// Shared guard for the public analyzer endpoints called by the Vercel deployment.
// Security boundary = shared secret (timing-safe). CORS is only a browser hint.

const DEFAULT_ORIGINS = ["https://medical-help-ai.lovable.app"];

function allowedOrigins(): string[] {
  const extra = (process.env["ALLOWED_ORIGINS"] ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...extra];
}

export function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Client-IP",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    "Cache-Control": "no-store",
  };
  if (origin && allowedOrigins().includes(origin)) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

export function json(request: Request, body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: corsHeaders(request) });
}

export function preflight(request: Request): Response {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

async function sha256(input: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input)));
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

/** Returns an error Response when the request is not allowed, otherwise null. */
export async function guard(request: Request): Promise<Response | null> {
  const expected = process.env["ANALYZER_SHARED_SECRET"];
  if (!expected) return json(request, { ok: false, code: "not_configured", message: "Service not configured." }, 503);

  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins().includes(origin)) {
    return json(request, { ok: false, code: "forbidden", message: "Origin not allowed." }, 403);
  }

  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !(await safeEqual(token, expected))) {
    return json(request, { ok: false, code: "unauthorized", message: "Unauthorized." }, 401);
  }

  const ip =
    request.headers.get("x-client-ip") ?? request.headers.get("cf-connecting-ip") ?? "unknown";
  if (!rateLimit(ip)) {
    return json(request, { ok: false, code: "rate_limited", message: "Too many requests. Please wait a few minutes." }, 429);
  }
  return null;
}

// Best-effort, per-instance limiter (no persistent store available without a database).
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 20;
const hits = new Map<string, number[]>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return true;
}

export async function readJson(request: Request, maxBytes: number): Promise<unknown> {
  const len = Number(request.headers.get("content-length") ?? "0");
  if (len > maxBytes) throw new Error("too_large");
  const text = await request.text();
  if (text.length > maxBytes) throw new Error("too_large");
  return JSON.parse(text);
}
