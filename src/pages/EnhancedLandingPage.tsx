// src/pages/EnhancedLandingPage.tsx
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AuroraGalaxyBackground } from "../components/ui/AuroraGalaxyBackground";
import { CinematicButton } from "../components/ui/CinematicButton";
import { Compass, Brain, MapPin, Users, Activity, Sparkles, Play, ArrowDown } from "lucide-react";

export const EnhancedLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [milestoneProgress, setMilestoneProgress] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => setMilestoneProgress((prev) => (prev + 25) % 100), 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Compass, title: "Decision Compass", description: "Navigate life's most complex choices with AI-powered psychological analysis and neural pathway optimization", color: "blue" },
    { icon: Brain, title: "Career Navigator", description: "Discover your ideal career path through deep personality mapping and global opportunity analysis", color: "purple" },
    { icon: MapPin, title: "Relocation Planner", description: "Find your perfect place in the world using lifestyle preferences and biometric compatibility", color: "green" },
    { icon: Users, title: "Social Insight Engine", description: "Understand your authentic self through advanced social content personality analysis", color: "pink" },
    { icon: Activity, title: "Biometric Emotional Guide", description: "Real-time emotional calibration using wearable data for optimal decision timing", color: "yellow" },
    { icon: Sparkles, title: "Neural Pathway Transformation", description: "Rewire cognitive patterns for lasting change through neuroscience-based interventions", color: "blue" },
  ];

  return (
    <AuroraGalaxyBackground
      className="min-h-screen"
      intensity="high"
      milestoneProgress={milestoneProgress}
      onMilestoneComplete={() => {}}
      enableSpatialAudio={false}  // sounds off for now
      audioMode="landing"
    >
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="absolute top-0 left-0 right-0 z-20 p-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400 }}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                NorthForm
              </span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              <motion.a href="#features" className="text-white/80 hover:text-white transition-colors text-lg font-medium" whileHover={{ scale: 1.1, color: "#60a5fa" }}>
                Features
              </motion.a>
              <motion.a href="#experience" className="text-white/80 hover:text-white transition-colors text-lg font-medium" whileHover={{ scale: 1.1, color: "#a855f7" }}>
                Experience
              </motion.a>
              <CinematicButton variant="ghost" onClick={() => navigate("/login")}>Sign In</CinematicButton>
            </nav>
          </div>
        </motion.header>

        {/* Hero */}
        <motion.section className="min-h-screen flex items-center justify-center px-6" style={{ y: heroY, opacity: heroOpacity }}>
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8, type: "spring", stiffness: 100 }}
            >
              <div className="mb-8">
                <motion.h1 className="text-6xl md:text-8xl font-light text-white mb-4 leading-tight tracking-wide">
                  Navigate Your
                </motion.h1>
                <motion.div
                  className="text-6xl md:text-8xl font-extralight leading-tight tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 1 }}
                >
                  <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300 bg-clip-text text-transparent">True North</span>
                </motion.div>
              </div>

              <motion.p
                className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
              >
                An intelligent life alignment platform that understands you deeply and guides your most important decisions with unprecedented clarity and wisdom.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-8 justify-center items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
              >
                <CinematicButton
                  size="xl"
                  variant="aurora"
                  onClick={() => navigate("/onboarding")}
                  className="w-full sm:w-auto shadow-2xl px-12 py-4"
                  icon={Compass}
                >
                  Begin Journey
                </CinematicButton>

                <CinematicButton
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-auto px-12 py-4"
                  icon={Play}
                  onClick={() => setShowDemo(true)}
                >
                  See How It Works
                </CinematicButton>
              </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="absolute bottom-12 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
            >
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center text-white/60">
                <span className="text-sm mb-2 font-medium">Discover More</span>
                <ArrowDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
              <h2 className="text-5xl md:text-6xl font-light text-white mb-8 tracking-wide">
                Intelligent <span className="bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent font-extralight"> Guidance</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                Advanced intelligence that understands your unique patterns and guides you toward decisions aligned with your deepest values and aspirations.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 100, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100 }}
                  viewport={{ once: true }}
                  className="perspective-1000"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-80 hover:bg-white/10 transition-all duration-500 transform-gpu hover:scale-105 hover:rotate-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mb-8 shadow-2xl">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-6">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-lg">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="py-32 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
              <h2 className="text-4xl md:text-5xl font-light text-white mb-8 tracking-wide">
                Ready to discover your <span className="bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent font-extralight"> true path?</span>
              </h2>
              <p className="text-lg text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
                Experience a new level of clarity and confidence in your most important life decisions through intelligent, personalized guidance.
              </p>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <CinematicButton size="xl" variant="aurora" onClick={() => navigate("/onboarding")} className="text-xl px-14 py-6 shadow-2xl" icon={Sparkles}>
                  Begin Your Journey
                </CinematicButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Demo Modal */}
        {showDemo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowDemo(false)}
          >
            <motion.div
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-3xl font-bold text-white mb-6">Experience NorthForm</h3>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Watch how NorthForm combines psychology, AI, and biometric data to provide unprecedented clarity for your life's most important decisions.
              </p>
              <div className="flex gap-4">
                <CinematicButton variant="aurora" onClick={() => { setShowDemo(false); navigate("/onboarding"); }}>
                  Try It Now
                </CinematicButton>
                <CinematicButton variant="ghost" onClick={() => setShowDemo(false)}>
                  Close
                </CinematicButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AuroraGalaxyBackground>
  );
};
