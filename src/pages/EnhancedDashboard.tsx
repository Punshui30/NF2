import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuroraGalaxyBackground } from '../components/ui/AuroraGalaxyBackground';
import { Tool3DCard } from '../components/ui/Tool3DCard';
import { CinematicButton } from '../components/ui/CinematicButton';
import { useApp } from '../contexts/AppContext';
import { 
  Compass, 
  Brain, 
  MapPin, 
  Users, 
  Activity, 
  Settings,
  History,
  User,
  LogOut,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const EnhancedDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [milestoneProgress, setMilestoneProgress] = useState(0);

  const tools = [
    {
      id: 'decision-compass',
      title: 'Decision Compass',
      description: 'Navigate complex life decisions with AI-powered analysis of your psychology, values, and real-time biometric state.',
      icon: Compass,
      glowColor: 'blue'
    },
    {
      id: 'career-navigator',
      title: 'Career Navigator',
      description: 'Discover your ideal career path through deep personality mapping and global opportunity analysis.',
      icon: Brain,
      glowColor: 'purple'
    },
    {
      id: 'relocation-planner',
      title: 'Relocation Planner',
      description: 'Find your perfect place in the world using lifestyle preferences and biometric compatibility.',
      icon: MapPin,
      glowColor: 'green'
    },
    {
      id: 'social-insights',
      title: 'Social Insight Engine',
      description: 'Analyze your digital footprint to understand personality patterns, values, and emotional drivers.',
      icon: Users,
      glowColor: 'pink'
    },
    {
      id: 'biometric-guide',
      title: 'Biometric Emotional Guide',
      description: 'Real-time emotional calibration using wearable data for optimal decision timing and stress management.',
      icon: Activity,
      glowColor: 'yellow'
    }
  ];

  useEffect(() => {
    // Simulate milestone progress based on user activity
    const interval = setInterval(() => {
      setMilestoneProgress(prev => (prev + 20) % 100);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    console.log(`🎯 Tool clicked: ${toolId}`);
    
    // Navigate to the specific tool
    if (toolId === 'decision-compass') {
      navigate('/tools/decision-compass');
    } else {
      // For other tools, show coming soon message
      alert(`${toolId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} tool coming soon!`);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleMilestoneComplete = () => {
    console.log('Dashboard milestone completed!');
  };

  return (
    <AuroraGalaxyBackground 
      className="min-h-screen" 
      intensity="medium"
      milestoneProgress={milestoneProgress}
      onMilestoneComplete={handleMilestoneComplete}
      enableSpatialAudio={true}
      audioMode="dashboard"
    >
      <div className="relative z-10">
        {/* Enhanced Header */}
        <motion.header
          className="p-6 border-b border-white/10 backdrop-blur-xl bg-white/5"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  NorthForm
                </span>
                <p className="text-lg text-gray-300 font-medium">
                  Welcome back, {state.user?.name || 'Explorer'}
                </p>
              </div>
            </motion.div>
            
            <div className="flex items-center gap-4">
              <CinematicButton variant="ghost" icon={History} size="md">
                History
              </CinematicButton>
              <CinematicButton variant="ghost" icon={Settings} size="md">
                Settings
              </CinematicButton>
              <CinematicButton variant="ghost" icon={User} size="md">
                Profile
              </CinematicButton>
              <CinematicButton variant="ghost" icon={LogOut} onClick={handleLogout} size="md">
                Logout
              </CinematicButton>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section with Stats */}
            <motion.section
              className="mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                    Your Life Navigation
                    <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {" "}Center
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 max-w-4xl leading-relaxed">
                    Choose a tool below to begin your journey of discovery. Each analysis combines psychology, 
                    neuroscience, and AI to deliver personalized insights for your unique situation.
                  </p>
                </div>
                
                {/* Stats Panel */}
                <motion.div
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-green-400" />
                    Your Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Insights Generated</span>
                        <span className="text-white font-semibold">{state.history.length}</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(state.history.length * 20, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Profile Completion</span>
                        <span className="text-white font-semibold">85%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full w-[85%]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* 3D Tools Grid */}
            <motion.section
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 100, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.8 + index * 0.15,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    <Tool3DCard
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      onClick={() => handleToolClick(tool.id)}
                      glowColor={tool.glowColor}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Recent Activity with Enhanced Design */}
            <motion.section
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Recent Insights</h2>
              </div>
              
              {state.history.length > 0 ? (
                <div className="space-y-6">
                  {state.history.slice(0, 3).map((analysis, index) => (
                    <motion.div 
                      key={index}
                      className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                    >
                      <p className="text-white font-semibold mb-3 text-lg">{analysis.recommendation}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-400">Confidence: {analysis.confidence}%</p>
                        <div className="w-20 bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${analysis.confidence}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Begin?</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    No insights yet. Start with any tool above to begin your transformative journey.
                  </p>
                  <CinematicButton 
                    variant="aurora" 
                    size="lg"
                    onClick={() => handleToolClick('decision-compass')}
                    icon={Compass}
                  >
                    Start Your First Analysis
                  </CinematicButton>
                </motion.div>
              )}
            </motion.section>
          </div>
        </main>
      </div>
    </AuroraGalaxyBackground>
  );
};