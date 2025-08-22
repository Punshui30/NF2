// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { LandingPage } from "./pages/LandingPage"; // ✅ named export
import OnboardingChat from "./pages/OnboardingChat";           // ✅ default export
import Dashboard from "./pages/Dashboard";
import { DecisionCompassPage } from "./pages/DecisionCompassPage"; // named export

const AppRoutes: React.FC = () => {
  const { state } = useApp();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/onboarding" element={<OnboardingChat />} />
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
