import { Pill } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractedMedication } from "@/lib/report-types";

export function MedicationInformation({ medications }: { medications: ExtractedMedication[] }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="size-5 text-primary" aria-hidden />
          Medication information
        </CardTitle>
        <CardDescription>Only medicines explicitly written in your uploaded report are shown here.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {(medications ?? []).length === 0 ? (
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            No medications were identified in this report.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {medications.map((m, i) => (
              <li key={i} className="rounded-xl border border-border bg-surface p-4 text-sm">
                <p className="font-semibold">{m.name}</p>
                <dl className="mt-2 space-y-1 text-muted-foreground">
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground">Dosage:</dt>
                    <dd>{m.dosage || "not stated in report"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground">Frequency:</dt>
                    <dd>{m.frequency || "not stated in report"}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-foreground">Instructions:</dt>
                    <dd>{m.instructions || "not stated in report"}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        )}

        <p className="rounded-xl bg-warning-soft/60 p-4 text-sm font-medium">
          Do not start, stop, or change prescription medication based solely on this AI analysis. Confirm medication
          decisions with your doctor or pharmacist.
        </p>
      </CardContent>
    </Card>
  );
}
