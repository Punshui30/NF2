// src/services/api.ts

export type DecisionAnalysisRequest = {
  decision: string;
  options: string[] | string | null | undefined;
  userInputs?: Record<string, any>;
};

export type DecisionAnalysisResponse = {
  confidence: number;
  recommendation: string;
  reasoning: string[];
  suggestedNextSteps: string[];
  raw?: any;
};

const JSON_HEADERS: HeadersInit = { "Content-Type": "application/json" };

/**
 * Analyze a decision.
 * - `options` can be string[] (preferred), a single string, or undefined/null. We normalize it to [] or [string].
 * - Always posts to /api/analyze (Netlify redirects /api/* to functions).
 */
export async function analyzeDecision(
  decision: string,
  options?: string[] | string | null,
  userInputs: Record<string, any> = {}
): Promise<DecisionAnalysisResponse> {
  const normOptions: string[] = Array.isArray(options)
    ? options
    : typeof options === "string"
    ? [options]
    : [];

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ decision, options: normOptions, userInputs }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    throw new Error(`analyze failed: ${res.status} ${text}`);
  }

  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    confidence: typeof data.confidence === "number" ? data.confidence : 60,
    recommendation:
      typeof data.recommendation === "string"
        ? data.recommendation
        : "No recommendation available.",
    reasoning: Array.isArray(data.reasoning) ? data.reasoning : [],
    suggestedNextSteps: Array.isArray(data.suggestedNextSteps)
      ? data.suggestedNextSteps
      : [],
    raw: data,
  };
}

// Back-compat alias
export const analyze = analyzeDecision;

/** ✅ Named export expected by DecisionCompassPage.tsx */
export const api = { analyzeDecision, analyze };

/** Also provide a default export (works with `import api from "../services/api"`) */
export default api;
