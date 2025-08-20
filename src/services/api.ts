// src/services/api.ts
// Client → serverless function → Anthropic (key stays server-side)
// No SDK in the browser. No VITE_ secrets.

import {
  DecisionAnalysis,
  CareerAnalysis,
  RelocationAnalysis,
  SocialProfile,
  BiometricData,
} from "../types";

// Unified server call
type AnalyzePayload = {
  input: string;
  context?: Record<string, any>;
  profile?: Record<string, any>;
  max_tokens?: number;
};

const API_BASE = "/api"; // netlify.toml redirects /api/* -> /.netlify/functions/*

async function callAnalyze(payload: AnalyzePayload) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

export class NorthFormAPI {
  // ===== Public methods (unchanged signatures) =====

  async analyzeDecision(
    decision: string,
    options: string[],
    userInputs: any,
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): Promise<DecisionAnalysis> {
    const prompt = this.buildIntelligentDecisionPrompt(
      decision,
      options,
      userInputs,
      socialData,
      biometrics
    );

    const profile = this.buildProfile(socialData, biometrics);
    const { text } = await callAnalyze({
      input: prompt,
      context: userInputs ?? {},
      profile,
      max_tokens: 1500,
    });

    const analysis = this.parseDecisionResponse(text);
    return {
      ...analysis,
      decisionType: this.categorizeDecision(decision),
      options,
      riskAssessment: this.assessRisk(decision, userInputs),
    } as DecisionAnalysis;
  }

  async analyzeCareer(
    userInputs: any,
    currentSituation: string,
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): Promise<CareerAnalysis> {
    const prompt = this.buildIntelligentCareerPrompt(
      userInputs,
      currentSituation,
      socialData,
      biometrics
    );

    const profile = this.buildProfile(socialData, biometrics);
    const { text } = await callAnalyze({
      input: prompt,
      context: userInputs ?? {},
      profile,
      max_tokens: 1500,
    });

    const analysis = this.parseCareerResponse(text);
    return {
      ...analysis,
      suggestedCareers: this.generateCareerSuggestions(userInputs),
      companies: this.generateCompanySuggestions(userInputs),
      workEnvironment: this.determineWorkEnvironment(userInputs),
      skillGaps: this.identifySkillGaps(userInputs, currentSituation),
    } as CareerAnalysis;
  }

  async analyzeRelocation(
    userInputs: any,
    currentLocation: string,
    preferences: string[],
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): Promise<RelocationAnalysis> {
    const prompt = this.buildIntelligentRelocationPrompt(
      userInputs,
      currentLocation,
      preferences,
      socialData,
      biometrics
    );

    const profile = this.buildProfile(socialData, biometrics);
    const { text } = await callAnalyze({
      input: prompt,
      context: { ...userInputs, preferences, currentLocation },
      profile,
      max_tokens: 1500,
    });

    const analysis = this.parseRelocationResponse(text);
    return {
      ...analysis,
      suggestedLocations: this.generateLocationSuggestions(userInputs, preferences),
      lifestyle: this.determineLifestyle(userInputs),
      climatePreferences: this.determineClimatePreferences(userInputs, preferences),
    } as RelocationAnalysis;
  }

  async extractSocialInsights(socialContent: string): Promise<SocialProfile> {
    const prompt = `
      Analyze the following social media content and extract personality insights:
      
      Content: "${socialContent}"
      
      Please provide analysis in this JSON format:
      {
        "platforms": ["platform1", "platform2"],
        "personalityIndicators": ["trait1", "trait2", "trait3"],
        "values": ["value1", "value2", "value3"],
        "emotionalTone": 0.7,
        "communicationStyle": "description"
      }
      
      Focus on:
      - Communication patterns and language use
      - Values expressed through content choices
      - Emotional tone and sentiment
      - Social behavior indicators
      - Life priorities and interests
    `;

    const { text } = await callAnalyze({
      input: prompt,
      max_tokens: 800,
    });

    return this.parseSocialResponse(text);
  }

  // ===== Helpers (kept from your original) =====

