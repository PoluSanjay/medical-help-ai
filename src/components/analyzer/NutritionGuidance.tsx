import { Apple, Droplets, Info, MinusCircle, PlusCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/report-types";

export function NutritionGuidance({ nutrition }: { nutrition: AnalysisResult["nutrition"] }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Apple className="size-5 text-primary" aria-hidden />
          Nutrition guidance
        </CardTitle>
        <CardDescription>
          General food ideas based only on the findings in your report — not a prescribed diet plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-success-soft/50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <PlusCircle className="size-4" aria-hidden />
              Foods you may consider including
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              {(nutrition?.include ?? []).map((f, i) => (
                <li key={i}>
                  <p className="font-medium">{f.item}</p>
                  <p className="text-muted-foreground">{f.reason}</p>
                </li>
              ))}
              {(nutrition?.include ?? []).length === 0 && (
                <li className="text-muted-foreground">No specific suggestions from this report.</li>
              )}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-warning-soft/50 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-warning">
              <MinusCircle className="size-4" aria-hidden />
              Foods to limit
            </p>
            <ul className="mt-3 space-y-3 text-sm">
              {(nutrition?.limit ?? []).map((f, i) => (
                <li key={i}>
                  <p className="font-medium">{f.item}</p>
                  <p className="text-muted-foreground">{f.reason}</p>
                </li>
              ))}
              {(nutrition?.limit ?? []).length === 0 && (
                <li className="text-muted-foreground">No specific suggestions from this report.</li>
              )}
            </ul>
          </div>
        </div>

        {nutrition?.hydration && (
          <div className="flex gap-3 rounded-xl border border-border bg-info-soft/60 p-4 text-sm">
            <Droplets className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
            <div>
              <p className="font-semibold">Hydration</p>
              <p className="mt-1 text-muted-foreground">{nutrition.hydration}</p>
            </div>
          </div>
        )}

        <div className="flex gap-3 rounded-xl bg-muted p-4 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <p className="font-semibold">Important nutrition notes</p>
            <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
              {(nutrition?.notes ?? []).map((n, i) => (
                <li key={i}>{n}</li>
              ))}
              <li>
                No supplements or medicines are recommended here as treatment. If your situation needs individualised
                nutrition advice, speak with a doctor or a registered dietitian.
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
