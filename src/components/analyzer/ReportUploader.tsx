import { FlaskConical, Loader2, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ReportPreview } from "./ReportPreview";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ACCEPTED_TYPES, MAX_FILE_BYTES, formatBytes } from "@/lib/report-types";
import { cn } from "@/lib/utils";

export function ReportUploader({
  onAnalyze,
  onDemo,
  isAnalyzing,
  progress,
  progressLabel,
  error,
}: {
  onAnalyze: (file: File) => void;
  onDemo: () => void;
  isAnalyzing: boolean;
  progress: number;
  progressLabel: string;
  error: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const accept = useCallback((candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.includes(candidate.type)) {
      setLocalError("Unsupported file type. Please upload a PDF, JPG, JPEG or PNG file.");
      setFile(null);
      return;
    }
    if (candidate.size === 0) {
      setLocalError("That file appears to be empty. Please choose another file.");
      setFile(null);
      return;
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setLocalError(`That file is ${formatBytes(candidate.size)}. Please upload a file under ${formatBytes(MAX_FILE_BYTES)}.`);
      setFile(null);
      return;
    }
    setLocalError(null);
    setFile(candidate);
  }, []);

  const shownError = localError ?? error;

  return (
    <section className="card-elevated p-5 sm:p-7" aria-labelledby="upload-heading">
      <h2 id="upload-heading" className="font-display text-xl font-semibold">
        Upload your medical report
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        PDF, JPG, JPEG or PNG · up to {formatBytes(MAX_FILE_BYTES)}
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!isAnalyzing) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (isAnalyzing) return;
          accept(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "mt-5 rounded-2xl border-2 border-dashed p-8 text-center transition-colors",
          dragging ? "border-primary bg-accent/60" : "border-border bg-surface",
          isAnalyzing && "opacity-60",
        )}
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
          <UploadCloud className="size-7" aria-hidden />
        </span>
        <p className="mt-4 font-medium">Drag and drop your report here</p>
        <p className="mt-1 text-sm text-muted-foreground">or choose a file from your device</p>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="sr-only"
          onChange={(e) => accept(e.target.files?.[0] ?? undefined)}
          aria-label="Choose a medical report file"
        />
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          disabled={isAnalyzing}
          onClick={() => inputRef.current?.click()}
        >
          Upload file
        </Button>
      </div>

      {file && (
        <div className="mt-4">
          <ReportPreview
            file={file}
            previewUrl={previewUrl}
            disabled={isAnalyzing}
            onRemove={() => {
              setFile(null);
              setLocalError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        </div>
      )}

      {shownError && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>We couldn&apos;t process that</AlertTitle>
          <AlertDescription>{shownError}</AlertDescription>
        </Alert>
      )}

      {isAnalyzing && (
        <div className="mt-5" aria-live="polite">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 font-medium">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              {progressLabel}
            </span>
            <span className="text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          size="lg"
          className="sm:flex-1"
          disabled={!file || isAnalyzing}
          onClick={() => file && onAnalyze(file)}
        >
          <Sparkles className="size-4" aria-hidden />
          Analyze report
        </Button>
        <Button type="button" size="lg" variant="secondary" disabled={isAnalyzing} onClick={onDemo}>
          <FlaskConical className="size-4" aria-hidden />
          Try demo mode
        </Button>
      </div>

      <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
        Your file is sent over an encrypted connection for analysis only. It is never stored on our servers and no
        public link is created. Your saved analyses stay in this browser and can be deleted at any time.
      </p>
    </section>
  );
}
