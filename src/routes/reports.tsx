import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AnalysisDashboard } from "@/components/analyzer/AnalysisDashboard";
import { MedicalDisclaimer } from "@/components/analyzer/MedicalDisclaimer";
import { OverallStatusBadge } from "@/components/analyzer/StatusBadge";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadAnalysis, useReportHistory } from "@/lib/report-store";
import { formatBytes } from "@/lib/report-types";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "My Reports | MediaI Health" },
      {
        name: "description",
        content:
          "Review, download or delete the medical reports you have analysed with MediaI Health. Your history stays private on your device.",
      },
      { property: "og:title", content: "My Reports | MediaI Health" },
      {
        property: "og:description",
        content: "Your previously analysed medical reports, stored privately in your own browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const { reports, loaded, remove, clear } = useReportHistory();
  const [openId, setOpenId] = useState<string | null>(null);
  const open = reports.find((r) => r.id === openId) ?? null;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold sm:text-4xl">My reports</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Your analyses are stored only in this browser — never on a public link or shared server. Clearing them
              removes them permanently.
            </p>
          </div>
          {reports.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clear();
                setOpenId(null);
                toast.success("All saved analyses deleted from this device.");
              }}
            >
              <Trash2 className="size-4" aria-hidden />
              Delete all
            </Button>
          )}
        </header>

        {!loaded ? (
          <div className="space-y-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
          </div>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
            <FileText className="mx-auto size-8 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-medium">No reports analysed yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first medical report to see it here.
            </p>
            <Button asChild className="mt-5">
              <Link to="/analyzer">Analyze a report</Link>
            </Button>
          </div>
        ) : open ? (
          <div className="space-y-4">
            <Button variant="secondary" size="sm" onClick={() => setOpenId(null)}>
              Back to all reports
            </Button>
            <AnalysisDashboard record={open} />
          </div>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id}>
                <Card className="rounded-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="truncate text-base">{r.fileName}</CardTitle>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleString()} · {formatBytes(r.fileSize)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {r.demo && <Badge className="bg-info-soft text-info">Demo</Badge>}
                        {r.status === "complete" && r.analysis ? (
                          <OverallStatusBadge status={r.analysis.overall_status} />
                        ) : (
                          <Badge variant="secondary">Could not be interpreted</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{r.shortSummary}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => setOpenId(r.id)}>
                        View report
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => downloadAnalysis(r)}>
                        <Download className="size-4" aria-hidden />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          remove(r.id);
                          toast.success("Report deleted from this device.");
                        }}
                      >
                        <Trash2 className="size-4" aria-hidden />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <MedicalDisclaimer className="mt-8" />
      </main>
      <SiteFooter />
    </div>
  );
}
