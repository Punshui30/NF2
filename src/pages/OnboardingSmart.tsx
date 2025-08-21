// src/pages/OnboardingSmart.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import ConstellationProgress, { ConstellationStep } from "../components/ConstellationProgress";
import BreathingNorthStar from "../components/BreathingNorthStar";
import ChatCard from "../components/ChatCard";
import VoiceInputButton from "../components/VoiceInputButton";
import ShareToPhone from "../components/ShareToPhone";
import { profileStore, completeness, Profile } from "../services/profileStore";

const MIN_VISION_LEN = 60;

const defaultPatterns: { id: string; label: string }[] = [
  { id: "riskTolerance", label: "I take calculated risks" },
  { id: "closureNeed", label: "I need decisions to feel 'final'" },
  { id: "avoidance", label: "I delay decisions I fear regretting" },
  { id: "seekingNovelty", label: "I seek novel experiences" },
  { id: "socialWeight", label: "Others' opinions weigh heavily" },
  { id: "valuesAdherence", label: "I stick to my values under pressure" },
  { id: "shortTermPull", label: "I chase short-term wins over long games" },
  { id: "conflictTolerance", label: "I can tolerate healthy conflict" },
];

function csvToList(s: string, max = 10) {
  return s.split(/[,|\n]/g).map(x => x.trim()).filter(Boolean).slice(0, max);
}

