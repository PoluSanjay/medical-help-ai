import { UserRound } from "lucide-react";

import { UrgencyBadge } from "./StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/report-types";

export function DoctorRecommendation({ specialists }: { specialists: AnalysisResult["specialists"] }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="size-5 text-primary" aria-hidden />
          Who should I consult?
        </CardTitle>
        <CardDescription>
          General guidance only. A general physician can always be a sensible starting point and can refer you onwards
          if needed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(specialists ?? []).length === 0 ? (
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            No specific specialist suggestion could be drawn from this report. A general physician can review it with
            you.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {specialists.map((s, i) => (
              <li key={i} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{s.specialist}</p>
                  <UrgencyBadge urgency={s.urgency} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Reason: </span>
                  {s.reason}
                </p>
                <p className="mt-1 text-xs text-muted-foreground capitalize">Suggested urgency: {s.urgency}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
