import { createFileRoute } from "@tanstack/react-router";

import { guard, json, preflight, readJson } from "@/lib/analyzer-api.server";
import { runAnalyze } from "@/lib/analyzer-core.server";
import { analyzeInput } from "@/lib/analyzer-schemas";

export const Route = createFileRoute("/api/public/analyze")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      POST: async ({ request }) => {
        const denied = await guard(request);
        if (denied) return denied;
        let body: unknown;
        try {
          body = await readJson(request, 21_000_000);
        } catch {
          return json(request, { ok: false, code: "bad_request", message: "Invalid or too large request." }, 400);
        }
        const parsed = analyzeInput.safeParse(body);
        if (!parsed.success) {
          return json(request, { ok: false, code: "invalid_input", message: "Invalid file data." }, 400);
        }
        return json(request, await runAnalyze(parsed.data));
      },
    },
  },
});
