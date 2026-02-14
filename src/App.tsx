import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// PAGES
import LandingPage from "./pages/LandingPage";
import OnboardingChat from "./pages/OnboardingChat";
import OnboardingSmart from "./pages/OnboardingSmart";

// If you already have these pages, swap imports accordingly or keep these placeholders:
function About() {
  return (
    <div className="aurora-bg min-h-screen flex items-center justify-center px-6">
      <div className="glass rounded-3xl p-8 max-w-xl">
        <h2 className="text-3xl font-semibold">About NorthForm</h2>
        <p className="mt-3 text-white/90">Coming soon.</p>
      </div>
    </div>
  );
}

function Admin() {
  return (
    <div className="aurora-bg min-h-screen flex items-center justify-center px-6">
      <div className="glass rounded-3xl p-8 max-w-xl">
        <h2 className="text-3xl font-semibold">Admin</h2>
        <p className="mt-3 text-white/90">Hidden admin panel placeholder.</p>
      </div>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full text-white border-4 border-red-500">
      <Routes>
        {/* Landing → default CTA navigates to /onboarding (smart) */}
        <Route
          path="/"
          element={
            <LandingPage
              onEnterApp={() => navigate("/onboarding")}
              onLearnMore={() => navigate("/about")}
              onAdminOpen={() => navigate("/admin")}
            />
          }
        />

        {/* Onboarding (default = Smart) */}
        <Route path="/onboarding" element={<OnboardingSmart />} />
        <Route path="/onboarding/smart" element={<OnboardingSmart />} />
        <Route path="/onboarding/chat" element={<OnboardingChat />} />

        {/* App sections */}
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />

        {/* Your dashboard route (use your real page if you already have it) */}
        <Route
          path="/dashboard"
          element={
            <div className="aurora-bg min-h-screen flex items-center justify-center px-6">
              <div className="glass rounded-3xl p-8 max-w-xl">
                <h2 className="text-3xl font-semibold">Dashboard</h2>
                <p className="mt-3 text-white/90">Wire Decision Compass here.</p>
              </div>
            </div>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
