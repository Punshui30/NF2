// src/services/api.ts

export type DecisionAnalysisRequest = {
  decision: string;
  options: string[];
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
 * Calls the Netlify function at /api/analyze.
 * netlify.toml redirects /api/* -> /.netlify/functions/:splat
 */
export async function analyzeDecision(
  decision: string,
  options: string[],
  userInputs: Record<string, any> = {}
): Promise<DecisionAnalysisResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ decision, options, userInputs }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`analyze failed: ${res.status} ${text}`);
  }

  const data = await res.json();

  return {
    confidence: typeof data.confidence === "number" ? data.confidence : 60,
    recommendation:
      typeof data.recommendation === "string"
        ? data.recommendation
        : "No recommendation available.",
    reasoning: Array.isArray(data.reasoning) ? data.reasoning : [],
    suggestedNextSteps: Array.isArray(data.suggestedNextSteps) ? data.suggestedNextSteps : [],
    raw: data,
  };
}

/** Back-compat export for files importing { analyze } */
export const analyze = analyzeDecision;

/** Object export for files importing { api } */
export const api = { analyzeDecision, analyze };

export type { DecisionAnalysisResponse as DecisionResult };
export default api;
