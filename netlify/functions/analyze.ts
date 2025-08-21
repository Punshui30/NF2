import type { Handler } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, headers: cors(), body: "" };
    }
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: cors(), body: "Method Not Allowed" };
    }

    const { input, context, profile, max_tokens = 1500 } = JSON.parse(event.body || "{}");

    const system = `
You are NorthForm, a rigorous life-alignment analyst.
Apply: Internal Family Systems (parts & Self), cognitive biases, habit loops,
values alignment, risk framing, temporal discounting, and decision hygiene.
Ask for missing info. Be specific and actionable. Never invent data.

When user text implies "parts", identify managers/firefighters/exiles,
propose gentle unblending, and a short Self-led experiment.

Return clear sections:
- Recommendation
- Key Insights (bullets)
- Emotional Drivers (bullets)
- Neural Pathway Shift (one paragraph)
- Next Steps (numbered)
- Confidence: NN%
    `.trim();

    const userBlock = [
      `INPUT:\n${input}`,
      profile ? `PROFILE:\n${JSON.stringify(profile).slice(0, 4000)}` : "",
      context ? `CONTEXT:\n${JSON.stringify(context).slice(0, 2000)}` : ""
    ].filter(Boolean).join("\n\n");

    const resp = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      system,
      max_tokens,
      temperature: 0.4,
      messages: [{ role: "user", content: userBlock }],
    });

    const text = (resp.content?.map((c: any) => c.text).join("\n") || "").trim() || "No content.";

    return {
      statusCode: 200,
      headers: { ...cors(), "Content-Type": "application/json" },
      body: JSON.stringify({ text, model: resp.model }),
    };
  } catch (e: any) {
    console.error("Analyze error:", e?.message || e);
    return { statusCode: 500, headers: cors(), body: JSON.stringify({ error: "Analyze failed" }) };
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}
