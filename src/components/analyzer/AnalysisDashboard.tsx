import { Download, FlaskConical, RotateCcw } from "lucide-react";

import { ActivityGuidance } from "./ActivityGuidance";
import { DoctorRecommendation } from "./DoctorRecommendation";
import { ExtractionResults } from "./ExtractionResults";
import { FollowUpChat } from "./FollowUpChat";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { MedicationInformation } from "./MedicationInformation";
import { NutritionGuidance } from "./NutritionGuidance";
import { RedFlags } from "./RedFlags";
import { ReportSummary } from "./ReportSummary";
import { TestResults } from "./TestResults";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadAnalysis } from "@/lib/report-store";
import type { ReportRecord } from "@/lib/report-types";

export function AnalysisDashboard({ record, onReset }: { record: ReportRecord; onReset?: () => void }) {
  const { extraction, analysis } = record;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-semibold">Analysis dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {record.fileName} · {new Date(record.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {record.demo && (
            <Badge className="bg-info-soft text-info">
              <FlaskConical className="size-3.5" aria-hidden /> Demo mode
            </Badge>
          )}
          <Button type="button" variant="outline" size="sm" onClick={() => downloadAnalysis(record)}>
            <Download className="size-4" aria-hidden />
            Download analysis
          </Button>
          {onReset && (
            <Button type="button" variant="secondary" size="sm" onClick={onReset}>
              <RotateCcw className="size-4" aria-hidden />
              Analyze another
            </Button>
          )}
        </div>
      </div>

      {record.demo && (
        <Alert>
          <AlertTitle>Demo mode — sample data</AlertTitle>
          <AlertDescription>
            These results come from a fictional sample report so you can explore the interface. They are not a real
            medical analysis and must not be used for any health decision.
          </AlertDescription>
        </Alert>
      )}

      {!extraction.readable || !analysis ? (
        <Alert variant="destructive">
          <AlertTitle>This report could not be reliably interpreted</AlertTitle>
          <AlertDescription>
            <span>
              We could not read enough structured information from this document to analyse it safely, so we have not
              guessed any values. Try a clearer scan or a higher-quality photo, or ask your clinic for a digital PDF.
            </span>
            {extraction.extraction_notes?.length > 0 && (
              <ul className="mt-2 list-disc pl-5">
                {extraction.extraction_notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <ReportSummary analysis={analysis} />
          <ExtractionResults extraction={extraction} />
          <TestResults tests={extraction.tests} explanations={analysis.test_explanations} />
          <NutritionGuidance nutrition={analysis.nutrition} />
          <ActivityGuidance activity={analysis.activity} />
          <DoctorRecommendation specialists={analysis.specialists} />
          <MedicationInformation medications={extraction.medications} />
          <RedFlags warningSigns={analysis.warning_signs} />
          <FollowUpChat extraction={extraction} analysis={analysis} />
        </>
      )}

      <MedicalDisclaimer />
    </div>
  );
}
