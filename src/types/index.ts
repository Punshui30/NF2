export interface UserProfile {
  id: string;
  email: string;
  name: string;
  psychometrics?: PsychometricProfile;
  socialData?: SocialProfile;
  biometricData?: BiometricData;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface PsychometricProfile {
  enneagram?: {
    type: number;
    wing?: string;
    description: string;
  };
  bigFive?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  strengthsFinder?: string[];
  ifs?: {
    parts: IFSPart[];
    selfEnergy: number;
  };
}

export interface IFSPart {
  type: 'manager' | 'firefighter' | 'exile';
  name: string;
  description: string;
  intensity: number;
}

export interface SocialProfile {
  platforms: string[];
  personalityIndicators: string[];
  values: string[];
  emotionalTone: number;
  communicationStyle: string;
}

export interface BiometricData {
  stressLevel: number;
  hrv: number;
  sleepQuality: number;
  timestamp: Date;
}

export interface UserPreferences {
  notifications: boolean;
  dataSharing: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface AnalysisResult {
  recommendation: string;
  reasoning: string[];
  emotionalDrivers: string[];
  neuralPathwayShift: string;
  suggestedNextSteps: string[];
  confidence: number;
}

export interface DecisionAnalysis extends AnalysisResult {
  decisionType: string;
  options: string[];
  riskAssessment: string;
}

export interface CareerAnalysis extends AnalysisResult {
  suggestedCareers: Career[];
  companies: Company[];
  workEnvironment: string;
  skillGaps: string[];
}

export interface Career {
  title: string;
  description: string;
  matchScore: number;
  requiredSkills: string[];
  averageSalary: string;
}

export interface Company {
  name: string;
  culture: string;
  matchScore: number;
  location: string;
}

export interface RelocationAnalysis extends AnalysisResult {
  suggestedLocations: Location[];
  lifestyle: string;
  climatePreferences: string;
}

export interface Location {
  city: string;
  country: string;
  matchScore: number;
  costOfLiving: string;
  climate: string;
  culture: string;
}