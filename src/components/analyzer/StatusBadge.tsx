import { ArrowDown, ArrowUp, CircleHelp, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { OverallStatus, TestStatus, Urgency } from "@/lib/report-types";

const testStyles: Record<TestStatus, { label: string; className: string; Icon: typeof Check }> = {
  normal: { label: "Normal", className: "bg-success-soft text-success", Icon: Check },
  high: { label: "High", className: "bg-danger-soft text-danger", Icon: ArrowUp },
  low: { label: "Low", className: "bg-warning-soft text-warning", Icon: ArrowDown },
  not_available: { label: "Not available", className: "bg-muted text-muted-foreground", Icon: CircleHelp },
};

export function TestStatusBadge({ status }: { status: TestStatus }) {
  const s = testStyles[status] ?? testStyles.not_available;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        s.className,
      )}
    >
      <s.Icon className="size-3.5" aria-hidden />
      {s.label}
    </span>
  );
}

const overallStyles: Record<OverallStatus, { label: string; className: string }> = {
  routine: { label: "Routine", className: "bg-success-soft text-success" },
  needs_review: { label: "Needs medical review", className: "bg-warning-soft text-warning" },
  prompt_attention: { label: "Seek prompt medical attention", className: "bg-danger-soft text-danger" },
};

export function OverallStatusBadge({ status }: { status: OverallStatus }) {
  const s = overallStyles[status] ?? overallStyles.needs_review;
  return (
    <span className={cn("inline-flex rounded-full px-3 py-1.5 text-sm font-semibold", s.className)}>{s.label}</span>
  );
}

const urgencyStyles: Record<Urgency, string> = {
  routine: "bg-success-soft text-success",
  soon: "bg-warning-soft text-warning",
  urgent: "bg-danger-soft text-danger",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        urgencyStyles[urgency] ?? urgencyStyles.routine,
      )}
    >
      {urgency}
    </span>
  );
}
