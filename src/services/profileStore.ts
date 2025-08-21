export type Profile = {
  name?: string;
  email?: string;
  lifeVision?: string;
  goal90d?: string;
  goal12m?: string;
  horizon?: "7d" | "30d" | "90d" | "12m" | "3y";
  values?: string[];
  antiValues?: string[];
  decisionStyle?: string;
  nonNegs?: string[];
  constraints?: string[];
  conv?: { fam?: string; frd?: string; wrk?: string };
  tags?: { fam: string[]; frd: string[]; wrk: string[] };
  links?: { facebook?: string; instagram?: string; linkedin?: string; x?: string; personal?: string };
  patterns?: Record<string, number>;
  biasNotes?: string;
  consent?: { analyzeLinks?: boolean; voice?: boolean };
};

const KEY = "northform.profile.v1";

export const profileStore = {
  get(): Profile {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      return {};
    }
  },
  set(p: Profile) {
    localStorage.setItem(KEY, JSON.stringify(p));
  },
  merge(p: Partial<Profile>) {
    const cur = profileStore.get();
    profileStore.set({ ...cur, ...p });
  },
};

export function completeness(p: Profile): number {
  let score = 0, total = 6;
  if ((p.conv?.fam || "").length + (p.conv?.frd || "").length + (p.conv?.wrk || "").length >= 120) score++;
  if ((p.values || []).length >= 3) score++;
  if ((p.nonNegs || []).length >= 2) score++;
  if (p.patterns && Object.values(p.patterns).filter(v => v > 0).length >= 6) score++;
  if (p.links && Object.values(p.links).some(Boolean)) score++;
  if ((p.lifeVision || "").length >= 60) score++;
  return score / total;
}
