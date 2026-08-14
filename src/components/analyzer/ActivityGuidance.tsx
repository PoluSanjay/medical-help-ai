import { HeartPulse, Info } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/report-types";

export function ActivityGuidance({ activity }: { activity: AnalysisResult["activity"] }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HeartPulse className="size-5 text-primary" aria-hidden />
          Rest &amp; activity guidance
        </CardTitle>
        <CardDescription>
          General lifestyle pointers. This tool never sets a recovery or rest period — only your treating doctor can.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          {(activity?.guidance ?? []).map((g, i) => (
            <li key={i} className="rounded-xl border border-border bg-surface p-3 text-muted-foreground">
              {g}
            </li>
          ))}
          {(activity?.guidance ?? []).length === 0 && (
            <li className="rounded-xl bg-muted p-3 text-muted-foreground">
              No activity-specific guidance could be drawn from this report.
            </li>
          )}
        </ul>

        <div className="flex gap-3 rounded-xl bg-muted p-4 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            {(activity?.notes ?? []).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
            <li>Follow the activity restrictions given by your treating doctor.</li>
            <li>If you have significant symptoms, consider medical evaluation.</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
