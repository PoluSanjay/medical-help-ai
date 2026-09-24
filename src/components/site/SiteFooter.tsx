import { Activity } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity className="size-4" aria-hidden />
            </span>
            <span className="font-display font-semibold">MedicaI Health</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            AI-assisted health information to help you understand your medical reports in plain language.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Medical disclaimer</p>
          <p className="mt-2">
            MediaI Health provides general health information only. It does not diagnose conditions, prescribe
            medication, or replace advice from a qualified healthcare professional. In an emergency, contact your local
            emergency services immediately.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} MediaI Health. All rights reserved.
      </div>
    </footer>
  );
}
