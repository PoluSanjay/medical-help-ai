import { createFileRoute } from "@tanstack/react-router";

import { guard, json, preflight, readJson } from "@/lib/analyzer-api.server";
import { runFollowUp } from "@/lib/analyzer-core.server";
import { followUpInput } from "@/lib/analyzer-schemas";

export const Route = createFileRoute("/api/public/follow-up")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => preflight(request),
      POST: async ({ request }) => {
        const denied = await guard(request);
        if (denied) return denied;
        let body: unknown;
        try {
          body = await readJson(request, 500_000);
        } catch {
          return json(request, { ok: false, message: "Invalid or too large request." }, 400);
        }
        const parsed = followUpInput.safeParse(body);
        if (!parsed.success) return json(request, { ok: false, message: "Invalid question." }, 400);
        return json(request, await runFollowUp(parsed.data));
      },
    },
  },
});