  private buildProfile(socialData?: SocialProfile, biometrics?: BiometricData) {
    const profile: Record<string, any> = {};
    if (socialData) profile.social = socialData;
    if (biometrics) profile.biometrics = biometrics;
    return profile;
  }

  private buildIntelligentDecisionPrompt(
    decision: string,
    options: string[],
    userInputs: any,
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): string {
    return `
      As an expert life coach with deep understanding of psychology, neuroscience, and human behavior patterns, analyze this decision:
      
      Decision: "${decision}"
      Options:
      ${options.map((opt, i) => `${i + 1}. ${opt}`).join("\n")}
      
      User Profile:
      - Life Situation: ${userInputs?.lifeScenarios?.join(", ") || "Seeking clarity"}
      - Decision Style: ${userInputs?.decisionStyle || "Balanced approach"}
      - Life Vision: ${userInputs?.lifeVision || "Exploring possibilities"}
      - Focus Areas: ${userInputs?.focusAreas?.join(", ") || "General growth"}
      ${socialData ? `- Values: ${socialData.values.join(", ")}` : ""}
      ${biometrics ? `- Current Stress Level: ${biometrics.stressLevel}/10` : ""}
      
      Using advanced psychological principles (without naming specific frameworks), provide analysis with:
      1. Specific recommendation with reasoning
      2. Emotional drivers behind each option
      3. Neural pathway shifts needed
      4. Actionable next steps
      5. Confidence level (0-100%)
      
      Consider cognitive biases, habit loops, and long-term alignment with core values.
    `;
  }

  private buildIntelligentCareerPrompt(
    userInputs: any,
    currentSituation: string,
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): string {
    return `
      As a career alignment specialist with deep expertise in human psychology and professional fulfillment, analyze this career situation:
      
      Current Situation: "${currentSituation}"
      
      User Profile:
      - Life Context: ${userInputs?.lifeScenarios?.join(", ") || "Career exploration"}
      - Natural Approach: ${userInputs?.decisionStyle || "Thoughtful consideration"}
      - Life Vision: ${userInputs?.lifeVision || "Seeking fulfillment"}
      - Priority Areas: ${userInputs?.focusAreas?.join(", ") || "Career growth"}
      ${socialData ? `- Communication Style: ${socialData.communicationStyle}` : ""}
      ${biometrics ? `- Energy Patterns: HRV ${biometrics.hrv}, Sleep Quality ${biometrics.sleepQuality}/10` : ""}
      
      Provide comprehensive career guidance including:
      1. Ideal career paths aligned with personality
      2. Optimal work environments and cultures
      3. Skill development recommendations
      4. Neural rewiring strategies for career transition
      5. Confidence assessment
    `;
  }

  private buildIntelligentRelocationPrompt(
    userInputs: any,
    currentLocation: string,
    preferences: string[],
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): string {
    return `
      As a relocation specialist with expertise in lifestyle-personality alignment, analyze this relocation decision:
      
      Current Location: "${currentLocation}"
      Preferences: ${preferences.join(", ")}
      
      User Profile:
      - Life Context: ${userInputs?.lifeScenarios?.join(", ") || "Seeking change"}
      - Decision Approach: ${userInputs?.decisionStyle || "Careful consideration"}
      - Life Vision: ${userInputs?.lifeVision || "New possibilities"}
      - Important Areas: ${userInputs?.focusAreas?.join(", ") || "Lifestyle improvement"}
      ${socialData ? `- Values: ${socialData.values.join(", ")}` : ""}
      ${biometrics ? `- Sleep Quality: ${biometrics.sleepQuality}/10` : ""}
      
      Recommend locations considering:
      1. Personality–environment fit
      2. Social and cultural alignment
      3. Climate and lifestyle preferences
      4. Long-term life satisfaction factors
      5. Practical considerations
    `;
  }

