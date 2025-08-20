import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuroraGalaxyBackground } from '../components/ui/AuroraGalaxyBackground';
import { CinematicButton } from '../components/ui/CinematicButton';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { 
  Compass, 
  ArrowLeft, 
  Plus, 
  X, 
  Brain,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';

export const DecisionCompassPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [step, setStep] = useState<'input' | 'analyzing' | 'results'>('input');
  
  // Form state
  const [decision, setDecision] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [context, setContext] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAnalyze = async () => {
    if (!decision.trim()) {
      setError('Please describe your decision');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setError(null);
    setStep('analyzing');

    try {
      const userInputs = {
        lifeScenarios: ['seeking-clarity'], // Default for now
        decisionStyle: 'analytical', // Default for now
        lifeVision: context || 'Exploring possibilities',
        focusAreas: ['decision-making']
      };

      const result = await api.analyzeDecision(
        decision,
        validOptions,
        userInputs
      );

      setAnalysis(result);
      setStep('results');
      
      // Add to history
      dispatch({ type: 'ADD_TO_HISTORY', payload: result });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Failed to analyze decision. Please check your Anthropic API key in the .env file.');
      setStep('input');
    }
  };

  const handleStartOver = () => {
    setStep('input');
    setDecision('');
    setOptions(['', '']);
    setContext('');
    setAnalysis(null);
    setError(null);
  };

  return (
    <AuroraGalaxyBackground className="min-h-screen" intensity="medium">
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="p-6 border-b border-white/10 backdrop-blur-xl bg-white/5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <CinematicButton
              variant="ghost"
              icon={ArrowLeft}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </CinematicButton>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Decision Compass</h1>
                <p className="text-gray-300">Navigate your most important choices</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            {step === 'input' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    What decision are you facing?
                  </h2>
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Describe your situation and the options you're considering. 
                    I'll analyze it using psychology and AI to provide personalized guidance.
                  </p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6">
                  {/* Decision Description */}
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">
                      Describe your decision
                    </label>
                    <textarea
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={4}
                      placeholder="e.g., I'm considering whether to accept a job offer in another city..."
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">
                      Your options
                    </label>
                    <div className="space-y-3">
                      {options.map((option, index) => (
                        <div key={index} className="flex gap-3">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="flex-1 p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Option ${index + 1}`}
                          />
                          {options.length > 2 && (
                            <CinematicButton
                              variant="ghost"
                              size="sm"
                              icon={X}
                              onClick={() => removeOption(index)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {options.length < 5 && (
                      <CinematicButton
                        variant="ghost"
                        icon={Plus}
                        onClick={addOption}
                        className="mt-3"
                      >
                        Add Option
                      </CinematicButton>
                    )}
                  </div>

                  {/* Additional Context */}
                  <div>
                    <label className="block text-white text-lg font-semibold mb-3">
                      Additional context (optional)
                    </label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                      placeholder="Any additional details about your situation, constraints, or what matters most to you..."
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-center pt-4">
                    <CinematicButton
                      variant="aurora"
                      size="lg"
                      icon={Brain}
                      onClick={handleAnalyze}
                    >
                      Analyze My Decision
                    </CinematicButton>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'analyzing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-12 h-12 text-white" />
                  </motion.div>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Analyzing Your Decision...
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                  Using advanced AI and psychological principles to provide personalized insights
                </p>
              </motion.div>
            )}

            {step === 'results' && analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Your Decision Analysis
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-lg text-gray-300">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Confidence: {analysis.confidence}%
                  </div>
                </div>

                <div className="grid gap-8">
                  {/* Recommendation */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Target className="w-8 h-8 text-blue-400" />
                      <h3 className="text-2xl font-bold text-white">Recommendation</h3>
                    </div>
                    <p className="text-lg text-gray-200 leading-relaxed">
                      {analysis.recommendation}
                    </p>
                  </div>

                  {/* Reasoning */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Lightbulb className="w-8 h-8 text-yellow-400" />
                      <h3 className="text-2xl font-bold text-white">Key Insights</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysis.reasoning.map((reason: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-gray-200">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Compass className="w-8 h-8 text-green-400" />
                      <h3 className="text-2xl font-bold text-white">Next Steps</h3>
                    </div>
                    <ul className="space-y-3">
                      {analysis.suggestedNextSteps.map((step: string, index: number) => (
                        <li key={index} className="flex items-start gap-3 text-gray-200">
                          <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-400 text-sm font-bold">{index + 1}</span>
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center gap-4 pt-8">
                  <CinematicButton
                    variant="secondary"
                    onClick={handleStartOver}
                  >
                    Analyze Another Decision
                  </CinematicButton>
                  <CinematicButton
                    variant="ghost"
                    icon={ArrowLeft}
                    onClick={() => navigate('/dashboard')}
                  >
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