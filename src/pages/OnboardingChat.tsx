import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, CheckCircle2, Mic, Square, Wand2 } from "lucide-react";
import { CinematicButton } from "../components/ui/CinematicButton";
import BreathingNorthStar from "../components/BreathingNorthStar";
import { analyze } from "../services/api";
import { profileStore } from "../services/profileStore";
import { useApp } from "../contexts/AppContext";

type Msg = { role: "user" | "assistant" | "system"; content: string };

/** Quick heuristics to decide the next purposeful question */
function nextSmartQuestion(history: Msg[]): string {
  const txt = history.map((m) => m.content).join("\n").toLowerCase();

  const hasValues = /(top|core)\s*values|value:|integrity|curiosity|freedom|family|faith|growth|service/.test(txt);
  const has90d   = /(90|ninety)[-\s]?day|quarter|in the next 3 months|by (oct|nov|dec|jan|feb|mar|apr|may|jun|jul|aug|sep)/.test(txt);
  const hasConstraints = /budget|time|visa|health|schedule|non[-\s]?negotiable|constraint|deadline/.test(txt);
  const hasConv = /friend|family|work|boss|client|team|partner|texted|messaged|argued|celebrated/.test(txt);
  const droppedLink = /(http|facebook|instagram|linkedin|x\.com|twitter|personal site|portfolio)/.test(txt);
  const mentionedBias = /bias|avoid|perfection|overthink|sunk[-\s]?cost|status[-\s]?quo|conflict/.test(txt);

  if (!hasValues)      return "If someone who knows you well named three values they see in you, what would they say?";
  if (!has90d)        return "What would make the next 90 days feel like a clear win for you?";
  if (!hasConstraints) return "Any non-negotiables or constraints I should respect (budget, time, location, health)?";
  if (!hasConv)       return "Paste a short recent exchange (family, friend, or work). I’ll look for decision patterns.";
  if (!droppedLink)   return "Optional: drop a public link (LinkedIn, personal site). I’ll use it only to refine your profile.";
  if (!mentionedBias) return "When decisions go sideways for you, what recurring pattern or bias tends to be involved?";

  return "Is there a decision on your mind right now? I can run a first pass with what I’ve learned so far.";
}

export default function OnboardingChat() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "I can lead with smart questions—or you can start however you like. If you want, just tell me what’s on your mind and I’ll adapt. If not, I’ll kick us off:",
    },
    { role: "assistant", content: "What would make the next 90 days feel like a clear win for you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --- mic support via Web Speech API (typed as any to satisfy CI) ---
  const recRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.continuous = false;
      rec.onresult = (e: any) => {
        const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
        setInput((prev) => (prev ? prev + " " : "") + t);
      };
      rec.onerror = () => setRecording(false);
      rec.onend = () => setRecording(false);
      recRef.current = rec;
    }
  }, []);

  const startStopMic = () => {
    if (!recRef.current) return;
    if (recording) {
      recRef.current.stop();
      setRecording(false);
    } else {
      setRecording(true);
      try {
        recRef.current.start();
      } catch {
        setRecording(false);
      }
    }
  };
  // --- end mic ---

  const completeness = useMemo(() => {
    const txt = messages.map((m) => m.content).join("\n").toLowerCase();
    let score = 0;
    if (/value|important|i care/.test(txt)) score += 0.25;
    if (/(90|30|7)\s*day|focus|goal|week|month|year/.test(txt)) score += 0.25;
    if (/http|facebook|instagram|linkedin|x\.com|twitter/.test(txt)) score += 0.1;
    if (/friend|family|work|colleague|boss|team|client/.test(txt)) score += 0.25;
    if (txt.length > 800) score += 0.15;
    return Math.min(1, score);
  }, [messages]);

  async function turn(userText: string) {
    if (!userText.trim()) return;
    const next = [...messages, { role: "user", content: userText } as Msg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const result = await analyze(next);
      const reply: Msg = { role: "assistant", content: result.reply ?? "Noted. Tell me a bit more." };

      // Persist any stitched profile data
      if (result.profileFragment) profileStore.merge(result.profileFragment);

      // Compose: model reply + our purposeful next question
      const followUp = nextSmartQuestion([...next, reply]);
      const augmented = [...next, reply, { role: "assistant", content: followUp } as Msg];

      setMessages(augmented);

      if (result.readyForDashboard) {
        dispatch({ type: "COMPLETE_ONBOARDING" });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I hit a snag analyzing that. Try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Top */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <BreathingNorthStar completeness={completeness} />
            <div>
              <div className="text-xl font-semibold tracking-tight">Conversational Onboarding</div>
              <div className="text-gray-300 text-sm">I’ll learn your patterns quickly and keep momentum.</div>
            </div>
          </div>

          {completeness >= 0.75 && (
            <CinematicButton
              variant="secondary"
              icon={CheckCircle2}
              onClick={() => {
                dispatch({ type: "COMPLETE_ONBOARDING" });
                navigate("/dashboard");
              }}
            >
              Finish
            </CinematicButton>
          )}
        </div>

        {/* Lead or follow pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <button
            onClick={() => turn("You lead with smart questions.")}
            className="text-xs px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-smooth flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5" /> You lead the questions
          </button>
          <button
            onClick={() => setInput("I want to start by talking about…")}
            className="text-xs px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition-smooth"
          >
            I’ll start, then you follow
          </button>
        </div>

        {/* Chat window */}
        <div className="glass rounded-2xl p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed tracking-tight ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-blue-500/25 to-fuchsia-500/25 border border-white/10"
                    : "bg-white/[.035] border border-white/10"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Thinking…
            </div>
          )}
        </div>

        {/* Input row */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={startStopMic}
            className={`rounded-xl border px-3 py-2 flex items-center gap-2 transition-smooth ${
              recording ? "border-red-400/60 bg-red-400/10" : "border-white/15 bg-white/5 hover:bg-white/10"
            }`}
            title={recording ? "Stop" : "Speak"}
          >
            {recording ? <Square className="w-4 h-4 text-red-300" /> : <Mic className="w-4 h-4 text-white/80" />}
            <span className="text-sm">{recording ? "Listening…" : "Speak"}</span>
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && turn(input)}
            placeholder="Tell me a value, a 90-day win, paste a short chat, or drop a public link…"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 outline-none focus:ring-2 focus:ring-blue-500/40 placeholder:text-gray-400"
          />

          <CinematicButton className="btn-shimmer" icon={Send} onClick={() => turn(input)}>
            Send
          </CinematicButton>
        </div>

        {/* Helper chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Top 3 values are…",
            "My 90-day focus is…",
            "Here’s a short chat with a friend:",
            "Bias to watch: I avoid conflict…",
          ].map((c) => (
            <button
              key={c}
              onClick={() => turn(c)}
              className="text-xs px-3 py-1.5 rounded-full border border-white/12 bg-white/5 hover:bg-white/10 transition-smooth"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
