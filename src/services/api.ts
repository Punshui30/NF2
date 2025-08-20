import Anthropic from '@anthropic-ai/sdk';
import { 
  DecisionAnalysis, 
  CareerAnalysis, 
  RelocationAnalysis, 
  PsychometricProfile,
  SocialProfile,
  BiometricData 
} from '../types';

// Debug environment variables
console.log('🔍 Environment Debug:');
console.log('- import.meta.env.VITE_ANTHROPIC_API_KEY:', import.meta.env.VITE_ANTHROPIC_API_KEY ? 'EXISTS' : 'MISSING');
console.log('- All VITE_ vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// Initialize Anthropic Claude
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
console.log('🔑 API Key status:', apiKey ? `Found (${apiKey.length} chars)` : 'NOT FOUND');

const anthropic = new Anthropic({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

if (!apiKey) {
  console.error('❌ VITE_ANTHROPIC_API_KEY is not set in environment variables');
  console.error('❌ Make sure your .env file has: VITE_ANTHROPIC_API_KEY=your_key_here');
}

class NorthFormAPI {
  async analyzeDecision(
    decision: string,
    options: string[],
    userInputs: any,
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): Promise<DecisionAnalysis> {
    const prompt = this.buildIntelligentDecisionPrompt(decision, options, userInputs, socialData, biometrics);
    
    try {
      const completion = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        temperature: 0.7,
        system: 'You are an expert life coach with deep understanding of psychology, neuroscience, and human behavior patterns.',
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      
      const text = completion.content[0]?.text || '';
      const analysis = this.parseDecisionResponse(text);
      return {
        ...analysis,
        decisionType: this.categorizeDecision(decision),
        options,
        riskAssessment: this.assessRisk(decision, userInputs)
      };
    } catch (error) {
      console.error('Decision analysis error:', error);
      throw new Error('Failed to analyze decision');
    }
  }

  async analyzeCareer(
    userInputs: any,
    currentSituation: string,
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): Promise<CareerAnalysis> {
    const prompt = this.buildIntelligentCareerPrompt(userInputs, currentSituation, socialData, biometrics);
    
    try {
      const completion = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        temperature: 0.7,
        system: 'You are a career alignment specialist with deep expertise in human psychology and professional fulfillment.',
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      
      const text = completion.content[0]?.text || '';
      const analysis = this.parseCareerResponse(text);
      return {
        ...analysis,
        suggestedCareers: this.generateCareerSuggestions(userInputs),
        companies: this.generateCompanySuggestions(userInputs),
        workEnvironment: this.determineWorkEnvironment(userInputs),
        skillGaps: this.identifySkillGaps(userInputs, currentSituation)
      };
    } catch (error) {
      console.error('Career analysis error:', error);
      throw new Error('Failed to analyze career path');
    }
  }

  async analyzeRelocation(
    userInputs: any,
    currentLocation: string,
    preferences: string[],
    socialData?: SocialProfile,
    biometrics?: BiometricData
  ): Promise<RelocationAnalysis> {
    const prompt = this.buildIntelligentRelocationPrompt(userInputs, currentLocation, preferences, socialData, biometrics);
    
    try {
      const completion = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        temperature: 0.7,
        system: 'You are a relocation specialist with expertise in lifestyle-personality alignment.',
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      
      const text = completion.content[0]?.text || '';
      const analysis = this.parseRelocationResponse(text);
      return {
        ...analysis,
        suggestedLocations: this.generateLocationSuggestions(userInputs, preferences),
        lifestyle: this.determineLifestyle(userInputs),
        climatePreferences: this.determineClimatePreferences(userInputs, preferences)
      };
    } catch (error) {
      console.error('Relocation analysis error:', error);
      throw new Error('Failed to analyze relocation options');
    }
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

    try {
      const completion = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 800,
        temperature: 0.5,
        system: 'You are an expert in social psychology and digital behavior analysis.',
        messages: [
          { role: 'user', content: prompt }
        ]
      });
      
      const text = completion.content[0]?.text || '';
      return this.parseSocialResponse(text);
    } catch (error) {
      console.error('Social analysis error:', error);
      throw new Error('Failed to analyze social content');
    }
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
      Options: ${options.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}
      
      User Profile:
      - Life Situation: ${userInputs.lifeScenarios?.join(', ') || 'Seeking clarity'}
      - Decision Style: ${userInputs.decisionStyle || 'Balanced approach'}
      - Life Vision: ${userInputs.lifeVision || 'Exploring possibilities'}
      - Focus Areas: ${userInputs.focusAreas?.join(', ') || 'General growth'}
      ${socialData ? `- Values: ${socialData.values.join(', ')}` : ''}
      ${biometrics ? `- Current Stress Level: ${biometrics.stressLevel}/10` : ''}
      
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
      - Life Context: ${userInputs.lifeScenarios?.join(', ') || 'Career exploration'}
      - Natural Approach: ${userInputs.decisionStyle || 'Thoughtful consideration'}
      - Life Vision: ${userInputs.lifeVision || 'Seeking fulfillment'}
      - Priority Areas: ${userInputs.focusAreas?.join(', ') || 'Career growth'}
      ${socialData ? `- Communication Style: ${socialData.communicationStyle}` : ''}
      ${biometrics ? `- Energy Patterns: HRV ${biometrics.hrv}, Sleep Quality ${biometrics.sleepQuality}/10` : ''}
      
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
      Preferences: ${preferences.join(', ')}
      
      User Profile:
      - Life Context: ${userInputs.lifeScenarios?.join(', ') || 'Seeking change'}
      - Decision Approach: ${userInputs.decisionStyle || 'Careful consideration'}
      - Life Vision: ${userInputs.lifeVision || 'New possibilities'}
      - Important Areas: ${userInputs.focusAreas?.join(', ') || 'Lifestyle improvement'}
      ${socialData ? `- Values: ${socialData.values.join(', ')}` : ''}
      ${biometrics ? `- Sleep Quality: ${biometrics.sleepQuality}/10` : ''}
      
      Recommend locations considering:
      1. Personality-environment fit
      2. Social and cultural alignment
      3. Climate and lifestyle preferences
      4. Long-term life satisfaction factors
      5. Practical considerations
    `;
  }

  private parseDecisionResponse(text: string): Partial<DecisionAnalysis> {
    console.log('🤖 Raw Claude Response:', text);
    
    // Try to extract structured information from Claude's response
    const lines = text.split('\n').filter(line => line.trim());
    
    // Extract recommendation (usually in first few lines)
    let recommendation = 'Analysis complete';
    const recLine = lines.find(line => 
      line.toLowerCase().includes('recommend') || 
      line.toLowerCase().includes('suggest') ||
      line.toLowerCase().includes('best option')
    );
    if (recLine) {
      recommendation = recLine.replace(/^\d+\.?\s*/, '').trim();
    }
    
    // Extract reasoning points
    let reasoning = ['Comprehensive analysis provided'];
    const reasoningLines = lines.filter(line => 
      line.match(/^\d+\./) || 
      line.startsWith('- ') || 
      line.startsWith('• ')
    );
    if (reasoningLines.length > 0) {
      reasoning = reasoningLines.map(line => 
        line.replace(/^[\d\-•\.]\s*/, '').trim()
      ).slice(0, 5);
    }
    
    // Extract next steps
    let nextSteps = ['Begin implementation'];
    const stepsSection = text.toLowerCase().indexOf('next steps');
    if (stepsSection !== -1) {
      const afterSteps = text.substring(stepsSection);
      const stepLines = afterSteps.split('\n')
        .filter(line => line.match(/^\d+\./) || line.startsWith('- '))
        .map(line => line.replace(/^[\d\-\.]\s*/, '').trim())
        .slice(0, 5);
      if (stepLines.length > 0) {
        nextSteps = stepLines;
      }
    }
    
    return {
      recommendation,
      reasoning,
      emotionalDrivers: this.extractListSection(text, 'emotional') || ['Multiple factors considered'],
      neuralPathwayShift: this.extractSection(text, 'neural') || 'Gradual cognitive restructuring recommended',
      suggestedNextSteps: nextSteps,
      confidence: this.extractConfidence(text) || 85
    };
  }

  private parseCareerResponse(text: string): Partial<CareerAnalysis> {
    return {
      recommendation: this.extractSection(text, 'recommendation') || 'Career path identified',
      reasoning: this.extractListSection(text, 'reasoning') || ['Analysis complete'],
      emotionalDrivers: this.extractListSection(text, 'emotional') || ['Career satisfaction factors'],
      neuralPathwayShift: this.extractSection(text, 'neural') || 'Professional identity development',
      suggestedNextSteps: this.extractListSection(text, 'steps') || ['Begin career transition'],
      confidence: this.extractConfidence(text) || 80
    };
  }

  private parseRelocationResponse(text: string): Partial<RelocationAnalysis> {
    return {
      recommendation: this.extractSection(text, 'recommendation') || 'Location analysis complete',
      reasoning: this.extractListSection(text, 'reasoning') || ['Geographic analysis provided'],
      emotionalDrivers: this.extractListSection(text, 'emotional') || ['Location satisfaction factors'],
      neuralPathwayShift: this.extractSection(text, 'neural') || 'Environmental adaptation strategies',
      suggestedNextSteps: this.extractListSection(text, 'steps') || ['Research locations'],
      confidence: this.extractConfidence(text) || 75
    };
  }

  private parseSocialResponse(text: string): SocialProfile {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse social response:', error);
    }
    
    // Fallback response
    return {
      platforms: ['general'],
      personalityIndicators: ['expressive', 'analytical'],
      values: ['growth', 'authenticity'],
      emotionalTone: 0.7,
      communicationStyle: 'thoughtful and direct'
    };
  }

  private extractSection(text: string, section: string): string | null {
    const lines = text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].toLowerCase().includes(section)) {
        return lines[i + 1]?.trim() || null;
      }
    }
    return null;
  }

  private extractListSection(text: string, section: string): string[] | null {
    const lines = text.split('\n');
    const result: string[] = [];
    let inSection = false;
    
    for (const line of lines) {
      if (line.toLowerCase().includes(section)) {
        inSection = true;
        continue;
      }
      if (inSection) {
        if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
          result.push(line.trim().substring(1).trim());
        } else if (line.trim() === '') {
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
    const categories = {
      career: ['job', 'career', 'work', 'profession'],
      relationship: ['relationship', 'marriage', 'dating', 'partner'],
      financial: ['money', 'investment', 'financial', 'buy', 'purchase'],
      health: ['health', 'medical', 'wellness', 'fitness'],
      education: ['school', 'education', 'study', 'learn'],
      location: ['move', 'relocate', 'location', 'city', 'country']
    };

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => decision.toLowerCase().includes(keyword))) {
        return category;
      }
    }
    
    return 'general';
  }

  private assessRisk(decision: string, userInputs: any): string {
    const decisionStyle = userInputs.decisionStyle || '';
    const lifeScenarios = userInputs.lifeScenarios || [];
    
    if (lifeScenarios.includes('unfulfilled') || decisionStyle.includes('analytical')) {
      return 'Consider anxiety management strategies before major decisions';
    } else if (decisionStyle.includes('values-driven')) {
      return 'Your careful nature suggests thorough planning will serve you well';
    } else {
      return 'Balanced risk assessment - consider both opportunities and challenges';
    }
  }

  private generateCareerSuggestions(userInputs: any) {
    // Generate career suggestions based on personality
    return [
      {
        title: 'Data Scientist',
        description: 'Analytical role combining statistics and technology',
        matchScore: 85,
        requiredSkills: ['Python', 'Statistics', 'Machine Learning'],
        averageSalary: '$95,000 - $140,000'
      },
      {
        title: 'Product Manager',
        description: 'Strategic role managing product development',
        matchScore: 78,
        requiredSkills: ['Strategy', 'Communication', 'Analytics'],
        averageSalary: '$110,000 - $160,000'
      }
    ];
  }

  private generateCompanySuggestions(userInputs: any) {
    return [
      {
        name: 'Google',
        culture: 'Innovation-focused, collaborative',
        matchScore: 82,
        location: 'Multiple locations'
      },
      {
        name: 'Patagonia',
        culture: 'Values-driven, environmental focus',
        matchScore: 75,
        location: 'Ventura, CA'
      }
    ];
  }

  private determineWorkEnvironment(userInputs: any): string {
    const decisionStyle = userInputs.decisionStyle || '';
    const focusAreas = userInputs.focusAreas || [];
    
    if (decisionStyle.includes('collaborative') || focusAreas.includes('relationships')) {
      return 'Collaborative, open office environment with regular team interactions';
    } else if (decisionStyle.includes('analytical') || focusAreas.includes('creativity')) {
      return 'Quiet, focused environment with minimal interruptions';
    } else {
      return 'Balanced environment with both collaborative and independent work';
    }
  }

  private identifySkillGaps(userInputs: any, situation: string): string[] {
    // Analyze current situation and identify skill gaps
    return ['Leadership development', 'Technical skills update', 'Communication enhancement'];
  }

  private generateLocationSuggestions(userInputs: any, preferences: string[]) {
    return [
      {
        city: 'Austin',
        country: 'USA',
        matchScore: 88,
        costOfLiving: 'Medium-High',
        climate: 'Warm, sunny',
        culture: 'Creative, tech-friendly'
      },
      {
        city: 'Barcelona',
        country: 'Spain',
        matchScore: 82,
        costOfLiving: 'Medium',
        climate: 'Mediterranean',
        culture: 'Artistic, relaxed'
      }
    ];
  }

  private determineLifestyle(userInputs: any): string {
    const focusAreas = userInputs.focusAreas || [];
    const lifeVision = userInputs.lifeVision || '';
    
    if (focusAreas.includes('adventure') || lifeVision.includes('explore')) {
      return 'Dynamic, culturally rich lifestyle with diverse experiences';
    } else {
      return 'Stable, community-focused lifestyle with familiar routines';
    }
  }

  private determineClimatePreferences(userInputs: any, preferences: string[]): string {
    if (preferences.includes('warm') || preferences.includes('sunny')) {
      return 'Warm, sunny climate preferred';
    } else if (preferences.includes('cool') || preferences.includes('temperate')) {
      return 'Temperate, four-season climate preferred';
    } else {
      return 'Climate flexibility based on other location factors';
    }
  }
}

export const api = new NorthFormAPI();