export type AnalyzePayload = {
  input: string;
  context?: Record<string, any>;
  profile?: Record<string, any>;
  max_tokens?: number;
};

const API_BASE = "/api"; // netlify redirect -> functions

async function callAnalyze(payload: AnalyzePayload) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Analyze failed: ${res.status} ${msg}`);
  }
  return (await res.json()) as { text: string; model: string };
}

export async function analyze(input: string, ctx?: any, profile?: any, max_tokens = 1500) {
  return callAnalyze({ input, context: ctx, profile, max_tokens });
}
