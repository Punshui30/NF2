// src/pages/OnboardingChat.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";
import { profileStore, completeness, Profile } from "../services/profileStore";
import { analyze } from "../services/api";
import { CinematicButton } from "../components/ui/CinematicButton";
import { BreathingNorthStar } from "../components/BreathingNorthStar";
import { Sparkles, Send, CheckCircle2 } from "lucide-react";

type Msg = { role: "assistant" | "user"; text: string };

const seedAssistant =
  "I’m your NorthForm guide. Talk to me like you would a trusted friend. You can paste chats, describe goals, values, constraints—whatever paints an honest picture. I’ll ask for what I need and keep score as your North Star brightens.";

export default function OnboardingChat() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const base = profileStore.get();
  const [messages, setMessages] = useState<Msg[]>([{ role: "assistant", text: seedAssistant }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  // local working copy that we’ll merge back to store
  const [draft, setDraft] = useState<Profile>({
    name: base.name || "",
    email: base.email || "",
    lifeVision: base.lifeVision || "",
    goal90d: base.goal90d || "",
    goal12m: base.goal12m || "",
    horizon: base.horizon || "90d",
    values: base.values || [],
    antiValues: base.antiValues || [],
    decisionStyle: base.decisionStyle || "",
    nonNegs: base.nonNegs || [],
    constraints: base.constraints || [],
    conv: base.conv || { fam: "", frd: "", wrk: "" },
    tags: base.tags || { fam: [], frd: [], wrk: [] },
    links: base.links || { facebook: "", instagram: "", linkedin: "", x: "", personal: "" },
    patterns: base.patterns || {},
    biasNotes: base.biasNotes || "",
    consent: base.consent || { analyzeLinks: false, voice: false },
  });

  const pct = Math.round(completeness(draft) * 100);
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);

    try {
      // Call the same /api/analyze Netlify function, but in "coach" mode to extract profilePatch + reply.
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "coach",
          message: text,
          profile: draft,
        }),
      });

      if (!res.ok) throw new Error(`analyze ${res.status}`);

      const data = await res.json();
      if (data?.profilePatch && typeof data.profilePatch === "object") {
        setDraft((d) => ({ ...d, ...data.profilePatch }));
      }
      setMessages((m) => [...m, { role: "assistant", text: data?.reply || "Got it. Tell me more." }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Hmm, my analysis service hit a snag. Try again in a moment." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function finish() {
    profileStore.merge(draft);
    (window as any).__NF_PROFILE__ = draft; // debug
    dispatch({ type: "COMPLETE_ONBOARDING" });
    navigate("/dashboard");
  }

  const hintChips = [
    "Top 5 values that guide you",
    "A recent tough decision and why",
    "Non-negotiables in work or life",
    "What would ‘great’ look like in 90 days?",
    "Anything that drains your energy",
    "Paste a snippet from a recent chat",
  ];

  return (
    <div className="min-h-screen bg-[#0b1026] text-white">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-28">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <BreathingNorthStar completeness={pct / 100} />
            <div>
              <div className="text-xl sm:text-2xl font-bold">Conversational Onboarding</div>
              <div className="text-white/70 text-xs sm:text-sm">
                Share freely—I'll infer patterns and fill in the blanks for you.
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-white/80">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            {pct}% complete
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hintChips.map((c) => (
            <button
              key={c}
              onClick={() => setInput((v) => (v ? v + " " : "") + c)}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-full bg-white/10 border border-white/15 hover:bg-white/15 transition"
            >
              {c}
            </button>
          ))}
        </div>

        {/* Chat thread */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed ${
                  m.role === "assistant"
                    ? "bg-white/10 border border-white/15"
                    : "bg-gradient-to-r from-blue-500 to-fuchsia-500"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {busy && (
            <div className="text-white/70 text-sm">
              Analyzing… applying values, constraints, parts (IFS), goals, tone, and decision patterns…
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Composer */}
        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), send()) : null)}
            placeholder="Type or paste anything—values, goals, chats, constraints…"
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          <CinematicButton icon={Send} onClick={send} disabled={busy}>
            Send
          </CinematicButton>
        </div>

        {/* Finish */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <CinematicButton variant="aurora" icon={Sparkles} onClick={finish}>
            Continue to Dashboard
          </CinematicButton>
          <div className="text-white/70 text-xs sm:text-sm">Autosaves when you finish.</div>
        </div>
      </div>
    </div>
  );
}
