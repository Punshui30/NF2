// src/pages/DecisionCompassPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuroraGalaxyBackground } from "../components/ui/AuroraGalaxyBackground";
import { CinematicButton } from "../components/ui/CinematicButton";
import { useApp } from "../contexts/AppContext";
import { api } from "../services/api";
import { Compass, ArrowLeft, Plus, X, Brain, Lightbulb, Target, TrendingUp } from "lucide-react";

export const DecisionCompassPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input");

  const [decision, setDecision] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [context, setContext] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => options.length < 5 && setOptions([...options, ""]);
  const removeOption = (i: number) => options.length > 2 && setOptions(options.filter((_, idx) => idx !== i));
  const updateOption = (i: number, v: string) => setOptions((arr) => arr.map((x, idx) => (idx === i ? v : x)));

  async function handleAnalyze() {
    if (!decision.trim()) return setError("Please describe your decision");
    const valid = options.filter((o) => o.trim());
    if (valid.length < 2) return setError("Please provide at least 2 options");

    setError(null);
    setStep("analyzing");

    try {
      const userInputs = {
        lifeScenarios: ["seeking-clarity"],
        decisionStyle: "analytical",
        lifeVision: context || "Exploring possibilities",
        focusAreas: ["decision-making"],
      };
      const result = await api.analyzeDecision(decision, valid, userInputs);
      setAnalysis(result);
      setStep("results");
      dispatch({ type: "ADD_TO_HISTORY", payload: result });
    } catch (e) {
      setError("Failed to analyze decision. Check serverless function / key.");
      setStep("input");
    }
  }

  function handleStartOver() {
    setStep("input");
    setDecision("");
    setOptions(["", ""]);
    setContext("");
    setAnalysis(null);
    setError(null);
  }

  return (
    <AuroraGalaxyBackground className="min-h-screen" intensity="medium">
      <div className="relative z-10">
        <motion.header
          className="p-4 sm:p-6 border-b border-white/10 backdrop-blur-xl bg-white/5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-3 sm:gap-4">
            <CinematicButton variant="ghost" icon={ArrowLeft} onClick={() => navigate("/dashboard")}>
              Back
            </CinematicButton>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Decision Compass</h1>
                <p className="text-gray-300 text-sm hidden sm:block">Navigate your most important choices</p>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {step === "input" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8">
                <div className="text-center mb-4 sm:mb-12">
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">What decision are you facing?</h2>
                  <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
                    Describe your situation and options. I’ll analyze it using psychology and AI.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5 sm:space-y-6">
                  <div>
                    <label className="block text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Describe your decision</label>
                    <textarea
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      placeholder="e.g., Accept a job offer in another city…"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Your options</label>
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div key={index} className="flex gap-2 sm:gap-3">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${index + 1}`}
                          />
                          {options.length > 2 && (
                            <CinematicButton variant="ghost" size="sm" icon={X} onClick={() => removeOption(index)} />
                          )}
                        </div>
                      ))}
                    </div>
                    {options.length < 5 && (
                      <CinematicButton variant="ghost" icon={Plus} onClick={addOption} className="mt-3">
                        Add Option
                      </CinematicButton>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Additional context (optional)</label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Constraints, what matters most, timing…"
                    />
                  </div>

                  {error && (
                    <div className="p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">{error}</div>
                  )}

                  <div className="flex justify-center pt-2 sm:pt-4">
                    <CinematicButton variant="aurora" size="lg" icon={Brain} onClick={handleAnalyze}>
                      Analyze My Decision
                    </CinematicButton>
                  </div>
                </div>
              </motion.div>
            )}

            {step === "analyzing" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 sm:py-20">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Brain className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Analyzing Your Decision…</h2>
                <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto">
                  Using advanced AI and psychological principles to provide personalized insights
                </p>
              </motion.div>
            )}

            {step === "results" && analysis && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 sm:space-y-8">
                <div className="text-center mb-4 sm:mb-12">
                  <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Your Decision Analysis</h2>
                  <div className="flex items-center justify-center gap-2 text-base sm:text-lg text-gray-300">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Confidence: {analysis.confidence}%
                  </div>
                </div>

                <div className="grid gap-5 sm:gap-8">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Recommendation</h3>
                    </div>
                    <p className="text-base sm:text-lg text-gray-200 leading-relaxed">{analysis.recommendation}</p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Key Insights</h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {analysis.reasoning.map((reason: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-gray-200 text-sm sm:text-base">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <Compass className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                      <h3 className="text-xl sm:text-2xl font-bold text-white">Next Steps</h3>
                    </div>
                    <ul className="space-y-2 sm:space-y-3">
                      {analysis.suggestedNextSteps.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 sm:gap-3 text-gray-200 text-sm sm:text-base">
                          <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-400 text-xs sm:text-sm font-bold">{i + 1}</span>
                          </div>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-4">
                  <CinematicButton variant="secondary" onClick={handleStartOver} className="w-full sm:w-auto">
                    Analyze Another Decision
                  </CinematicButton>
                  <CinematicButton variant="ghost" icon={ArrowLeft} onClick={() => navigate("/dashboard")} className="w-full sm:w-auto">
                    Back to Dashboard
                  </CinematicButton>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </AuroraGalaxyBackground>
  );
};
