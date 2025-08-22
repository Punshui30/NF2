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

export type CoachResponse = {
  reply: string;
  profilePatch: Record<string, any>;
  raw?: any;
};

const JSON_HEADERS: HeadersInit = { "Content-Type": "application/json" };

/**
 * Analyze a decision.
 * - `options` can be string[] (preferred), a single string, or undefined/null. We normalize it.
 * - Always posts to /api/analyze (Netlify routes /api/* to functions).
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
  if (!res.ok) throw new Error(`analyze failed: ${res.status} ${text}`);

  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    confidence: typeof data.confidence === "number" ? data.confidence : 60,
    recommendation:
      typeof data.recommendation === "string" ? data.recommendation : "No recommendation available.",
    reasoning: Array.isArray(data.reasoning) ? data.reasoning : [],
    suggestedNextSteps: Array.isArray(data.suggestedNextSteps) ? data.suggestedNextSteps : [],
    raw: data,
  };
}

/**
 * Send a chat turn to onboarding "coach" mode.
 * Always sends the exact shape the function expects.
 */
export async function coachMessage(
  message: string,
  profile?: Record<string, any>
): Promise<CoachResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({
      mode: "coach",
      message,
      profile: profile ?? {},
    }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`coach failed: ${res.status} ${text}`);

  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    reply: typeof data.reply === "string" ? data.reply : "Got it. Tell me more.",
    profilePatch: typeof data.profilePatch === "object" && data.profilePatch ? data.profilePatch : {},
    raw: data,
  };
}

// Back-compat alias
export const analyze = analyzeDecision;

/** Named + default export so both import styles work */
export const api = { analyzeDecision, analyze, coachMessage };
export default api;
