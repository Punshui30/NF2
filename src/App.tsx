import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Onboarding from "./components/Onboarding";
import Dashboard from "./components/Dashboard";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full text-white">
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              onEnterApp={() => navigate("/onboarding")}
              onLearnMore={() => navigate("/about")}
            />
          }
        />
        <Route path="/onboarding" element={<Onboarding onDone={() => navigate("/dashboard")} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
