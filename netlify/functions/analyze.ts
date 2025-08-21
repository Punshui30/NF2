import type { Handler } from "@netlify/functions";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json({ error: "Method not allowed" }, 405);
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) return json({ error: "Server missing ANTHROPIC_API_KEY" }, 500);

    const body = safeJson(event.body);
    const profile = body?.profile ?? {};
    const context = body?.context ?? {};
    const input = (body?.input ?? "").toString();
    const max_tokens = Number(body?.max_tokens ?? 1500);
    const depth: "quick" | "deep" = profile?.depth === "quick" ? "quick" : "deep";

    // If this is a Decision Compass task, gate on profile completeness first
    if (profile?.nf_task === "decision") {
      const decision = String(profile?.decision ?? "");
      const options: string[] = Array.isArray(profile?.options) ? profile.options : [];
      const userInputs = typeof profile?.userInputs === "object" && profile?.userInputs ? profile.userInputs : {};

      const { missing, questions } = checkProfileCompleteness(userInputs);
      if (questions.length) {
        return json({
          status: "needs_profile",
          requested: { missing, questions },
          note: "Collect these answers then call /api/analyze again with updated userInputs."
        });
      }

      // Build deep prompt + schema now that we have enough signal
      const { systemPrompt, userPrompt } = buildDecisionPrompt(
        { decision, options, userInputs }, depth
      );

      const payload = {
        model: MODEL,
        max_tokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
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
      if (!r.ok) return json({ anthropic_error: data }, 502);

      const content = Array.isArray(data?.content) ? data.content : [];
      const text = content.find((c: any) => c?.type === "text")?.text || "";
      return json({ status: "ok", text, model: data?.model || MODEL });
    }

    // Fallback (non-decision requests): keep your base behavior
    const baseSystem = baseSystemPrompt();
    const payload = { model: MODEL, max_tokens, system: baseSystem, messages: [{ role: "user", content: input }] };
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "anthropic-version": "2023-06-01", "x-api-key": API_KEY },
      body: JSON.stringify(payload),
    });
    const data = await r.json();
    if (!r.ok) return json({ anthropic_error: data }, 502);
    const content = Array.isArray(data?.content) ? data.content : [];
    const text = content.find((c: any) => c?.type === "text")?.text || "";
    return json({ status: "ok", text, model: data?.model || MODEL });

  } catch (err: any) {
    return json({ error: err?.message || "Unknown error" }, 500);
  }
};

/* ---------- profile gating ---------- */

function checkProfileCompleteness(u: Record<string, any>) {
  // Minimal signal we want before “deep” decisions
  const required: Array<{ key: string; label: string; ask: string; type: "text" | "number" | "multi" }> = [
    { key: "values",       label: "Core values",          ask: "List 3–5 core values that matter most to you.",     type: "multi" },
    { key: "lifeVision",   label: "Life vision",          ask: "Describe your 2–3 sentence life vision.",           type: "text" },
    { key: "riskTolerance",label: "Risk tolerance (0-10)",ask: "Rate your current risk tolerance from 0–10.",      type: "number" },
    { key: "timeHorizon",  label: "Time horizon",         ask: "What time horizon are you optimizing for?",         type: "text" },
    { key: "constraints",  label: "Hard constraints",      ask: "List hard constraints (money, health, family, etc.)", type: "multi" }
  ];

  const missing: string[] = [];
  const questions: Array<{ key: string; label: string; prompt: string; type: string }> = [];

  for (const r of required) {
    const v = u[r.key];
    const has =
      (r.type === "multi"   && Array.isArray(v) && v.length > 0) ||
      (r.type === "number"  && (v || v === 0)) ||
      (r.type === "text"    && typeof v === "string" && v.trim().length > 0);

    if (!has) {
      missing.push(r.key);
      questions.push({ key: r.key, label: r.label, prompt: r.ask, type: r.type });
    }
  }
  return { missing, questions };
}

/* ---------- prompt builders ---------- */

function baseSystemPrompt() {
  return (
    "You are NorthForm's Decision Engine. Be direct, practical, forward-thinking. " +
    "Quietly leverage internal family systems (without naming it), Enneagram lenses, " +
    "and neuroscience (habit loops, attentional control, cognitive reappraisal). " +
    "Always surface tradeoffs, hidden assumptions, and implementation risks. " +
    "Prefer specific, testable steps over generic advice."
  );
}

type DecisionProfile = { decision: string; options: string[]; userInputs: Record<string, any> };

function buildDecisionPrompt(p: DecisionProfile, depth: "quick" | "deep") {
  const systemPrompt =
    baseSystemPrompt() +
    ` Return ONLY JSON matching the schema. Do not add prose before or after.`;

  const schema = `
{
  "type":"object",
  "properties":{
    "recommendation":{"type":"string"},
    "reasoning":{"type":"array","items":{"type":"string"},"minItems":4},
    "emotionalDrivers":{"type":"array","items":{"type":"string"}},
    "ifsMap":{"type":"object","properties":{
      "managers":{"type":"array","items":{"type":"string"}},
      "firefighters":{"type":"array","items":{"type":"string"}},
      "exiles":{"type":"array","items":{"type":"string"}}
    }},
    "biasAudit":{"type":"array","items":{"type":"string"}},
    "optionScores":{"type":"array","items":{
      "type":"object",
      "properties":{
        "option":{"type":"string"},
        "valueAlignment":{"type":"number"},
        "risk":{"type":"number"},
        "energy":{"type":"number"},
        "growth":{"type":"number"},
        "narrativeFit":{"type":"number"},
        "total":{"type":"number"}
      },
      "required":["option","total"]
    }},
    "neuralShifts":{"type":"string"},
    "suggestedNextSteps":{"type":"array","items":{"type":"string"},"minItems":4},
    "confidence":{"type":"number"}
  },
  "required":["recommendation","reasoning","suggestedNextSteps","confidence"],
  "additionalProperties":false
}`;

  const depthRubric =
    depth === "deep"
      ? "Be exhaustive: ≥6 reasoning bullets; 5–8 next steps with checkpoints and failure modes."
      : "Be concise: ~4 reasoning bullets; 4–5 next steps.";

  const userPrompt =
    `TASK: Decision analysis with psychological depth.\n\n` +
    `Decision: ${p.decision}\n` +
    `Options:\n- ${p.options.join("\n- ")}\n\n` +
    `UserInputs:\n${JSON.stringify(p.userInputs, null, 2)}\n\n` +
    `Output:\n- Strictly follow this JSON Schema:\n${schema}\n` +
    `- Score each option on valueAlignment, risk (lower is better), energy, growth, narrativeFit, and total (0–100).\n` +
    `- EmotionalDrivers = core motivations/fears (do NOT name frameworks).\n` +
    `- NeuralShifts = specific, neuroscience-backed tactics (implementation-ready).\n` +
    `- ${depthRubric}\n`;

  return { systemPrompt, userPrompt };
}

/* ---------- helpers ---------- */

function safeJson(raw: string | null): any { if (!raw) return {}; try { return JSON.parse(raw); } catch { return {}; } }
function json(obj: any, status = 200) { return { statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) }; }
