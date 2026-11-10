import { AnalyzerError, analyzeExtraction, answerFollowUp, extractFromFile, safetyCheck } from "./analyzer.server";
import type { AnalyzeInput, FollowUpInput } from "./analyzer-schemas";
import type { AnalysisResult, ExtractionResult } from "./report-types";

export type AnalyzeResponse =
  | { ok: true; extraction: ExtractionResult; analysis: AnalysisResult | null }
  | { ok: false; code: string; message: string };

export type FollowUpResponse = { ok: true; answer: string } | { ok: false; message: string };

export async function runAnalyze(data: AnalyzeInput): Promise<AnalyzeResponse> {
  try {
    const extraction = await extractFromFile(data);
    if (!extraction.readable || (extraction.tests.length === 0 && extraction.doctor_notes.length === 0)) {
      return { ok: true, extraction: { ...extraction, readable: false }, analysis: null };
    }
    const analysis = safetyCheck(await analyzeExtraction(extraction));
    return { ok: true, extraction, analysis };
  } catch (error) {
    if (error instanceof AnalyzerError) return { ok: false, code: error.code, message: error.message };
    return { ok: false, code: "unknown", message: "Something went wrong while analysing the report." };
  }
}

export async function runFollowUp(data: FollowUpInput): Promise<FollowUpResponse> {
  try {
    const answer = await answerFollowUp({
      extraction: data.extraction as ExtractionResult,
      analysis: (data.analysis ?? null) as AnalysisResult | null,
      history: data.history,
      question: data.question,
    });
    return { ok: true, answer };
  } catch (error) {
    if (error instanceof AnalyzerError) return { ok: false, message: error.message };
    return { ok: false, message: "The assistant could not answer just now. Please try again." };
  }
}
