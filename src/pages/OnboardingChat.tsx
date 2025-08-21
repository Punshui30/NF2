import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Send, CheckCircle2, Mic, Square } from "lucide-react";
import { CinematicButton } from "../components/ui/CinematicButton";
import BreathingNorthStar from "../components/BreathingNorthStar"; // default import (also exported as named)
import { analyze } from "../services/api";
import { profileStore } from "../services/profileStore";
import { useApp } from "../contexts/AppContext";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export default function OnboardingChat() {
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Welcome. I’ll learn your patterns through a brief conversation. Share anything you like—recent chats, top values, a 90-day focus—and I’ll stitch it together. Ready?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // --- mic support via Web Speech API (typed as any to satisfy TS in CI) ---
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
      setMessages((prev) => [...prev, reply]);

      if (result.profileFragment) {
        profileStore.merge(result.profileFragment);
      }

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
    <div className="min-h-screen bg-[#0b1026] text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Top */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BreathingNorthStar completeness={completeness} />
            <div>
              <div className="text-xl font-semibold">Conversational Onboarding</div>
              <div className="text-white/70 text-sm">Speak or type. I’ll learn your patterns fast.</div>
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

        {/* Chat window */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-blue-500/30 to-fuchsia-500/30 border border-white/15"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Thinking…
            </div>
          )}
        </div>

        {/* Input row */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={startStopMic}
            className={`rounded-xl border px-3 py-2 flex items-center gap-2 ${
              recording ? "border-red-400/60 bg-red-400/10" : "border-white/20 bg-white/5"
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
            placeholder="Tell me a value, a goal, or paste a few recent messages…"
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none focus:ring-2 focus:ring-blue-500/40"
          />

          <CinematicButton icon={Send} onClick={() => turn(input)}>
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
              className="text-xs px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
