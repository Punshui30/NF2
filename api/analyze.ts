import OpenAI from "openai";

export const config = {
  runtime: "edge",
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: JSON_HEADERS });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: JSON_HEADERS,
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "Missing OPENAI_API_KEY" }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad JSON" }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  // ---- MODE A: Decision Analysis ----
  const decision = body.decision || body.input;
  if (typeof decision === "string") {
    const optionsRaw = body.options;
    const userInputs = body.userInputs || body.user_profile || {};
    const options = Array.isArray(optionsRaw)
      ? optionsRaw
      : typeof optionsRaw === "string"
      ? [optionsRaw]
      : [];

    const systemPrompt = `You are a decision analyst using psychology and neuroscience principles.
Return STRICT JSON with keys:
- confidence (number 0-100)
- recommendation (string)
- reasoning (array of 3-6 concise bullet strings)
- suggestedNextSteps (array of 3-6 imperative steps)
Base analysis on the user's inputs. Respond ONLY with JSON.`;

    const userPrompt = `Decision: ${decision}
Options: ${JSON.stringify(options)}
UserInputs: ${JSON.stringify(userInputs)}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: JSON_HEADERS,
      });
    } catch (e: any) {
      console.error("OpenAI Error:", e);
      return new Response(
        JSON.stringify({
          error: "AI Analysis Failed",
          details: e.message,
        }),
        { status: 500, headers: JSON_HEADERS }
      );
    }
  }

  // ---- MODE B: Conversational Coach ----
  if (body.mode === "coach" && typeof body.message === "string") {
    const profile = body.profile || {};
    const systemPrompt = `You are NorthForm's onboarding guide.
Task: Read USER message and update a JSON "profilePatch" capturing: values[], antiValues[], lifeVision, goal90d, goal12m, nonNegs[], constraints[], decisionStyle, biasNotes, and any convo snippets (conv: {fam, frd, wrk}) you infer.
Rules:
- Return STRICT JSON with keys: reply (string), profilePatch (object).
- The "reply" should be warm, concise, and ask one useful follow-up question.
- Be conservative in updates (only fill what you’re confident about).
- NEVER include PII the user didn’t provide.`;

    const userPrompt = `CurrentProfile (partial): ${JSON.stringify(profile)}
UserMessage: ${body.message}`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: JSON_HEADERS,
      });
    } catch (e: any) {
      console.error("OpenAI Coach Error:", e);
      return new Response(
        JSON.stringify({
          error: "Coach AI Failed",
          details: e.message,
        }),
        { status: 500, headers: JSON_HEADERS }
      );
    }
  }

  return new Response(JSON.stringify({ error: "Unsupported payload" }), {
    status: 400,
    headers: JSON_HEADERS,
  });
}
