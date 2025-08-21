// src/services/profileStore.ts

export type Conversations = { fam?: string; frd?: string; wrk?: string };
export type Links = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  x?: string;
  personal?: string;
};

export type Patterns = Record<string, number>; // 1..5

export type Profile = {
  name?: string;
  email?: string;

  lifeVision?: string;
  values?: string[];
  antiValues?: string[];

  nonNegs?: string[];       // non-negotiables
  constraints?: string[];   // constraints/limits

  horizon?: "7d" | "30d" | "90d" | "12m" | "3y";
  goal90d?: string;
  goal12m?: string;

  decisionStyle?: string;

  conv?: Conversations;
  tags?: { fam: string[]; frd: string[]; wrk: string[] };

  links?: Links;

  patterns?: Patterns;      // sliders 1..5
  biasNotes?: string;       // freeform
  consent?: {
    voice?: boolean;
    analyzeLinks?: boolean; // just stored flag
  };
};

const KEY = "nf:profile";

function safeGet(): Profile {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Profile) : {};
  } catch {
    return {};
  }
}

function safeSet(p: Profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {}
}

export const profileStore = {
  get(): Profile {
    return safeGet();
  },
  set(p: Profile) {
    safeSet(p);
  },
  merge(patch: Partial<Profile>) {
    const curr = safeGet();
    const next: Profile = {
      ...curr,
      ...patch,
      conv: { ...(curr.conv || {}), ...(patch.conv || {}) },
      tags: {
        fam: curr.tags?.fam || [],
        frd: curr.tags?.frd || [],
        wrk: curr.tags?.wrk || [],
        ...(patch.tags || {}),
      },
      links: { ...(curr.links || {}), ...(patch.links || {}) },
      patterns: { ...(curr.patterns || {}), ...(patch.patterns || {}) },
      consent: { ...(curr.consent || {}), ...(patch.consent || {}) },
    };
    safeSet(next);
    return next;
  },
};

export function completeness(p: Profile): number {
  // Target ~1.0 total
  let score = 0;

  // Identity basics
  if (p.name) score += 0.05;
  if (p.email) score += 0.05;

  // Conversations (strong signal)
  const convLen =
    (p.conv?.fam?.length || 0) + (p.conv?.frd?.length || 0) + (p.conv?.wrk?.length || 0);
  if (convLen >= 60) score += 0.12;
  if (convLen >= 120) score += 0.10; // total 0.22 for rich convs

  // Values & anti-values
  if (p.values && p.values.length >= 3) score += 0.12;
  if (p.antiValues && p.antiValues.length >= 2) score += 0.06;

  // Non-negotiables & constraints
  if (p.nonNegs && p.nonNegs.length >= 2) score += 0.08;
  if (p.constraints && p.constraints.length >= 2) score += 0.06;

  // Vision & goals
  if (p.lifeVision && p.lifeVision.trim().length >= 60) score += 0.12;
  if (p.goal90d && p.goal90d.trim().length >= 20) score += 0.05;
  if (p.goal12m && p.goal12m.trim().length >= 20) score += 0.05;

  // Patterns sliders
  const pattCount = Object.keys(p.patterns || {}).length;
  if (pattCount >= 4) score += 0.08;
  if (pattCount >= 8) score += 0.05;

  // Links (optional)
  const linkCount = Object.values(p.links || {}).filter(Boolean).length;
  if (linkCount >= 1) score += 0.02;
  if (p.consent?.analyzeLinks) score += 0.02;

  return Math.max(0, Math.min(1, score));
}
