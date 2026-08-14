import { ChevronRight, TableProperties } from "lucide-react";
import { useState } from "react";

import { TestStatusBadge } from "./StatusBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AnalysisResult, ExtractedTest } from "@/lib/report-types";

export function TestResults({
  tests,
  explanations,
}: {
  tests: ExtractedTest[];
  explanations: AnalysisResult["test_explanations"];
}) {
  const [selected, setSelected] = useState<ExtractedTest | null>(null);
  const explanation = selected
    ? explanations?.find((e) => e.test_name?.toLowerCase() === selected.name?.toLowerCase())
    : undefined;

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableProperties className="size-5 text-primary" aria-hidden />
          Detailed test results
        </CardTitle>
        <CardDescription>
          Select any test to learn what it generally measures. Reference ranges can vary between laboratories, so always
          compare against the range printed on your own report.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tests.length === 0 ? (
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            No test values were available in this report.
          </p>
        ) : (
          <>
            {/* Mobile cards */}
            <ul className="space-y-2 md:hidden">
              {tests.map((t, i) => (
                <li key={`${t.name}-${i}`}>
                  <button
                    type="button"
                    onClick={() => setSelected(t)}
                    className="w-full rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <TestStatusBadge status={t.status} />
                    </div>
                    <p className="mt-2 text-sm">{t.value ? `${t.value} ${t.unit}`.trim() : "Not available"}</p>
                    <p className="text-xs text-muted-foreground">Range: {t.reference_range || "not stated"}</p>
                  </button>
                </li>
              ))}
            </ul>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-xl border border-border md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Detailed test results from your report</caption>
                <thead className="bg-surface text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">Test</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Result</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Reference range</th>
                    <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                    <th scope="col" className="px-4 py-3"><span className="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t, i) => (
                    <tr
                      key={`${t.name}-${i}`}
                      tabIndex={0}
                      role="button"
                      onClick={() => setSelected(t)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(t);
                        }
                      }}
                      className="cursor-pointer border-t border-border transition-colors hover:bg-accent/40 focus:bg-accent/40 focus:outline-none"
                    >
                      <th scope="row" className="px-4 py-3 text-left font-medium">{t.name}</th>
                      <td className="px-4 py-3">{t.value ? `${t.value} ${t.unit}`.trim() : "Not available"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.reference_range || "not stated"}</td>
                      <td className="px-4 py-3"><TestStatusBadge status={t.status} /></td>
                      <td className="px-4 py-3 text-muted-foreground"><ChevronRight className="size-4" aria-hidden /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selected?.name}</DialogTitle>
              <DialogDescription>
                {selected?.value ? `${selected.value} ${selected.unit}`.trim() : "Value not available"} · range{" "}
                {selected?.reference_range || "not stated in report"}
              </DialogDescription>
            </DialogHeader>
            {explanation ? (
              <div className="space-y-4 text-sm">
                <section>
                  <h3 className="font-semibold">What this test generally measures</h3>
                  <p className="mt-1 text-muted-foreground">{explanation.what_it_measures}</p>
                </section>
                <section>
                  <h3 className="font-semibold">What this result can generally mean</h3>
                  <p className="mt-1 text-muted-foreground">{explanation.what_result_generally_means}</p>
                </section>
                {explanation.factors_that_can_affect_it?.length > 0 && (
                  <section>
                    <h3 className="font-semibold">Factors that can affect it</h3>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                      {explanation.factors_that_can_affect_it.map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </section>
                )}
                <section>
                  <h3 className="font-semibold">When to discuss it with a doctor</h3>
                  <p className="mt-1 text-muted-foreground">{explanation.when_to_discuss_with_doctor}</p>
                </section>
                <p className="rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                  A value outside the reference range does not by itself mean you have a disease. Only a qualified
                  healthcare professional can interpret it in the context of your health.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No general explanation is available for this entry. Your doctor can explain what it means for you.
              </p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
