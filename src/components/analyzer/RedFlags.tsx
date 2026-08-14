import { AlertTriangle, PhoneCall } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AnalysisResult, OverallStatus } from "@/lib/report-types";

const levels: { key: OverallStatus; label: string; className: string }[] = [
  { key: "routine", label: "Routine", className: "bg-success-soft text-success" },
  { key: "needs_review", label: "Needs medical review", className: "bg-warning-soft text-warning" },
  { key: "prompt_attention", label: "Seek prompt medical attention", className: "bg-danger-soft text-danger" },
];

export function RedFlags({ warningSigns }: { warningSigns: AnalysisResult["warning_signs"] }) {
  const level = warningSigns?.level ?? "needs_review";

  return (
    <Card className={cn("rounded-2xl", level === "prompt_attention" && "border-danger")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-danger" aria-hidden />
          Important warning signs
        </CardTitle>
        <CardDescription>
          These are general safety pointers based on your report. They are not an emergency assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 sm:grid-cols-3">
          {levels.map((l) => (
            <div
              key={l.key}
              className={cn(
                "rounded-xl border p-3 text-center text-sm font-semibold",
                l.key === level ? `${l.className} border-transparent` : "border-border bg-surface text-muted-foreground",
              )}
              aria-current={l.key === level ? "true" : undefined}
            >
              {l.label}
              {l.key === level && <span className="mt-1 block text-xs font-normal">Current level for this report</span>}
            </div>
          ))}
        </div>

        <ul className="space-y-2 text-sm">
          {(warningSigns?.items ?? []).map((w, i) => (
            <li key={i} className="rounded-xl border border-border bg-surface p-3 text-muted-foreground">
              {w}
            </li>
          ))}
        </ul>

        <p className="flex items-start gap-3 rounded-xl bg-danger-soft/70 p-4 text-sm font-medium">
          <PhoneCall className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
          If you have chest pain, severe breathlessness, fainting, heavy bleeding, one-sided weakness or confusion,
          contact emergency services or go to the nearest emergency department now. Do not wait for an AI analysis.
        </p>
      </CardContent>
    </Card>
  );
}
