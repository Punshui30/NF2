import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuroraGalaxyBackground } from '../components/ui/AuroraGalaxyBackground';
import { CinematicButton } from '../components/ui/CinematicButton';
import { useApp } from '../contexts/AppContext';
import { 
  User, 
  Heart, 
  Compass,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Brain,
  Target,
  MapPin
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  component: React.ComponentType<any>;
}

const WelcomeStep: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-4xl font-bold text-white mb-4">Welcome to Your Journey</h3>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          I'm here to understand who you are at your core. This isn't a test—it's a conversation 
          that will help me guide you toward your most authentic path.
        </p>
      </div>
      
      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-white mb-3 text-lg font-medium">What should I call you?</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-white mb-3 text-lg font-medium">How can I reach you?</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            placeholder="your@email.com"
          />
        </div>
      </div>
    </div>
  );
};

const LifeScenarioStep: React.FC = () => {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);
  const [customDescription, setCustomDescription] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const scenarios = [
    {
      id: 'crossroads',
      title: 'Standing at a crossroads',
      description: 'Facing a major life decision that could change everything',
      emoji: '🛤️'
    },
    {
      id: 'unfulfilled',
      title: 'Feeling unfulfilled',
      description: 'Success on paper, but something essential is missing',
      emoji: '🌫️'
    },
    {
      id: 'transition',
      title: 'In transition',
      description: 'Between chapters, ready for the next adventure',
      emoji: '🦋'
    },
    {
      id: 'seeking',
      title: 'Seeking clarity',
      description: 'Know there\'s more, but not sure what or how',
      emoji: '🔍'
    },
    {
      id: 'growth',
      title: 'Ready to grow',
      description: 'Comfortable but craving meaningful challenge',
      emoji: '🌱'
    },
    {
      id: 'authentic',
      title: 'Wanting authenticity',
      description: 'Tired of living for others\' expectations',
      emoji: '✨'
    },
    {
      id: 'custom',
      title: 'Something else entirely',
      description: 'My situation is unique and deserves its own description',
      emoji: '💫'
    }
  ];

  const toggleScenario = (scenarioId: string) => {
    if (scenarioId === 'custom') {
      setShowCustomInput(!showCustomInput);
      if (!showCustomInput) {
        setSelectedScenarios(prev => 
          prev.includes('custom') ? prev : [...prev, 'custom']
        );
      } else {
        setSelectedScenarios(prev => prev.filter(id => id !== 'custom'));
        setCustomDescription('');
      }
      return;
    }
    
    setSelectedScenarios(prev => 
      prev.includes(scenarioId) 
        ? prev.filter(id => id !== scenarioId)
        : [...prev, scenarioId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-white mb-4">What brings you here?</h3>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Life has a way of calling us toward growth. Which of these resonates with where you are right now?
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {scenarios.map((scenario) => (
          <motion.div
            key={scenario.id}
            className={`
              p-6 rounded-2xl border cursor-pointer transition-all duration-300
              ${selectedScenarios.includes(scenario.id)
                ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/25' 
                : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
              }
            `}
            onClick={() => toggleScenario(scenario.id)}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{scenario.emoji}</div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">{scenario.title}</h4>
                <p className="text-gray-300 leading-relaxed">{scenario.description}</p>
              </div>
              {selectedScenarios.includes(scenario.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-blue-400"
                >
                  <CheckCircle className="w-6 h-6" />
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Custom Description Input */}
      <AnimatePresence>
        {showCustomInput && (
          <motion.div
            className="max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <label className="block text-white mb-4 text-lg font-medium">
                Tell me about your unique situation:
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg min-h-32 resize-none"
                placeholder="Describe what's happening in your life right now and what you're hoping to discover or change..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const DecisionStyleStep: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const decisionStyles = [
    {
      id: 'analytical',
      title: 'The Analyzer',
      description: 'I gather all the data, weigh pros and cons, and make logical choices',
      color: 'blue',
      pattern: 'methodical'
    },
    {
      id: 'intuitive',
      title: 'The Intuitive',
      description: 'I trust my gut feelings and inner wisdom to guide me',
      color: 'purple',
      pattern: 'instinctive'
    },
    {
      id: 'collaborative',
      title: 'The Collaborator',
      description: 'I seek input from trusted people and consider how choices affect others',
      color: 'green',
      pattern: 'relational'
    },
    {
      id: 'experimental',
      title: 'The Explorer',
      description: 'I try things out, learn from experience, and adapt as I go',
      color: 'orange',
      pattern: 'adaptive'
    },
    {
      id: 'values-driven',
      title: 'The Values-Driven',
      description: 'I choose based on what aligns with my deepest principles and beliefs',
      color: 'pink',
      pattern: 'principled'
    }
  ];

  const colorMap = {
    blue: 'from-blue-500/30 to-blue-600/30 border-blue-500',
    purple: 'from-purple-500/30 to-purple-600/30 border-purple-500',
    green: 'from-green-500/30 to-green-600/30 border-green-500',
    orange: 'from-orange-500/30 to-orange-600/30 border-orange-500',
    pink: 'from-pink-500/30 to-pink-600/30 border-pink-500'
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-white mb-4">How do you naturally make decisions?</h3>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          There's no right or wrong way. I'm curious about your natural approach when facing important choices.
        </p>
      </div>
      
      <div className="space-y-4 max-w-3xl mx-auto">
        {decisionStyles.map((style) => (
          <motion.div
            key={style.id}
            className={`
              p-6 rounded-2xl border cursor-pointer transition-all duration-300
              ${selectedStyle === style.id
                ? `bg-gradient-to-r ${colorMap[style.color as keyof typeof colorMap]} shadow-lg` 
                : 'bg-white/5 border-white/20 hover:bg-white/10'
              }
            `}
            onClick={() => setSelectedStyle(style.id)}
            whileHover={{ scale: 1.02, x: 10 }}
            whileTap={{ scale: 0.98 }}
            layout
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-2">{style.title}</h4>
                <p className="text-gray-300 leading-relaxed">{style.description}</p>
              </div>
              <div className={`
                w-6 h-6 rounded-full border-2 transition-all duration-300
                ${selectedStyle === style.id ? 'bg-white border-white' : 'border-white/40'}
              `}>
                {selectedStyle === style.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LifeVisionStep: React.FC = () => {
  const [visionText, setVisionText] = useState('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);

  const areas = [
    { id: 'career', label: 'Career & Purpose', icon: '🎯' },
    { id: 'relationships', label: 'Relationships', icon: '💝' },
    { id: 'health', label: 'Health & Vitality', icon: '🌟' },
    { id: 'creativity', label: 'Creativity & Expression', icon: '🎨' },
    { id: 'adventure', label: 'Adventure & Growth', icon: '🗺️' },
    { id: 'contribution', label: 'Impact & Legacy', icon: '🌍' },
    { id: 'freedom', label: 'Freedom & Flexibility', icon: '🦅' },
    { id: 'security', label: 'Security & Stability', icon: '🏡' }
  ];

  const toggleArea = (areaId: string) => {
    setFocusAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-white mb-4">What does your ideal life look like?</h3>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Imagine you're living exactly as you want to be. What does that feel like? What matters most?
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <label className="block text-white mb-4 text-lg font-medium">
            Describe your vision (even if it feels unclear right now):
          </label>
          <textarea
            value={visionText}
            onChange={(e) => setVisionText(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg min-h-32 resize-none"
            placeholder="When I imagine my ideal life, I see myself..."
          />
        </div>
        
        <div>
          <label className="block text-white mb-6 text-lg font-medium">
            Which areas feel most important to focus on right now?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {areas.map((area) => (
              <motion.button
                key={area.id}
                className={`
                  p-4 rounded-xl border transition-all duration-300 text-center
                  ${focusAreas.includes(area.id)
                    ? 'bg-purple-500/20 border-purple-500 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }
                `}
                onClick={() => toggleArea(area.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-2xl mb-2">{area.icon}</div>
                <div className="text-white text-sm font-medium">{area.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [milestoneProgress, setMilestoneProgress] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      subtitle: 'Let\'s begin your journey',
      icon: Sparkles,
      component: WelcomeStep
    },
    {
      id: 'scenario',
      title: 'Your Story',
      subtitle: 'Understanding where you are',
      icon: Heart,
      component: LifeScenarioStep
    },
    {
      id: 'decision-style',
      title: 'Your Approach',
      subtitle: 'How you naturally navigate choices',
      icon: Brain,
      component: DecisionStyleStep
    },
    {
      id: 'vision',
      title: 'Your Vision',
      subtitle: 'What you\'re moving toward',
      icon: Target,
      component: LifeVisionStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setMilestoneProgress((currentStep + 1) * 25);
    } else {
      // Complete onboarding
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      setMilestoneProgress(100);
      setTimeout(() => navigate('/dashboard'), 1000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setMilestoneProgress(currentStep * 25);
    }
  };

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  const handleMilestoneComplete = () => {
    console.log('Onboarding milestone completed!');
  };

  return (
    <AuroraGalaxyBackground 
      className="min-h-screen" 
      intensity="medium"
      milestoneProgress={milestoneProgress}
      onMilestoneComplete={handleMilestoneComplete}
      enableSpatialAudio={true}
      audioMode="onboarding"
    >
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-5xl w-full">
          {/* Progress Constellation */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div 
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                      ${index <= currentStep 
                        ? 'bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 text-white shadow-2xl' 
                        : 'bg-white/10 text-gray-400 border border-white/20'
                      }
                    `}
                    whileHover={{ scale: 1.1 }}
                    animate={{
                      scale: index === currentStep ? [1, 1.1, 1] : 1,
                      boxShadow: index === currentStep 
                        ? '0 0 30px rgba(168, 85, 247, 0.6)' 
                        : '0 0 0px rgba(168, 85, 247, 0)'
                    }}
                    transition={{ 
                      scale: { duration: 2, repeat: Infinity },
                      boxShadow: { duration: 0.5 }
                    }}
                  >
                    <step.icon className="w-8 h-8" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div 
                      className={`
                        w-20 h-1 mx-4 rounded-full transition-all duration-500
                        ${index < currentStep 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' 
                          : 'bg-white/20'
                        }
                      `}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: index < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: index < currentStep ? 0.3 : 0 }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-lg">
                {currentStepData.subtitle}
              </p>
            </div>
          </motion.div>

          {/* Step Content */}
          <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 mb-12 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <StepComponent />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="flex justify-between items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <CinematicButton
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              icon={ArrowLeft}
              size="lg"
            >
              Previous
            </CinematicButton>

            <div className="flex items-center gap-3">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`
                    h-2 rounded-full transition-all duration-500
                    ${index === currentStep ? 'bg-blue-500 w-12' : 'bg-white/30 w-2'}
                  `}
                  animate={{
                    backgroundColor: index <= currentStep ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)'
                  }}
                />
              ))}
            </div>

            <CinematicButton
              onClick={handleNext}
              icon={currentStep === steps.length - 1 ? Compass : ArrowRight}
              size="lg"
              variant="aurora"
            >
              {currentStep === steps.length - 1 ? 'Begin Journey' : 'Continue'}
            </CinematicButton>
          </motion.div>
        </div>
      </div>
    </AuroraGalaxyBackground>
  );
};
