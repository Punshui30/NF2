import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { Button } from '../components/ui/Button';
import { Compass, Brain, MapPin, Users, Activity, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Compass,
      title: "Decision Compass",
      description: "Navigate life's most important choices with AI-powered clarity"
    },
    {
      icon: Brain,
      title: "Career Navigator",
      description: "Discover your ideal career path aligned with your true nature"
    },
    {
      icon: MapPin,
      title: "Relocation Planner",
      description: "Find your perfect place in the world based on deep analysis"
    },
    {
      icon: Users,
      title: "Social Insights",
      description: "Understand yourself through your digital footprint"
    },
    {
      icon: Activity,
      title: "Biometric Awareness",
      description: "Real-time emotional guidance powered by your wearables"
    },
    {
      icon: Sparkles,
      title: "Neural Pathway Shift",
      description: "Transform cognitive patterns for lasting change"
    }
  ];

  return (
    <AuroraBackground className="min-h-screen" intensity="high">
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="absolute top-0 left-0 right-0 z-20 p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">NorthForm</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </nav>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
                Navigate Your
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {" "}True North
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Revolutionary AI-powered life alignment platform that guides you through major decisions, 
                career transitions, and personal transformation with the precision of Aurora Borealis.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/onboarding')}
                  className="w-full sm:w-auto"
                >
                  Begin Your Journey
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold text-white mb-6">
                Intelligent Life Navigation
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Combining neuroscience, psychology, and AI to deliver insights that transform how you make decisions and live your life.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center mb-6">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Find Your True North?
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                Join the revolution in intelligent life navigation. Transform your decision-making with AI-powered insights.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/onboarding')}
                className="text-xl px-12 py-4"
              >
                Start Your Transformation
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </AuroraBackground>
  );
};