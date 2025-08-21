// netlify/functions/analyze.ts
import type { Handler } from "@netlify/functions";

const ANTHROPIC_API_KEY =
  process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_APIKEY || "";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

const ok = (data: any) => ({
  statusCode: 200,
  headers: CORS,
  body: JSON.stringify(data),
});

const bad = (status: number, msg: string) => ({
  statusCode: status,
  headers: CORS,
  body: JSON.stringify({ error: msg }),
});

export const handler: Handler = async (event) => {
  // CORS preflight for safety (helps if you ever hit it cross-origin)
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers: CORS, body: "" };
  if (event.httpMethod !== "POST") return bad(405, "Method not allowed");

  let body: any = {};
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return bad(400, "Bad JSON");
  }

  if (!ANTHROPIC_API_KEY) {
    // Keep graceful message (don’t crash UI)
    return bad(500, "Missing ANTHROPIC_API_KEY");
  }

  // ===== MODE A: Decision analysis (DecisionCompassPage) =====
  if (body.decision && Array.isArray(body.options)) {
    const sys = `You are a decision analyst. Return STRICT JSON with keys:
- confidence (0-100)
- recommendation (string)
- reasoning (array of 3-6 concise bullet strings)
- suggestedNextSteps (array of 3-6 imperative steps)

Base analysis on the user's inputs if provided. Respond ONLY with JSON.`;

    const user = `Decision: ${body.decision}
Options: ${JSON.stringify(body.options)}
UserInputs: ${JSON.stringify(body.userInputs || {})}`;

    try {
      const ai = await anthropicJSON(sys, user);
      return ok(ai);
    } catch (e: any) {
      // Safe fallback (avoid undefined when options is empty)
      const firstOption = Array.isArray(body.options) && body.options.length > 0 ? body.options[0] : "the most feasible option";
      return ok({
        confidence: 62,
        recommendation: `Based on your priorities, "${firstOption}" looks promising. Validate assumptions before committing.`,
        reasoning: [
          "Aligns with near-term goals and constraints",
          "Risks appear manageable relative to upside",
          "Best fit for current energy/time budget",
        ],
        suggestedNextSteps: [
          "Write a one-page decision doc",
          "List top 3 risks and countermeasures",
          "Do a 48-hour check-in to reassess",
        ],
      });
    }
  }

  // ===== MODE B: Conversational onboarding (“coach”) =====
  if (body.mode === "coach" && typeof body.message === "string") {
    const profile = body.profile || {};
    const sys = `You are NorthForm's onboarding guide.
Task: Read USER message and update a JSON "profilePatch" capturing: values[], antiValues[], lifeVision, goal90d, goal12m, nonNegs[], constraints[], decisionStyle, biasNotes, and any convo snippets (conv: {fam, frd, wrk}) you infer.

Rules:
- Return STRICT JSON with keys: reply (string), profilePatch (object).
- The "reply" should be warm, concise, and ask one useful follow-up question.
- Be conservative in updates (only fill what you’re confident about).
- NEVER include PII the user didn’t provide.`;

    const user = `CurrentProfile (partial): ${JSON.stringify(profile)}
UserMessage: ${body.message}`;

    try {
      const ai = await anthropicJSON(sys, user);
      const reply = typeof ai.reply === "string" ? ai.reply : "Got it. Tell me more.";
      const profilePatch = typeof ai.profilePatch === "object" && ai.profilePatch ? ai.profilePatch : {};
      return ok({ reply, profilePatch });
    } catch {
      return ok({
        reply: "Noted. Could you share one short example of a recent decision and how you chose?",
        profilePatch: {},
      });
    }
  }

  // If neither mode matched, surface exactly what we received (helps you debug callers)
  return bad(400, `Unsupported payload. Received keys: ${Object.keys(body).join(", ") || "none"}`);
};

// ------- helpers -------

async function anthropicJSON(system: string, user: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 800,
      temperature: 0.2,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) throw new Error(`Anthropic ${res.status} ${text.slice(0, 500)}`);

  // Messages API -> { content: [{ type: "text", text: "..." }], ... }
  let llmText = "";
  try {
    const j = JSON.parse(text);
    llmText = j?.content?.[0]?.text ?? "";
  } catch {
    llmText = text;
  }

  const parsed = safeParseJSON(llmText);
  if (!parsed) throw new Error("Bad JSON from model");
  return parsed;
}

function safeParseJSON(s: string) {
  try {
    return JSON.parse(s);
  } catch {}
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(s.slice(start, end + 1));
    } catch {}
  }
  return null;
}
