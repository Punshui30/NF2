// netlify/functions/analyze.ts
import type { Handler } from "@netlify/functions";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) {
      return json({ error: "Server missing ANTHROPIC_API_KEY" }, 500);
    }

    const body = safeJson(event.body);
    const input = (body?.input ?? "").toString();
    const context = body?.context ?? {};
    const profile = body?.profile ?? {};
    const max_tokens = Number(body?.max_tokens ?? 1200);

    if (!input.trim()) return json({ error: "input is required (string)" }, 400);

    const systemPrompt =
      "You are NorthForm's Decision Engine. Be direct, practical, and forward-thinking. " +
      "Quietly leverage IFS, Enneagram, key business personality models, and neuroscience (habit loops, reappraisal, attentional control). " +
      "Do not name frameworks. Identify drivers (fear, avoidance, status-quo bias), expose tradeoffs, " +
      "and deliver a concise, actionable plan with steps, checkpoints, and risks.";

    const payload = {
      model: MODEL,
      max_tokens,
      system: systemPrompt,
      messages: [{ role: "user", content: buildUserContent(input, context, profile) }],
    };

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!r.ok) {
      return json({ anthropic_error: data }, 502);
    }

    const content = Array.isArray(data?.content) ? data.content : [];
    const textBlock = content.find((c: any) => c?.type === "text");
    const text = textBlock?.text || "";

    return json({ text, model: data?.model || MODEL }, 200);
  } catch (err: any) {
    return json({ error: err?.message || "Unknown error" }, 500);
  }
};

function buildUserContent(
  input: string,
  context: Record<string, any>,
  profile: Record<string, any>
) {
  return [
    "User input:\n" + input.trim(),
    context && Object.keys(context).length ? "\nContext:\n" + JSON.stringify(context) : "",
    profile && Object.keys(profile).length ? "\nProfile:\n" + JSON.stringify(profile) : "",
  ].join("");
}

function safeJson(raw: string | null): any {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function json(obj: any, status = 200) {
  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}
