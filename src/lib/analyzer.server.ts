import type { AnalysisResult, ExtractionResult } from "./report-types";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3.6-flash";

export class AnalyzerError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

async function callGateway(messages: unknown[], apiKey: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch(GATEWAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.2 }),
    });
  } catch {
    throw new AnalyzerError("network", "Could not reach the analysis service. Please check your connection and try again.");
  }
  if (res.status === 429)
    throw new AnalyzerError("rate_limited", "The analysis service is busy right now. Please try again in a moment.");
  if (res.status === 402)
    throw new AnalyzerError("credits", "AI analysis is temporarily unavailable. Please try demo mode.");
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new AnalyzerError("ai_error", `The analysis service returned an error (${res.status}). ${detail.slice(0, 180)}`);
  }
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content;
  if (!content) throw new AnalyzerError("ai_error", "The analysis service returned an empty response.");
  return content;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new AnalyzerError("parse", "The report could not be reliably interpreted.");
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    throw new AnalyzerError("parse", "The report could not be reliably interpreted. Please try a clearer scan.");
  }
}

const EXTRACTION_PROMPT = `You are a careful medical-document extraction engine. You transcribe, you never interpret and never invent.

Read the attached medical report (it may be a PDF, a scan or a photograph; perform OCR if needed) and return ONLY a JSON object with this exact shape:

{
  "readable": boolean,
  "confidence": "high" | "medium" | "low",
  "document_type": string,
  "extraction_notes": string[],
  "tests": [{"name": string, "value": string, "unit": string, "reference_range": string, "status": "normal"|"high"|"low"|"not_available", "flag_in_report": string}],
  "medications": [{"name": string, "dosage": string, "frequency": string, "instructions": string}],
  "doctor_notes": string[],
  "abnormal_findings": string[]
}

Hard rules:
- Copy values, units and reference ranges EXACTLY as printed. Do not convert, round or normalise.
- If a field is not printed in the document, use an empty string "". Never guess.
- Set "status" only from the printed reference range or the printed H/L flag. If neither is present, use "not_available".
- "medications" may only contain medicines explicitly written in the document. Otherwise return [].
- "doctor_notes" may only contain remarks explicitly written in the document.
- "abnormal_findings" is a plain restatement of which printed values fall outside their printed ranges.
- Do NOT include patient name, address, phone number, ID numbers or other identifiers anywhere in the output.
- If the document is not a medical report, is blank, or is too poor quality to read, set "readable": false, explain briefly in extraction_notes, and return empty arrays.
Return raw JSON only, no markdown fences, no commentary.`;

const ANALYSIS_PROMPT = `You are a cautious health-information assistant for a consumer health app. You explain lab reports in plain language. You are NOT a diagnostic or prescribing system.

You will receive a JSON object of data extracted from a user's medical report. Treat it as the ONLY source of truth.

Absolute safety rules:
- Never state or imply a definite diagnosis. Use language such as "may", "generally", "can be associated with".
- Never tell the user to start, stop or change any medication, and never suggest a drug, supplement dose or prescription.
- Never state a number of rest or recovery days unless it appears verbatim in doctor_notes.
- Never invent tests, values, ranges, medications or doctor instructions that are not in the input.
- Distinguish clearly between normal, abnormal and potentially concerning findings.
- Recommend professional consultation where appropriate; for potentially urgent patterns, advise prompt medical attention.
- Do not create emergency conclusions from uncertain or incomplete data.
- Avoid jargon; if a medical term is needed, explain it in the same sentence.

Return ONLY a JSON object with this exact shape:

{
  "summary": string,
  "overall_status": "routine" | "needs_review" | "prompt_attention",
  "overall_status_reason": string,
  "key_findings": {"normal": string[], "high": string[], "low": string[]},
  "test_explanations": [{"test_name": string, "what_it_measures": string, "what_result_generally_means": string, "factors_that_can_affect_it": string[], "when_to_discuss_with_doctor": string}],
  "nutrition": {"include": [{"item": string, "reason": string}], "limit": [{"item": string, "reason": string}], "hydration": string, "notes": string[]},
  "activity": {"guidance": string[], "notes": string[]},
  "specialists": [{"specialist": string, "reason": string, "urgency": "routine"|"soon"|"urgent"}],
  "warning_signs": {"level": "routine"|"needs_review"|"prompt_attention", "items": string[]}
}

Give a test_explanation for every abnormal test and for notable normal ones. Every nutrition item must include its reason and must never be a severe restrictive diet. Phrase specialist suggestions as general guidance, never as a requirement.
Return raw JSON only, no markdown fences, no commentary.`;

export async function extractFromFile(input: {
  dataUrl: string;
  mimeType: string;
  fileName: string;
}): Promise<ExtractionResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AnalyzerError("no_api", "AI analysis is not configured. Use demo mode to preview the feature.");

  const filePart =
    input.mimeType === "application/pdf"
      ? { type: "file", file: { filename: input.fileName, file_data: input.dataUrl } }
      : { type: "image_url", image_url: { url: input.dataUrl } };

  const raw = await callGateway(
    [
      { role: "system", content: EXTRACTION_PROMPT },
      {
        role: "user",
        content: [{ type: "text", text: "Extract the structured data from this medical report." }, filePart],
      },
    ],
    apiKey,
  );
  return parseJson<ExtractionResult>(raw);
}

export async function analyzeExtraction(extraction: ExtractionResult): Promise<AnalysisResult> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AnalyzerError("no_api", "AI analysis is not configured. Use demo mode to preview the feature.");

  const raw = await callGateway(
    [
      { role: "system", content: ANALYSIS_PROMPT },
      { role: "user", content: JSON.stringify(extraction) },
    ],
    apiKey,
  );
  return parseJson<AnalysisResult>(raw);
}

export async function answerFollowUp(input: {
  extraction: ExtractionResult;
  analysis: AnalysisResult | null;
  history: { role: "user" | "assistant"; content: string }[];
  question: string;
}): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new AnalyzerError("no_api", "AI answers are not configured right now.");

  const system = `You answer follow-up questions about a user's own medical report in plain, kind language.

Context (the only source of truth):
EXTRACTED REPORT DATA: ${JSON.stringify(input.extraction)}
PRIOR ANALYSIS: ${JSON.stringify(input.analysis ?? {})}

Rules:
- Answer only from the context above. If the answer is not in the report, say so plainly.
- Never diagnose, never prescribe, never suggest starting, stopping or changing any medication or dose.
- Never state a number of rest or recovery days unless it appears verbatim in the doctor's notes.
- Recommend speaking with a qualified healthcare professional where appropriate.
- If the user describes an emergency symptom (chest pain, severe breathlessness, fainting, heavy bleeding, one-sided weakness, confusion), tell them to seek emergency medical care immediately instead of continuing.
- Keep answers under 180 words, warm and jargon-free. Plain text only, no markdown headings.`;

  return callGateway(
    [
      { role: "system", content: system },
      ...input.history.slice(-8),
      { role: "user", content: input.question },
    ],
    apiKey,
  );
}

export function safetyCheck(analysis: AnalysisResult): AnalysisResult {
  const banned = /\b(you have|you are diagnosed|start taking|stop taking|increase your dose|decrease your dose|mg daily)\b/i;
  const scrub = (s: string) =>
    banned.test(s)
      ? s.replace(banned, "your report may show something that").concat(" Please confirm this with your doctor.")
      : s;
  return {
    ...analysis,
    summary: scrub(analysis.summary ?? ""),
    overall_status_reason: scrub(analysis.overall_status_reason ?? ""),
  };
}
