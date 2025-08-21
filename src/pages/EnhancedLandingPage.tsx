import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CinematicButton } from "../components/ui/CinematicButton";
import StarField from "../components/StarField";
import { Compass, Sparkles } from "lucide-react";

export default function EnhancedLandingPage() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.1]);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0b1026] overflow-hidden text-white">
      {/* subtle glitter */}
      <StarField density={180} />
      {/* soft radial glow behind the mark */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.20),transparent_60%)]" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <Compass className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              NorthForm
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => navigate("/onboarding")}
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        className="min-h-screen relative z-10 flex items-center justify-center px-6"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0 }}
          >
            <div className="mb-10">
              <h1 className="text-6xl md:text-8xl font-extralight tracking-wide leading-[1.05]">
                Your <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">North Star</span>,
                clarified.
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-3xl mx-auto leading-relaxed font-light">
                One supercharged Decision Compass that learns you deeply and guides the choices that matter.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <CinematicButton
                size="xl"
                variant="aurora"
                onClick={() => navigate("/onboarding")}
                className="px-12 py-4 shadow-2xl"
                icon={Compass}
              >
                Begin Journey
              </CinematicButton>
              <CinematicButton
                variant="secondary"
                size="xl"
                className="px-12 py-4"
                icon={Sparkles}
                onClick={() => navigate("/tools/decision-compass")}
              >
                Try Decision Compass
              </CinematicButton>
            </div>

            {/* breathing north-star glyph */}
            <motion.div
              className="mx-auto mt-16 w-24 h-24 rounded-full border border-white/30"
              animate={{ boxShadow: pulse ? "0 0 60px rgba(168,85,247,0.35)" : "0 0 10px rgba(168,85,247,0.2)" }}
              transition={{ duration: 1.1 }}
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Simple “how it works” (no tiles) */}
      <section className="relative z-10 px-6 pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light">What happens inside</h2>
          <p className="text-gray-300 mt-4">
            Conversational onboarding extracts values, constraints, and patterns. The Decision Compass blends
            heuristics (pros/cons, regret tests), IFS-style parts checks, and bias guards to recommend next moves.
          </p>
        </div>
      </section>
    </div>
  );
}
