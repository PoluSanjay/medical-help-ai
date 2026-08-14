import { ArrowDown, ArrowUp, CheckCircle2, Stethoscope } from "lucide-react";

import { OverallStatusBadge } from "./StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisResult } from "@/lib/report-types";

function FindingList({
  title,
  items,
  tone,
  Icon,
}: {
  title: string;
  items: string[];
  tone: string;
  Icon: typeof ArrowUp;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className={`flex items-center gap-2 text-sm font-semibold ${tone}`}>
        <Icon className="size-4" aria-hidden />
        {title}
        <span className="text-muted-foreground">({items.length})</span>
      </p>
      {items.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">None identified.</p>
      ) : (
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          {items.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ReportSummary({ analysis }: { analysis: AnalysisResult }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="size-5 text-primary" aria-hidden />
            Report summary
          </CardTitle>
          <OverallStatusBadge status={analysis.overall_status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed sm:text-base">{analysis.summary}</p>
        {analysis.overall_status_reason && (
          <p className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Overall status: </span>
            {analysis.overall_status_reason}
          </p>
        )}

        <div>
          <p className="text-sm font-semibold">Key findings</p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <FindingList title="Normal" items={analysis.key_findings?.normal ?? []} tone="text-success" Icon={CheckCircle2} />
            <FindingList title="High" items={analysis.key_findings?.high ?? []} tone="text-danger" Icon={ArrowUp} />
            <FindingList title="Low" items={analysis.key_findings?.low ?? []} tone="text-warning" Icon={ArrowDown} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
