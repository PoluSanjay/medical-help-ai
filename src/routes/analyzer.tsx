import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AnalysisDashboard } from "@/components/analyzer/AnalysisDashboard";
import { AnalysisSkeleton } from "@/components/analyzer/AnalysisSkeleton";
import { MedicalDisclaimer } from "@/components/analyzer/MedicalDisclaimer";
import { ReportUploader } from "@/components/analyzer/ReportUploader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { analyzeReport } from "@/lib/analyzer.functions";
import { demoAnalysis, demoExtraction } from "@/lib/demo-report";
import { useReportHistory } from "@/lib/report-store";
import type { ReportRecord } from "@/lib/report-types";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "AI Medical Report Analyzer | MedicaI Health" },
      {
        name: "description",
        content:
          "Upload a lab report as PDF or image and get a plain-language explanation of your results, nutrition ideas and guidance on who to consult.",
      },
      { property: "og:title", content: "AI Medical Report Analyzer | MedicaI Health" },
      {
        property: "og:description",
        content:
          "Understand your medical report in plain language with MedicaI Health's AI analyzer. Information only — never a diagnosis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyzerPage,
});

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

function AnalyzerPage() {
  const { save } = useReportHistory();
  const [record, setRecord] = useState<ReportRecord | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Preparing your file…");
  const [error, setError] = useState<string | null>(null);

  const runDemo = () => {
    const demo: ReportRecord = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      fileName: "sample-blood-panel.pdf",
      fileSize: 148_320,
      fileType: "application/pdf",
      demo: true,
      status: "complete",
      extraction: demoExtraction,
      analysis: demoAnalysis,
      shortSummary: demoAnalysis.summary.slice(0, 180),
    };
    setError(null);
    setRecord(demo);
    save(demo);
    toast.info("Demo mode: showing sample data, not a real analysis.");
  };

  const handleAnalyze = async (file: File) => {
    setError(null);
    setRecord(null);
    setIsAnalyzing(true);
    setProgress(8);
    setProgressLabel("Validating and preparing your file…");

    const tick = setInterval(() => setProgress((p) => (p < 88 ? p + 3 : p)), 700);
    const labelTimers = [
      setTimeout(() => setProgressLabel("Reading text from your report…"), 2500),
      setTimeout(() => setProgressLabel("Extracting test values and ranges…"), 7000),
      setTimeout(() => setProgressLabel("Preparing your plain-language analysis…"), 14000),
    ];

    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await analyzeReport({
        data: {
          fileName: file.name,
          mimeType: file.type as "application/pdf" | "image/jpeg" | "image/png",
          dataUrl,
        },
      });

      if (!res.ok) {
        setError(res.message);
        toast.error(res.message);
        return;
      }

      const next: ReportRecord = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        demo: false,
        status: res.extraction.readable && res.analysis ? "complete" : "unreadable",
        extraction: res.extraction,
        analysis: res.analysis,
        shortSummary: res.analysis?.summary.slice(0, 180) ?? "The report could not be reliably interpreted.",
      };
      setProgress(100);
      setRecord(next);
      save(next);
      if (next.status === "complete") toast.success("Analysis ready.");
      else toast.warning("We could not reliably interpret that report.");
    } catch {
      const message = "We couldn't complete the analysis. Please check your connection and try again.";
      setError(message);
      toast.error(message);
    } finally {
      clearInterval(tick);
      labelTimers.forEach(clearTimeout);
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-6">
          <p className="text-sm font-semibold text-primary">MedicaI Health</p>
          <h1 className="mt-1 font-display text-3xl font-semibold sm:text-4xl">AI Medical Report Analyzer</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Upload a lab report or scan and get your values explained in plain language, along with general nutrition,
            activity and consultation guidance.
          </p>
        </header>

        <MedicalDisclaimer className="mb-6" />

        <ReportUploader
          onAnalyze={handleAnalyze}
          onDemo={runDemo}
          isAnalyzing={isAnalyzing}
          progress={progress}
          progressLabel={progressLabel}
          error={error}
        />

        <div className="mt-8">
          {isAnalyzing && <AnalysisSkeleton />}
          {!isAnalyzing && record && <AnalysisDashboard record={record} onReset={() => setRecord(null)} />}
          {!isAnalyzing && !record && (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
              <p className="font-medium">Your analysis will appear here</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload a report above, or try demo mode to explore the dashboard with sample data.
              </p>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
