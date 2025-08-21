// src/services/api.ts
// Frontend client -> Netlify function /api/analyze (keeps key server-side)
import type { DecisionAnalysis } from "../types";

type AnalyzePayload = {
  input: string;
  context?: Record<string, any>;
  profile?: Record<string, any>;
  max_tokens?: number;
};

async function callAnalyze(payload: AnalyzePayload) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let msg: any;
    try {
      msg = await res.json();
    } catch {
      msg = await res.text();
    }
    console.error("Analyze failed:", msg);
    throw new Error(`Analyze failed (${res.status})`);
  }
  return (await res.json()) as { text: string; model: string };
}

class NorthFormAPI {
  async analyzeDecision(
    decision: string,
    options: string[],
    userInputs: any
  ): Promise<DecisionAnalysis> {
    const prompt = this.buildPrompt(decision, options, userInputs);
    const { text } = await callAnalyze({
      input: prompt,
      context: userInputs ?? {},
      profile: {},
      max_tokens: 1500,
    });
    return this.parseDecision(text, decision, options);
  }

  private buildPrompt(decision: string, options: string[], userInputs: any) {
    return [
      `Analyze this decision using cognitive & behavioral science. Be direct; practical.`,
      `Decision: "${decision}"`,
      `Options:\n${options.map((o, i) => `${i + 1}. ${o}`).join("\n")}`,
      `User signals: ${JSON.stringify(userInputs)}`,
      `Return EXACTLY:`,
      `Recommendation: <one paragraph>`,
      `Key Insights: - bullet\n- bullet\n- bullet`,
      `Next Steps: - bullet\n- bullet\n- bullet`,
      `Confidence 0-100%`,
    ].join("\n\n");
  }

  private parseDecision(text: string, decision: string, options: string[]): DecisionAnalysis {
    const rec = this.captureBlock(text, /^Recommendation[:\s]*/i);
    const insights = this.linesToBullets(this.captureBlock(text, /^Key Insights[:\s]*/i));
    const steps = this.linesToBullets(this.captureBlock(text, /^Next Steps[:\s]*/i));
    const conf = this.captureNumber(text, /Confidence[^0-9]*(\d{1,3})/i) ?? 80;

    return {
      decisionType: this.guessType(decision),
      options,
      recommendation: rec || "Proceed with the option that best matches your core values and constraints.",
      reasoning: insights.length ? insights : ["Signal quality was low; used general heuristics."],
      suggestedNextSteps: steps.length ? steps : ["Clarify constraints", "Run a 7–day test", "Schedule review"],
      emotionalDrivers: [],
      neuralPathwayShift: "",
      riskAssessment: "",
      confidence: Math.min(100, Math.max(0, conf)),
    } as unknown as DecisionAnalysis;
  }

  private captureBlock(text: string, header: RegExp): string {
    const lines = text.split(/\r?\n/);
    const idx = lines.findIndex((l) => header.test(l));
    if (idx === -1) return "";
    const out: string[] = [];
    for (let i = idx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (/^\s*(Recommendation|Key Insights|Next Steps|Confidence)\b/i.test(line)) break;
      out.push(line);
    }
    return out.join("\n").trim();
  }

  private linesToBullets(block: string): string[] {
    if (!block) return [];
    return block
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => l.replace(/^[-•\d.)\s]+/, ""))
      .slice(0, 8);
  }

  private captureNumber(text: string, re: RegExp): number | null {
    const m = text.match(re);
    if (!m) return null;
    const n = parseInt(m[1], 10);
    return Number.isNaN(n) ? null : n;
    }

  private guessType(decision: string): string {
    const map: Record<string, string[]> = {
      career: ["job", "career", "offer", "role", "company"],
      relationship: ["relationship", "marriage", "partner", "breakup"],
      financial: ["money", "invest", "budget", "buy", "purchase"],
      health: ["health", "medical", "fitness", "wellness"],
      education: ["school", "study", "degree", "program"],
      location: ["move", "relocate", "city", "country"],
    };
    const d = decision.toLowerCase();
    for (const [k, arr] of Object.entries(map)) {
      if (arr.some((w) => d.includes(w))) return k;
    }
    return "general";
  }
}

export const api = new NorthFormAPI();
