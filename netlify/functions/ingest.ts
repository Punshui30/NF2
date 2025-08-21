// netlify/functions/ingest.ts
import type { Handler } from "@netlify/functions";

const MODEL = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
const UA = "NorthFormBot/1.0 (+https://northform.example)";

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return json({ error: "Method not allowed" }, 405);
    const API_KEY = process.env.ANTHROPIC_API_KEY;
    if (!API_KEY) return json({ error: "Server missing ANTHROPIC_API_KEY" }, 500);

    const body = safeJson(event.body);
    const urls: string[] = Array.isArray(body?.urls) ? body.urls.slice(0, 5) : [];
    const pastedText: string = (body?.text ?? "").toString();

    if (!urls.length && !pastedText.trim()) return json({ error: "Provide urls[] or text" }, 400);

    const sources: Array<{ url: string; status: "ok" | "blocked_auth" | "error"; chars?: number; code?: number }> = [];
    let corpus = "";

    if (urls.length) {
      for (const url of urls) {
        try {
          const r = await fetch(url, { headers: { "user-agent": UA } });
          const html = await r.text();

          // detect common login walls (FB/IG/etc)
          const loginWall =
            /log in|login|sign in|must log in|create an account/i.test(html) &&
            /(facebook|instagram|threads\.net)/i.test(url);

          if (r.status === 401 || r.status === 403 || loginWall) {
            sources.push({ url, status: "blocked_auth", code: r.status });
            continue;
          }

          const text = htmlToText(html).slice(0, 20000);
          corpus += `\n\n=== SOURCE: ${url} ===\n${text}`;
          sources.push({ url, status: "ok", chars: text.length, code: r.status });
        } catch (e: any) {
          sources.push({ url, status: "error", code: 0 });
        }
      }
    }

    if (pastedText) {
      corpus += `\n\n=== USER_PASTED ===\n${pastedText.slice(0, 30000)}`;
      sources.push({ url: "pasted_text", status: "ok", chars: pastedText.length, code: 200 });
    }

    const system =
      "You are NorthForm's Social Insight Engine. Extract enduring patterns from public text without overfitting. " +
      "Infer values, likely traits, tone, topics, and communication style. Be conservative and avoid strong claims.";

    const user =
      `Analyze the corpus and return a compact JSON profile.\n` +
      `Schema:\n{\n  "platforms": string[],\n  "personalityIndicators": string[],\n  "values": string[],\n  "emotionalTone": number,\n  "communicationStyle": string,\n  "topics": string[]\n}\n\n` +
      `Corpus:\n${corpus}`;

    const payload = { model: MODEL, max_tokens: 1000, system, messages: [{ role: "user", content: user }] };

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
    if (!r.ok) return json({ anthropic_error: data, sources }, 502);

    const content = Array.isArray(data?.content) ? data.content : [];
    const text = content.find((c: any) => c?.type === "text")?.text || "";
    const profile =
      tryParseJson(text) || {
        platforms: [],
        personalityIndicators: [],
        values: [],
        emotionalTone: 0.5,
        communicationStyle: "neutral",
        topics: [],
      };

    return json({ profile, sources });
  } catch (e: any) {
    return json({ error: e?.message || "Unknown error" }, 500);
  }
};

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tryParseJson(s: string) {
  try {
    const m = s.match(/\{[\s\S]*\}$/m) || s.match(/\{[\s\S]*\}/m);
    return JSON.parse(m ? m[0] : s);
  } catch {
    return null;
  }
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
  return { statusCode: status, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}
