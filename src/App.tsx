import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { EnhancedLandingPage } from "./pages/EnhancedLandingPage";
import OnboardingChat from "./pages/OnboardingChat";
import OnboardingSmart from "./pages/OnboardingSmart";
import Dashboard from "./pages/Dashboard";
import { DecisionCompassPage } from "./pages/DecisionCompassPage";

const AppRoutes: React.FC = () => {
  const { state } = useApp();
  return (
    <Routes>
      <Route path="/" element={<EnhancedLandingPage />} />
      <Route path="/onboarding" element={<OnboardingChat />} />
      <Route path="/onboarding-smart" element={<OnboardingSmart />} />
      <Route
        path="/dashboard"
        element={state.onboardingComplete ? <Dashboard /> : <Navigate to="/onboarding" replace />}
      />
      <Route
        path="/tools/decision-compass"
        element={state.onboardingComplete ? <DecisionCompassPage /> : <Navigate to="/onboarding" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#0b1026]">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}
