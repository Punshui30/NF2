import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuroraGalaxyBackground } from "../components/ui/AuroraGalaxyBackground";
import { CinematicButton } from "../components/ui/CinematicButton";
import { Compass, Play } from "lucide-react";

export default function EnhancedLandingPage() {
  const navigate = useNavigate();

  return (
    <AuroraGalaxyBackground className="min-h-screen">
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white/90">NorthForm</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <CinematicButton variant="ghost" onClick={() => navigate("/onboarding")}>
                Get Started
              </CinematicButton>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="min-h-[80vh] md:min-h-[86vh] flex items-center justify-center px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.h1
              className="text-5xl md:text-7xl font-light text-white leading-tight tracking-wide"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Navigate Your{" "}
              <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                True North
              </span>
            </motion.h1>

            <motion.p
              className="mt-6 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              One supercharged Decision Compass that learns you deeply and guides the choices that matter.
            </motion.p>

            <motion.div
              className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              <CinematicButton
                size="xl"
                variant="aurora"
                icon={Compass}
                className="px-10 py-4"
                onClick={() => navigate("/onboarding")}
              >
                Begin Journey
              </CinematicButton>

              <CinematicButton
                size="xl"
                variant="secondary"
                icon={Play}
                className="px-10 py-4"
                onClick={() => navigate("/tools/decision-compass")}
              >
                Try Decision Compass
              </CinematicButton>
            </motion.div>

            {/* subtle glow dot */}
            <div className="mt-16 mx-auto w-24 h-24 rounded-full border border-white/10 bg-white/5 blur-2xl" />
          </div>
        </section>

        {/* No tiles / grids — simplified per new product focus */}
      </div>
    </AuroraGalaxyBackground>
  );
}
