import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import { EnhancedLandingPage } from './pages/EnhancedLandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { EnhancedDashboard } from './pages/EnhancedDashboard';
import { DecisionCompassPage } from './pages/DecisionCompassPage';

const AppRoutes: React.FC = () => {
  const { state } = useApp();

  return (
    <Routes>
      <Route path="/" element={<EnhancedLandingPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route 
        path="/dashboard" 
        element={
          state.onboardingComplete ? (
            <EnhancedDashboard />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        } 
      />
      <Route 
        path="/tools/decision-compass" 
        element={
          state.onboardingComplete ? (
            <DecisionCompassPage />
          ) : (
            <Navigate to="/onboarding" replace />
          )
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;