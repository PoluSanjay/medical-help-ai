import { FileSearch, Info } from "lucide-react";

import { TestStatusBadge } from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExtractionResult } from "@/lib/report-types";

export function ExtractionResults({ extraction }: { extraction: ExtractionResult }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="size-5 text-primary" aria-hidden />
              Extracted results
            </CardTitle>
            <CardDescription>
              Values read directly from your document, exactly as printed. Nothing here is generated.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="capitalize">
            Extraction confidence: {extraction.confidence}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {extraction.document_type && (
          <p className="text-sm text-muted-foreground">
            Document type: <span className="font-medium text-foreground">{extraction.document_type}</span>
          </p>
        )}

        {extraction.tests.length === 0 ? (
          <p className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            No individual test values could be read from this document.
          </p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {extraction.tests.map((t, i) => (
              <li key={`${t.name}-${i}`} className="rounded-xl border border-border bg-surface p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{t.name || "Unnamed entry"}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {t.value ? `${t.value} ${t.unit}`.trim() : "Value not available"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Reference range: {t.reference_range || "not stated in report"}
                    </p>
                  </div>
                  <TestStatusBadge status={t.status} />
                </div>
              </li>
            ))}
          </ul>
        )}

        {extraction.doctor_notes.length > 0 && (
          <div>
            <p className="text-sm font-semibold">Doctor&apos;s comments in the report</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {extraction.doctor_notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}

        {extraction.extraction_notes.length > 0 && (
          <div className="flex gap-2 rounded-xl bg-info-soft/70 p-3 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
            <ul className="space-y-1 text-muted-foreground">
              {extraction.extraction_notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
