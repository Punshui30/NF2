import React from "react";
import { useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";

const Dashboard: React.FC = () => {
  const nav = useNavigate();
  return (
    <div className="min-h-screen bg-[#0b1026] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <header className="mb-5 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">Your Life Navigation Center</h1>
          <p className="text-white/70 mt-2 text-sm sm:text-base">
            This is your evolving Decision Compass. The more you share, the sharper the guidance.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => nav("/tools/decision-compass")}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 text-left hover:bg-white/[0.08] transition"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-fuchsia-500 flex items-center justify-center mb-4">
              <Compass className="text-white" />
            </div>
            <div className="text-lg sm:text-xl font-semibold mb-1">Decision Compass</div>
            <div className="text-white/70 text-sm">
              Navigate complex decisions with AI-powered, psychology-aware analysis.
            </div>
          </button>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
