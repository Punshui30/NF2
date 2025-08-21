// netlify/functions/analyze.ts
export default async (req: Request) => {
  try {
    if (req.method === "GET") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
      });
    }
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { input, context = {}, profile = {}, max_tokens = 1200 } = await req.json();

    if (!input || typeof input !== "string") {
      return new Response(JSON.stringify({ error: "input is required (string)" }), { status: 400 });
    }

    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) {
      return new Response(JSON.stringify({ error: "Server missing ANTHROPIC_API_KEY" }), { status: 500 });
    }
    const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";

    const systemPrompt =
      "You are NorthForm's Decision Engine. Be direct, practical, forward-thinking. " +
      "Silently use cognitive & behavioral science. Use pasted conversation snippets as PRIMARY evidence. " +
      "Treat any user-added context as SUBJECTIVE and discount it if it conflicts with observed patterns. " +
      "Identify likely biases (confirmation, availability, status-quo) and counterbalance them. " +
      "Return EXACTLY four sections: Recommendation; Key Insights (bullets); Next Steps (bullets); Confidence NN%.";

    const userContent =
      [
        "User input:\n" + input.trim(),
        Object.keys(context || {}).length ? "\nContext:\n" + JSON.stringify(context) : "",
        Object.keys(profile || {}).length ? "\nProfile:\n" + JSON.stringify(profile) : "",
      ].join("");

    const body = {
      model,
      max_tokens,
      system: systemPrompt,
      messages: [{ role: "user", content: userContent }],
    };

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await r.json();
    if (!r.ok) {
      return new Response(JSON.stringify({ anthropic_error: data }), { status: 502 });
    }

    const content = Array.isArray((data as any)?.content) ? (data as any).content : [];
    const textBlock = content.find((c: any) => c?.type === "text");
    const text = textBlock?.text || "";

    return new Response(JSON.stringify({ text, model: (data as any)?.model || model }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), { status: 500 });
  }
};
