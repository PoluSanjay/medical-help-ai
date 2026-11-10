import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

import { runAnalyze, runFollowUp, type AnalyzeResponse, type FollowUpResponse } from "./analyzer-core.server";
import { analyzeInput, followUpInput } from "./analyzer-schemas";

// On Vercel, ANALYZER_API_URL + ANALYZER_SHARED_SECRET are set and requests are
// proxied to the Lovable-hosted endpoints (LOVABLE_API_KEY never leaves Lovable).
// On Lovable (preview/published) they are unset and the AI runs locally.
async function proxy<T>(path: string, body: unknown, fallback: T): Promise<T | null> {
  const base = process.env["ANALYZER_API_URL"];
  const secret = process.env["ANALYZER_SHARED_SECRET"];
  if (!base || !secret) return null;
  const clientIp =
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ?? getRequestHeader("x-real-ip") ?? "unknown";
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${secret}`, "X-Client-IP": clientIp },
      body: JSON.stringify(body),
    });
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const analyzeReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => analyzeInput.parse(data))
  .handler(async ({ data }): Promise<AnalyzeResponse> => {
    const remote = await proxy<AnalyzeResponse>("/api/public/analyze", data, {
      ok: false,
      code: "network",
      message: "Could not reach the analysis service. Please try again.",
    });
    return remote ?? runAnalyze(data);
  });

export const askAboutReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => followUpInput.parse(data))
  .handler(async ({ data }): Promise<FollowUpResponse> => {
    const remote = await proxy<FollowUpResponse>("/api/public/follow-up", data, {
      ok: false,
      message: "The assistant could not answer just now. Please try again.",
    });
    return remote ?? runFollowUp(data);
  });
