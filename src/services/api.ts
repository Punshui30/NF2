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

// Configurables
const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";
// Default to "/api/analyze" but allow override (e.g., "/analyze")
const DEFAULT_ANALYZE_PATH =
  (import.meta as any)?.env?.VITE_API_ANALYZE_PATH ?? "/api/analyze";

// Helper: POST JSON with good error surfacing
async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  const ok = res.ok;

  // Try JSON parse when OK
  let data: any = null;
  if (ok) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { ok, status: res.status, text, data };
}

/**
 * Robust analyzer:
 * 1) Tries current shape against configured path.
 * 2) If 4xx, tries alternate common path.
 * 3) If still 4xx, tries FastAPI-friendly body ({input, user_profile, history}) on both paths.
 * First successful 2xx wins; otherwise throws combined errors.
 */
export async function analyzeDecision(
  decision: string,
  options: string[],
  userInputs: Record<string, any> = {}
): Promise<DecisionAnalysisResponse> {
  const paths = [
    `${API_BASE}${DEFAULT_ANALYZE_PATH}`, // e.g. /api/analyze
    `${API_BASE}/analyze`,                // fallback: /analyze
  ];

  // Your existing body shape
  const bodyA = { decision, options, userInputs };

  // Alternate body many FastAPI samples expect
  const bodyB = {
    input: decision,
    user_profile: userInputs,
    history: [] as Array<{ role: "user" | "assistant"; content: string }>,
  };

  const attempts: Array<{ url: string; body: any }> = [
    { url: paths[0], body: bodyA },
    { url: paths[1], body: bodyA },
    { url: paths[0], body: bodyB },
    { url: paths[1], body: bodyB },
  ];

  const errors: string[] = [];

  for (const attempt of attempts) {
    try {
      const { ok, status, text, data } = await postJson(attempt.url, attempt.body);
      if (ok) {
        const safe = (d: any): DecisionAnalysisResponse => ({
          confidence: typeof d?.confidence === "number" ? d.confidence : 60,
          recommendation:
            typeof d?.recommendation === "string"
              ? d.recommendation
              : "No recommendation available.",
          reasoning: Array.isArray(d?.reasoning) ? d.reasoning : [],
          suggestedNextSteps: Array.isArray(d?.suggestedNextSteps)
            ? d.suggestedNextSteps
            : [],
          raw: d,
        });
        if (import.meta.env.DEV) {
          console.log("✅ analyzeDecision success via", attempt.url, "payload:", attempt.body);
        }
        return safe(data);
      } else {
        errors.push(
          `(${status}) ${attempt.url} :: ${text?.slice(0, 300) || "no body"}`
        );
      }
    } catch (e: any) {
      errors.push(`(network) ${attempt.url} :: ${e?.message || e}`);
    }
  }

  // If we’re here, all attempts failed
  const errMsg = `analyze failed. Tried:\n- ${errors.join("\n- ")}`;
  console.error(errMsg);
  throw new Error(errMsg);
}

// Back-compat for OnboardingChat and older pages
export const analyze = analyzeDecision;

export const api = { analyzeDecision, analyze };
export default api;
