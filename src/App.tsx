// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import EnhancedLandingPage from "./pages/EnhancedLandingPage"; // ✅ default import
import OnboardingChat from "./pages/OnboardingChat";           // ✅ default export
import Dashboard from "./pages/Dashboard";
import { DecisionCompassPage } from "./pages/DecisionCompassPage"; // named export
import DemoGlassCard from "./pages/DemoGlassCard";
import DemoShader from "./pages/DemoShader";
import DemoSparkles from "./pages/DemoSparkles";

const AppRoutes: React.FC = () => {
  const { state } = useApp();
  return (
    <Routes>
      <Route path="/" element={<EnhancedLandingPage />} />
      <Route path="/onboarding" element={<OnboardingChat />} />
      <Route
        path="/dashboard"
        element={state.onboardingComplete ? <Dashboard /> : <Navigate to="/onboarding" replace />}
      />
      <Route
        path="/tools/decision-compass"
        element={state.onboardingComplete ? <DecisionCompassPage /> : <Navigate to="/onboarding" replace />}
      />
      <Route path="/demo/glass" element={<DemoGlassCard />} />
      <Route path="/demo/shader" element={<DemoShader />} />
      <Route path="/demo/sparkles" element={<DemoSparkles />} />
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
