import { FileImage, FileText, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/report-types";

export function ReportPreview({
  file,
  previewUrl,
  onRemove,
  disabled,
}: {
  file: File;
  previewUrl: string | null;
  onRemove: () => void;
  disabled?: boolean;
}) {
  const isImage = file.type.startsWith("image/");

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
        {isImage && previewUrl ? (
          <img src={previewUrl} alt={`Preview of ${file.name}`} className="size-full object-cover" />
        ) : isImage ? (
          <FileImage className="size-7 text-primary" aria-hidden />
        ) : (
          <FileText className="size-7 text-primary" aria-hidden />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{file.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatBytes(file.size)} · {file.type === "application/pdf" ? "PDF document" : "Image"}
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove ${file.name}`}
      >
        <X className="size-4" aria-hidden />
      </Button>
    </div>
  );
}
