import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  AnalyzerError,
  analyzeExtraction,
  answerFollowUp,
  extractFromFile,
  safetyCheck,
} from "./analyzer.server";
import type { AnalysisResult, ExtractionResult } from "./report-types";

const analyzeInput = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(["application/pdf", "image/jpeg", "image/jpg", "image/png"]),
  dataUrl: z.string().min(32).max(20_000_000),
});

export const analyzeReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => analyzeInput.parse(data))
  .handler(
    async ({
      data,
    }): Promise<
      | { ok: true; extraction: ExtractionResult; analysis: AnalysisResult | null }
      | { ok: false; code: string; message: string }
    > => {
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
    },
  );

const followUpInput = z.object({
  question: z.string().trim().min(1).max(500),
  extraction: z.any(),
  analysis: z.any().nullable(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(20)
    .default([]),
});

export const askAboutReport = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => followUpInput.parse(data))
  .handler(async ({ data }): Promise<{ ok: true; answer: string } | { ok: false; message: string }> => {
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
  });