  private parseDecisionResponse(text: string): Partial<DecisionAnalysis> {
    console.log("🤖 Raw Claude Response:", text);
    const lines = text.split("\n").filter((l) => l.trim());

    let recommendation = "Analysis complete";
    const recLine = lines.find((line) =>
      ["recommend", "suggest", "best option"].some((k) =>
        line.toLowerCase().includes(k)
      )
    );
    if (recLine) recommendation = recLine.replace(/^\d+\.?\s*/, "").trim();

    let reasoning = ["Comprehensive analysis provided"];
    const reasoningLines = lines.filter(
      (line) => line.match(/^\d+\./) || line.startsWith("- ") || line.startsWith("• ")
    );
    if (reasoningLines.length > 0) {
      reasoning = reasoningLines
        .map((line) => line.replace(/^[\d\-•\.]\s*/, "").trim())
        .slice(0, 5);
    }

    let nextSteps = ["Begin implementation"];
    const stepsSection = text.toLowerCase().indexOf("next steps");
    if (stepsSection !== -1) {
      const afterSteps = text.substring(stepsSection);
      const stepLines = afterSteps
        .split("\n")
        .filter((line) => line.match(/^\d+\./) || line.startsWith("- "))
        .map((line) => line.replace(/^[\d\-\.]\s*/, "").trim())
        .slice(0, 5);
      if (stepLines.length > 0) nextSteps = stepLines;
    }

    return {
      recommendation,
      reasoning,
      emotionalDrivers:
        this.extractListSection(text, "emotional") || ["Multiple factors considered"],
      neuralPathwayShift:
        this.extractSection(text, "neural") || "Gradual cognitive restructuring recommended",
      suggestedNextSteps: nextSteps,
      confidence: this.extractConfidence(text) || 85,
    };
  }

  private parseCareerResponse(text: string): Partial<CareerAnalysis> {
    return {
      recommendation: this.extractSection(text, "recommendation") || "Career path identified",
      reasoning: this.extractListSection(text, "reasoning") || ["Analysis complete"],
      emotionalDrivers: this.extractListSection(text, "emotional") || ["Career satisfaction factors"],
      neuralPathwayShift: this.extractSection(text, "neural") || "Professional identity development",
      suggestedNextSteps: this.extractListSection(text, "steps") || ["Begin career transition"],
      confidence: this.extractConfidence(text) || 80,
    };
  }

  private parseRelocationResponse(text: string): Partial<RelocationAnalysis> {
    return {
      recommendation: this.extractSection(text, "recommendation") || "Location analysis complete",
      reasoning: this.extractListSection(text, "reasoning") || ["Geographic analysis provided"],
      emotionalDrivers: this.extractListSection(text, "emotional") || ["Location satisfaction factors"],
      neuralPathwayShift: this.extractSection(text, "neural") || "Environmental adaptation strategies",
      suggestedNextSteps: this.extractListSection(text, "steps") || ["Research locations"],
      confidence: this.extractConfidence(text) || 75,
    };
  }

