import { z } from "zod";

export const analyzeInput = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(["application/pdf", "image/jpeg", "image/jpg", "image/png"]),
  dataUrl: z.string().min(32).max(20_000_000),
});

export const followUpInput = z.object({
  question: z.string().trim().min(1).max(500),
  extraction: z.any(),
  analysis: z.any().nullable(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(20)
    .default([]),
});

export type AnalyzeInput = z.infer<typeof analyzeInput>;
export type FollowUpInput = z.infer<typeof followUpInput>;
