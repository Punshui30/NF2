import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../components/ui/AuroraBackground';
import { ToolCard } from '../components/ui/ToolCard';
import { Button } from '../components/ui/Button';
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
  LogOut
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'decision-compass',
      title: 'Decision Compass',
      description: 'Navigate complex life decisions with AI-powered analysis of your psychology, values, and circumstances.',
      icon: Compass
    },
    {
      id: 'career-navigator',
      title: 'Career Navigator',
      description: 'Discover your ideal career path based on personality, skills, and deep life alignment.',
      icon: Brain
    },
    {
      id: 'relocation-planner',
      title: 'Relocation Planner',
      description: 'Find your perfect place in the world using lifestyle preferences and personality analysis.',
      icon: MapPin
    },
    {
      id: 'social-insights',
      title: 'Social Insight Engine',
      description: 'Analyze your digital footprint to understand personality patterns and values.',
      icon: Users
    },
    {
      id: 'biometric-guide',
      title: 'Biometric Emotional Guide',
      description: 'Real-time emotional calibration using wearable data for optimal decision timing.',
      icon: Activity
    }
  ];

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    // Here we would navigate to the specific tool or open a modal
    console.log(`Opening tool: ${toolId}`);
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuroraBackground className="min-h-screen" intensity="medium">
      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="p-6 border-b border-white/10 backdrop-blur-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">NorthForm</span>
                <p className="text-sm text-gray-300">Welcome back, {state.user?.name || 'Explorer'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" icon={History}>
                History
              </Button>
              <Button variant="ghost" icon={Settings}>
                Settings
              </Button>
              <Button variant="ghost" icon={User}>
                Profile
              </Button>
              <Button variant="ghost" icon={LogOut} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <motion.section
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Your Life Navigation Center
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Choose a tool below to begin your journey of discovery. Each analysis combines psychology, 
                neuroscience, and AI to deliver personalized insights for your unique situation.
              </p>
            </motion.section>

            {/* Tools Grid */}
            <motion.section
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <ToolCard
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      onClick={() => handleToolClick(tool.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Recent Activity */}
            <motion.section
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Recent Insights</h2>
              {state.history.length > 0 ? (
                <div className="space-y-4">
                  {state.history.slice(0, 3).map((analysis, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <p className="text-white font-medium mb-2">{analysis.recommendation}</p>
                      <p className="text-gray-400 text-sm">Confidence: {analysis.confidence}%</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No insights yet. Start with any tool above to begin your journey.</p>
                </div>
              )}
            </motion.section>
          </div>
        </main>
      </div>
    </AuroraBackground>
  );
};