  private parseSocialResponse(text: string): SocialProfile {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("Failed to parse social response:", e);
    }
    return {
      platforms: ["general"],
      personalityIndicators: ["expressive", "analytical"],
      values: ["growth", "authenticity"],
      emotionalTone: 0.7,
      communicationStyle: "thoughtful and direct",
    };
  }

  private extractSection(text: string, section: string): string | null {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(section)) {
        return lines[i + 1]?.trim() || null;
      }
    }
    return null;
  }

  private extractListSection(text: string, section: string): string[] | null {
    const lines = text.split("\n");
    const result: string[] = [];
    let inSection = false;

    for (const line of lines) {
      if (line.toLowerCase().includes(section)) {
        inSection = true;
        continue;
      }
      if (inSection) {
        if (line.trim().startsWith("-") || line.trim().startsWith("•")) {
          result.push(line.trim().substring(1).trim());
        } else if (line.trim() === "") {
          break;
        }
      }
    }
    return result.length > 0 ? result : null;
  }

  private extractConfidence(text: string): number | null {
    const match = text.match(/confidence[:\s]*(\d+)/i);
    return match ? parseInt(match[1]) : null;
  }

  private categorizeDecision(decision: string): string {
    const categories: Record<string, string[]> = {
      career: ["job", "career", "work", "profession"],
      relationship: ["relationship", "marriage", "dating", "partner"],
      financial: ["money", "investment", "financial", "buy", "purchase"],
      health: ["health", "medical", "wellness", "fitness"],
      education: ["school", "education", "study", "learn"],
      location: ["move", "relocate", "location", "city", "country"],
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((k) => decision.toLowerCase().includes(k))) {
        return category;
      }
    }
    return "general";
  }

  private assessRisk(decision: string, userInputs: any): string {
    const decisionStyle = userInputs?.decisionStyle || "";
    const lifeScenarios = userInputs?.lifeScenarios || [];

    if (lifeScenarios.includes("unfulfilled") || decisionStyle.includes("analytical")) {
      return "Consider anxiety management strategies before major decisions";
    } else if (decisionStyle.includes("values-driven")) {
      return "Your careful nature suggests thorough planning will serve you well";
    } else {
      return "Balanced risk assessment - consider both opportunities and challenges";
    }
  }

  private generateCareerSuggestions(userInputs: any) {
    return [
      {
        title: "Data Scientist",
        description: "Analytical role combining statistics and technology",
        matchScore: 85,
        requiredSkills: ["Python", "Statistics", "Machine Learning"],
        averageSalary: "$95,000 - $140,000",
      },
      {
        title: "Product Manager",
        description: "Strategic role managing product development",
        matchScore: 78,
        requiredSkills: ["Strategy", "Communication", "Analytics"],
        averageSalary: "$110,000 - $160,000",
      },
    ];
  }

  private generateCompanySuggestions(userInputs: any) {
    return [
      {
        name: "Google",
        culture: "Innovation-focused, collaborative",
        matchScore: 82,
        location: "Multiple locations",
      },
      {
        name: "Patagonia",
        culture: "Values-driven, environmental focus",
        matchScore: 75,
        location: "Ventura, CA",
      },
    ];
  }

  private determineWorkEnvironment(userInputs: any): string {
    const decisionStyle = userInputs?.decisionStyle || "";
    const focusAreas = userInputs?.focusAreas || [];

    if (decisionStyle.includes("collaborative") || focusAreas.includes("relationships")) {
      return "Collaborative, open office environment with regular team interactions";
    } else if (decisionStyle.includes("analytical") || focusAreas.includes("creativity")) {
      return "Quiet, focused environment with minimal interruptions";
    } else {
      return "Balanced environment with both collaborative and independent work";
    }
  }

  private identifySkillGaps(userInputs: any, situation: string): string[] {
    return ["Leadership development", "Technical skills update", "Communication enhancement"];
  }

  private generateLocationSuggestions(userInputs: any, preferences: string[]) {
    return [
      {
        city: "Austin",
        country: "USA",
        matchScore: 88,
        costOfLiving: "Medium-High",
        climate: "Warm, sunny",
        culture: "Creative, tech-friendly",
      },
      {
        city: "Barcelona",
        country: "Spain",
        matchScore: 82,
        costOfLiving: "Medium",
        climate: "Mediterranean",
        culture: "Artistic, relaxed",
      },
    ];
  }

  private determineLifestyle(userInputs: any): string {
    const focusAreas = userInputs?.focusAreas || [];
    const lifeVision = userInputs?.lifeVision || "";

    if (focusAreas.includes("adventure") || lifeVision.includes("explore")) {
      return "Dynamic, culturally rich lifestyle with diverse experiences";
    } else {
      return "Stable, community-focused lifestyle with familiar routines";
    }
  }

  private determineClimatePreferences(userInputs: any, preferences: string[]): string {
    if (preferences.includes("warm") || preferences.includes("sunny")) {
      return "Warm, sunny climate preferred";
    } else if (preferences.includes("cool") || preferences.includes("temperate")) {
      return "Temperate, four-season climate preferred";
    } else {
      return "Climate flexibility based on other location factors";
    }
  }
}

export const api = new NorthFormAPI();