export default function OnboardingSmart() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const base = profileStore.get();

  // Basics
  const [name, setName] = useState(base.name || "");
  const [email, setEmail] = useState(base.email || "");

  // Vision & goals
  const [lifeVision, setLifeVision] = useState(base.lifeVision || "");
  const [goal90d, setGoal90d] = useState(base.goal90d || "");
  const [goal12m, setGoal12m] = useState(base.goal12m || "");
  const [horizon, setHorizon] = useState<Profile["horizon"]>(base.horizon || "90d");

  // Values / anti-values
  const [valuesRaw, setValuesRaw] = useState((base.values || []).join(", "));
  const [antiValuesRaw, setAntiValuesRaw] = useState((base.antiValues || []).join(", "));
  const values = useMemo(() => csvToList(valuesRaw, 8), [valuesRaw]);
  const antiValues = useMemo(() => csvToList(antiValuesRaw, 8), [antiValuesRaw]);

  // Decision style
  const [decisionStyle, setDecisionStyle] = useState(base.decisionStyle || "");

  // Non-negotiables / constraints
  const [nonNegsRaw, setNonNegsRaw] = useState((base.nonNegs || []).join(", "));
  const [constraintsRaw, setConstraintsRaw] = useState((base.constraints || []).join(", "));
  const nonNegs = useMemo(() => csvToList(nonNegsRaw, 8), [nonNegsRaw]);
  const constraints = useMemo(() => csvToList(constraintsRaw, 8), [constraintsRaw]);

  // Conversations + tags
  const [fam, setFam] = useState(base.conv?.fam || "");
  const [frd, setFrd] = useState(base.conv?.frd || "");
  const [wrk, setWrk] = useState(base.conv?.wrk || "");
  const [tags, setTags] = useState<{ fam: string[]; frd: string[]; wrk: string[] }>(
    base.tags || { fam: [], frd: [], wrk: [] }
  );

  // Links + consent
  const [links, setLinks] = useState({
    facebook: base.links?.facebook || "",
    instagram: base.links?.instagram || "",
    linkedin: base.links?.linkedin || "",
    x: base.links?.x || "",
    personal: base.links?.personal || "",
  });
  const [analyzeLinks, setAnalyzeLinks] = useState(!!base.consent?.analyzeLinks);
  const [voiceConsent, setVoiceConsent] = useState(!!base.consent?.voice);

  // Patterns
  const [patterns, setPatterns] = useState<Record<string, number>>({
    ...defaultPatterns.reduce((acc, p) => ({ ...acc, [p.id]: base.patterns?.[p.id] || 0 }), {}),
  });

  const [biasNotes, setBiasNotes] = useState(base.biasNotes || "");

  const profile = useMemo(
    () => ({
      name,
      email,
      lifeVision,
      goal90d,
      goal12m,
      horizon,
      values,
      antiValues,
      decisionStyle,
      nonNegs,
      constraints,
      conv: { fam, frd, wrk },
      tags,
      links,
      patterns,
      biasNotes,
      consent: { analyzeLinks, voice: voiceConsent },
    }),
    [
      name, email, lifeVision, goal90d, goal12m, horizon,
      values, antiValues, decisionStyle, nonNegs, constraints,
      fam, frd, wrk, tags, links, patterns, biasNotes,
      analyzeLinks, voiceConsent,
    ]
  );

  const pct = Math.round(completeness(profile) * 100);

  const steps: ConstellationStep[] = [
    { id: "conv", label: "Conversations", done: (fam + frd + wrk).length >= 120, active: true },
    { id: "values", label: "Values", done: values.length >= 3 },
    { id: "nonneg", label: "Non-negotiables", done: nonNegs.length >= 2 },
    { id: "patterns", label: "Patterns", done: Object.values(patterns).filter(v => v > 0).length >= 6 },
    { id: "links", label: "Links", done: Object.values(links).some(Boolean) },
    { id: "vision", label: "Vision", done: lifeVision.length >= MIN_VISION_LEN },
  ];

  function setLink(key: keyof typeof links, v: string) {
    setLinks(prev => ({ ...prev, [key]: v }));
  }

  function saveAndGo() {
    profileStore.merge(profile);
    (window as any).__NF_PROFILE__ = profile; // for debugging only
    dispatch({ type: "COMPLETE_ONBOARDING" });
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0b1026] text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-[88px] sm:pb-10">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <BreathingNorthStar completeness={pct / 100} />
            <div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">Let’s tune your NorthForm</div>
              <div className="text-white/70 text-xs sm:text-sm">Speak or paste. I’ll learn your patterns fast.</div>
            </div>
          </div>
          <div className="hidden sm:block">
            <ShareToPhone />
          </div>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-5 sm:gap-6">
          {/* LEFT column (2/3) */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Basics */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-base sm:text-lg font-semibold">Basics</div>
                <VoiceInputButton label="Speak vision" onAppend={(t) => setLifeVision(v => (v ? v + " " : "") + t)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com"
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-white/80 mb-1">90-day focus</div>
                  <textarea rows={3} value={goal90d} onChange={(e) => setGoal90d(e.target.value)}
                    placeholder="What success looks like in the next 90 days…"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
                <div>
                  <div className="text-sm text-white/80 mb-1">12-month direction</div>
                  <textarea rows={3} value={goal12m} onChange={(e) => setGoal12m(e.target.value)}
                    placeholder="Where you want to be a year from now…"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-white/80 mb-1">Time horizon</div>
                  <select value={horizon} onChange={(e) => setHorizon(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40">
                    <option value="7d">7 days</option><option value="30d">30 days</option>
                    <option value="90d">90 days</option><option value="12m">12 months</option><option value="3y">3 years</option>
                  </select>
                </div>
                <div>
                  <div className="text-sm text-white/80 mb-1">Decision style</div>
                  <select value={decisionStyle} onChange={(e) => setDecisionStyle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40">
                    <option value="">Choose…</option>
                    <option value="analyzer">Analyzer</option>
                    <option value="intuitive">Intuitive</option>
                    <option value="collaborator">Collaborator</option>
                    <option value="explorer">Explorer</option>
                    <option value="values-driven">Values-driven</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-white/80 mb-1">Life vision (freeform)</div>
                <textarea rows={3} value={lifeVision} onChange={(e) => setLifeVision(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Describe your ideal trajectory in your own words…" />
                <div className="text-xs text-white/60 mt-1">{Math.min(lifeVision.length, MIN_VISION_LEN)} / {MIN_VISION_LEN} characters</div>
              </div>
            </section>

            {/* Conversations */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-1">
                <div className="text-base sm:text-lg font-semibold">Recent conversations</div>
                <div className="text-[11px] sm:text-xs text-white/60">Paste or speak; 3–8 lines each.</div>
              </div>
              <div className="text-[11px] sm:text-xs text-white/60 mb-3">
                Family • Friend • Work/Collab. Remove names if you want—I'll focus on tone and choices.
              </div>
              <div className="grid gap-3">
                <ChatCard title="Family" text={fam} setText={setFam} tags={tags.fam} setTags={(v) => setTags({ ...tags, fam: v })} />
                <ChatCard title="Friend" text={frd} setText={setFrd} tags={tags.frd} setTags={(v) => setTags({ ...tags, frd: v })} />
                <ChatCard title="Work/Collab" text={wrk} setText={setWrk} tags={tags.wrk} setTags={(v) => setTags({ ...tags, wrk: v })} />
              </div>
            </section>

            {/* Values & anti-values */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="text-base sm:text-lg font-semibold mb-2">Values & anti-values</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-white/80 mb-1">Top values (comma-separated)</div>
                  <div className="flex items-center gap-2">
                    <input value={valuesRaw} onChange={(e) => setValuesRaw(e.target.value)} placeholder="Integrity, curiosity, freedom…"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                    <VoiceInputButton label="Speak" onAppend={(t) => setValuesRaw(prev => (prev ? prev + ", " : "") + t.replace(/\s+/g, " "))} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/80 mb-1">Anti-values (comma-separated)</div>
                  <div className="flex items-center gap-2">
                    <input value={antiValuesRaw} onChange={(e) => setAntiValuesRaw(e.target.value)} placeholder="Dishonesty, stagnation…"
                      className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                    <VoiceInputButton label="Speak" onAppend={(t) => setAntiValuesRaw(prev => (prev ? prev + ", " : "") + t.replace(/\s+/g, " "))} />
                  </div>
                </div>
              </div>
            </section>

            {/* Non-negotiables & constraints */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="text-base sm:text-lg font-semibold mb-2">Non-negotiables & constraints</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-white/80 mb-1">Non-negotiables (comma-separated)</div>
                  <input value={nonNegsRaw} onChange={(e) => setNonNegsRaw(e.target.value)} placeholder="Family time, honesty, health…"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
                <div>
                  <div className="text-sm text-white/80 mb-1">Constraints (comma-separated)</div>
                  <input value={constraintsRaw} onChange={(e) => setConstraintsRaw(e.target.value)} placeholder="Budget, time, visa…"
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
                </div>
              </div>
            </section>

            {/* Patterns sliders */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="text-base sm:text-lg font-semibold mb-3">Decision patterns</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {defaultPatterns.map((p) => (
                  <div key={p.id} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-sm text-white/85 mb-2">{p.label}</div>
                    <input type="range" min={0} max={5} step={1} value={patterns[p.id] || 0}
                      onChange={(e) => setPatterns(prev => ({ ...prev, [p.id]: parseInt(e.target.value, 10) }))} className="w-full" />
                    <div className="text-xs text-white/60 mt-1">{patterns[p.id] || 0} / 5</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Bias notes */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="text-base sm:text-lg font-semibold">Bias notes (optional)</div>
                <VoiceInputButton label="Speak" onAppend={(t) => setBiasNotes(v => (v ? v + " " : "") + t)} />
              </div>
              <textarea rows={3} value={biasNotes} onChange={(e) => setBiasNotes(e.target.value)}
                placeholder="Anything that might skew decisions (fear of conflict, sunk-cost, status-quo bias)…"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40" />
            </section>

            {/* Desktop CTA */}
            <div className="hidden sm:flex gap-3">
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow transition hover:brightness-110" onClick={saveAndGo}>
                Continue to Dashboard
              </button>
              <div className="text-sm text-white/60 self-center">Autosaves as you type.</div>
            </div>
          </div>

          {/* RIGHT column (1/3) */}
          <div className="space-y-4">
            <ConstellationProgress steps={steps} percent={pct} className="h-64 sm:h-80 md:h-[460px]" />

            {/* Links & consent */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="text-base sm:text-lg font-semibold mb-2">Links (optional)</div>
              <div className="space-y-2">
                <input placeholder="Facebook URL" value={links.facebook} onChange={(e) => setLink("facebook", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none" />
                <input placeholder="Instagram URL" value={links.instagram} onChange={(e) => setLink("instagram", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none" />
                <input placeholder="LinkedIn URL" value={links.linkedin} onChange={(e) => setLink("linkedin", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none" />
                <input placeholder="X / Twitter URL" value={links.x} onChange={(e) => setLink("x", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none" />
                <input placeholder="Personal site URL" value={links.personal} onChange={(e) => setLink("personal", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 outline-none" />
              </div>

              <div className="mt-3 space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={analyzeLinks} onChange={(e) => setAnalyzeLinks(e.target.checked)} />
                  Allow link analysis (optional)
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={voiceConsent} onChange={(e) => setVoiceConsent(e.target.checked)} />
                  Allow voice analysis for tone (optional)
                </label>
              </div>
            </section>

            <div className="text-center text-white/75 text-sm sm:text-base">
              Your North Star brightens as I learn. You control what you share.
            </div>

            {/* Mobile QR helper */}
            <div className="sm:hidden"><ShareToPhone /></div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[#0b1026]/95 border-t border-white/10 px-4 py-3"
           style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white font-semibold shadow" onClick={saveAndGo}>
          Continue to Dashboard
        </button>
      </div>
    </div>
  );
}
