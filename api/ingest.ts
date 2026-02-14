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

    const urls: string[] = Array.isArray(body.urls) ? body.urls.slice(0, 5) : [];
    const pastedText: string = (body.text || "").toString();

    if (!urls.length && !pastedText.trim()) {
        return new Response(JSON.stringify({ error: "Provide urls[] or text" }), {
            status: 400,
            headers: JSON_HEADERS,
        });
    }

    const sources: Array<{
        url: string;
        status: "ok" | "blocked_auth" | "error";
        chars?: number;
        code?: number;
    }> = [];
    let corpus = "";

    // Process URLs (simplified fetch - real-world needs robust scraping)
    if (urls.length) {
        for (const url of urls) {
            try {
                const r = await fetch(url, {
                    headers: { "user-agent": "NorthFormBot/1.0" },
                });
                const html = await r.text();

                // Basic login wall detection
                const loginWall =
                    /log in|login|sign in/i.test(html) &&
                    /(facebook|instagram|linkedin)/i.test(url);

                if (r.status === 401 || r.status === 403 || loginWall) {
                    sources.push({ url, status: "blocked_auth", code: r.status });
                    continue;
                }

                const text = html.replace(/<[^>]+>/g, " ").slice(0, 20000);
                corpus += `\n\n=== SOURCE: ${url} ===\n${text}`;
                sources.push({ url, status: "ok", chars: text.length, code: r.status });
            } catch (e) {
                sources.push({ url, status: "error", code: 0 });
            }
        }
    }

    if (pastedText) {
        corpus += `\n\n=== USER_PASTED ===\n${pastedText.slice(0, 30000)}`;
        sources.push({
            url: "pasted_text",
            status: "ok",
            chars: pastedText.length,
            code: 200,
        });
    }

    const systemPrompt = `You are NorthForm's Social Insight Engine. Extract enduring patterns from public text without overfitting.
Infer values, likely traits, tone, topics, and communication style. Be conservative and avoid strong claims.
Return STRICT JSON with keys:
- platforms (string[])
- personalityIndicators (string[])
- values (string[])
- emotionalTone (number 0-1)
- communicationStyle (string)
- topics (string[])`;

    const userPrompt = `Corpus:\n${corpus}`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            response_format: { type: "json_object" },
        });

        const profile = JSON.parse(completion.choices[0].message.content || "{}");
        const safeProfile = {
            platforms: profile.platforms || [],
            personalityIndicators: profile.personalityIndicators || [],
            values: profile.values || [],
            emotionalTone: profile.emotionalTone || 0.5,
            communicationStyle: profile.communicationStyle || "neutral",
            topics: profile.topics || [],
        };

        return new Response(JSON.stringify({ profile: safeProfile, sources }), {
            status: 200,
            headers: JSON_HEADERS,
        });
    } catch (e: any) {
        console.error("OpenAI Ingest Error:", e);
        return new Response(
            JSON.stringify({
                error: "AI Ingestion Failed",
                details: e.message,
                sources,
            }),
            { status: 500, headers: JSON_HEADERS }
        );
    }
}
