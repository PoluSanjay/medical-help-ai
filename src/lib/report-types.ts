export type TestStatus = "normal" | "high" | "low" | "not_available";
export type Urgency = "routine" | "soon" | "urgent";
export type OverallStatus = "routine" | "needs_review" | "prompt_attention";

export interface ExtractedTest {
  name: string;
  value: string;
  unit: string;
  reference_range: string;
  status: TestStatus;
  flag_in_report: string;
}

export interface ExtractedMedication {
  name: string;
  dosage: string;
  frequency: string;
  instructions: string;
}

export interface ExtractionResult {
  readable: boolean;
  confidence: "high" | "medium" | "low";
  document_type: string;
  extraction_notes: string[];
  tests: ExtractedTest[];
  medications: ExtractedMedication[];
  doctor_notes: string[];
  abnormal_findings: string[];
}

export interface TestExplanation {
  test_name: string;
  what_it_measures: string;
  what_result_generally_means: string;
  factors_that_can_affect_it: string[];
  when_to_discuss_with_doctor: string;
}

export interface SpecialistSuggestion {
  specialist: string;
  reason: string;
  urgency: Urgency;
}

export interface AnalysisResult {
  summary: string;
  overall_status: OverallStatus;
  overall_status_reason: string;
  key_findings: { normal: string[]; high: string[]; low: string[] };
  test_explanations: TestExplanation[];
  nutrition: {
    include: { item: string; reason: string }[];
    limit: { item: string; reason: string }[];
    hydration: string;
    notes: string[];
  };
  activity: { guidance: string[]; notes: string[] };
  specialists: SpecialistSuggestion[];
  warning_signs: { level: OverallStatus; items: string[] };
}

export interface ReportRecord {
  id: string;
  createdAt: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  demo: boolean;
  status: "complete" | "unreadable";
  extraction: ExtractionResult;
  analysis: AnalysisResult | null;
  shortSummary: string;
}

export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
