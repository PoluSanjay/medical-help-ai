import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";

export function MedicalDisclaimer({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <aside
      role="note"
      aria-label="Medical disclaimer"
      className={cn(
        "rounded-2xl border border-border bg-warning-soft/60 p-4 text-warning-foreground",
        compact ? "text-xs" : "text-sm",
        className,
      )}
    >
      <div className="flex gap-3 text-foreground">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden />
        <div>
          <p className="font-semibold">This is health information, not medical advice.</p>
          <p className="mt-1 text-muted-foreground">
            MedicaI Health does not diagnose conditions and never recommends starting, stopping or changing any
            medication. AI analysis can be incomplete or wrong. Always confirm results with a qualified healthcare
            professional, and seek emergency care for urgent symptoms.
          </p>
        </div>
      </div>
    </aside>
  );
}
