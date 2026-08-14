import { useCallback, useEffect, useState } from "react";

import type { ReportRecord } from "./report-types";

const KEY = "mediai.reports.v1";

/**
 * Report history is kept in this browser only (localStorage). Nothing is
 * uploaded to a shared server for storage and no public file URL is created,
 * which keeps sensitive medical data on the user's own device.
 */
function read(): ReportRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ReportRecord[]) : [];
  } catch {
    return [];
  }
}

function write(records: ReportRecord[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    /* storage full or unavailable */
  }
}

export function useReportHistory() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setReports(read());
    setLoaded(true);
  }, []);

  const save = useCallback((record: ReportRecord) => {
    setReports((prev) => {
      const next = [record, ...prev.filter((r) => r.id !== record.id)].slice(0, 50);
      write(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      write(next);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setReports([]);
    write([]);
  }, []);

  return { reports, loaded, save, remove, clear };
}

export function downloadAnalysis(record: ReportRecord) {
  const lines: string[] = [];
  lines.push(`MediaI Health — AI Medical Report Analysis`);
  lines.push(`Report: ${record.fileName}`);
  lines.push(`Analysed: ${new Date(record.createdAt).toLocaleString()}`);
  if (record.demo) lines.push(`MODE: DEMO — sample data, not a real medical analysis.`);
  lines.push("");
  if (record.analysis) {
    lines.push("SUMMARY");
    lines.push(record.analysis.summary);
    lines.push("");
  }
  lines.push("EXTRACTED RESULTS");
  record.extraction.tests.forEach((t) => {
    lines.push(
      `- ${t.name}: ${t.value || "not available"} ${t.unit} | ref ${t.reference_range || "not stated"} | ${t.status}`,
    );
  });
  if (record.extraction.medications.length) {
    lines.push("");
    lines.push("MEDICATIONS STATED IN REPORT");
    record.extraction.medications.forEach((m) =>
      lines.push(`- ${m.name} ${m.dosage} ${m.frequency} ${m.instructions}`.trim()),
    );
  }
  if (record.analysis) {
    lines.push("");
    lines.push("WHO TO CONSULT");
    record.analysis.specialists.forEach((s) => lines.push(`- ${s.specialist} (${s.urgency}): ${s.reason}`));
  }
  lines.push("");
  lines.push(
    "DISCLAIMER: This AI analysis is for general health information only. It is not a diagnosis and does not replace advice from a qualified healthcare professional.",
  );

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `mediai-analysis-${record.fileName.replace(/\.[^.]+$/, "")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
