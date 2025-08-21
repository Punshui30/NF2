import React from "react";

export default function BreathingNorthStar({ completeness = 0 }: { completeness?: number }) {
  const scale = 0.9 + 0.3 * completeness;
  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full bg-indigo-400 shadow-[0_0_40px_8px_rgba(99,102,241,0.45)] animate-pulse"
        style={{ transform: `scale(${scale})` }}
      />
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 40 40">
          <g fill="#E5E7EB">
            <polygon points="20,2 22,14 20,12 18,14" />
            <polygon points="20,38 22,26 20,28 18,26" />
            <polygon points="2,20 14,22 12,20 14,18" />
            <polygon points="38,20 26,22 28,20 26,18" />
          </g>
        </svg>
      </div>
    </div>
  );
}
