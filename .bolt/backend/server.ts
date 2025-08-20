// backend/server.ts
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8787;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Basic guard
if (!ANTHROPIC_API_KEY) {
  console.warn("⚠️ Missing ANTHROPIC_API_KEY in .env");
}

// Simple Claude call helper
async function claude(messages: { role: "user" | "assistant" | "system", content: string }[], temperature = 0.6) {
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY || "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1200,
      temperature,
      messages
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Claude error: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  // Claude returns { content: [{ type: "text", text: "..." }], ... }
  const text = data?.content?.[0]?.text ?? "";
  return text;
}

// Health
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "northform-node-backend" });
});

// Decision analyze
app.post("/api/analyze/decision", async (req, res) => {
  try {
    const { decision, options, userInputs } = req.body || {};
    if (!decision || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: "Provide decision and at least two options." });
    }

    const sys = `You are NorthForm's Decision Compass.
Return strict JSON with keys:
- recommendation (string)
- confidence (0-100 number)
- reasoning (array of 3-7 bullets)
- emotional_drivers (array of 3-6 bullets)
- neural_pathway_shift (array of 2-5 bullets)
- suggested_next_steps (array of 3-7 ordered steps)
Keep answers deeply specific and practical.`;

    const user = `
Decision: ${decision}
Options: ${options.map((o: string, i: number) => `${i + 1}. ${o}`).join("\n")}
User Inputs: ${JSON.stringify(userInputs || {}, null, 2)}
Return ONLY JSON.
`;

    const text = await claude(
      [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      0.6
    );

    // Try to parse JSON safely
    let parsed: any = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try to salvage JSON if the model included prose
      const match = text.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : null;
    }

    if (!parsed) {
      return res.status(502).json({ error: "Claude response was not valid JSON", raw: text });
    }

    res.json(parsed);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e?.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ NorthForm backend running on http://localhost:${PORT}`);
});
