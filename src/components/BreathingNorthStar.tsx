import React, { useMemo } from "react";

type Props = {
  /** 0 → 1 */
  completeness?: number;
  /** px */
  size?: number;
  /** show % label next to the star */
  showLabel?: boolean;
  /** compact layout (smaller ring, smaller label) */
  compact?: boolean;
  className?: string;
};

export const BreathingNorthStar: React.FC<Props> = ({
  completeness = 0,
  size = 56,
  showLabel = false,
  compact = false,
  className = "",
}) => {
  const pct = Math.max(0, Math.min(1, completeness));
  const ringDeg = useMemo(() => `${Math.round(pct * 360)}deg`, [pct]);
  const dim = size;
  const ring = compact ? 4 : 6; // ring thickness
  const core = dim - ring * 2;

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="North star progress">
      <div
        className="relative"
        style={{ width: dim, height: dim, minWidth: dim, minHeight: dim }}
      >
        {/* Progress ring (conic) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(#60a5fa ${ringDeg}, rgba(255,255,255,0.08) ${ringDeg})`,
            filter: "drop-shadow(0 0 10px rgba(96,165,250,0.35))",
          }}
        />

        {/* Inner mask to create ring thickness */}
        <div
          className="absolute inset-0 rounded-full bg-[#0b1026]"
          style={{ inset: ring }}
        />

        {/* Core glow */}
        <div
          className="absolute rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-breath"
          style={{
            width: core,
            height: core,
            background:
              "radial-gradient(circle at 50% 50%, rgba(147,197,253,0.9), rgba(168,85,247,0.65) 45%, rgba(236,72,153,0.45) 70%, transparent 75%)",
            boxShadow:
              "0 0 18px rgba(147,197,253,0.35), 0 0 40px rgba(168,85,247,0.25), inset 0 0 12px rgba(255,255,255,0.25)",
          }}
        />

        {/* Cross flare */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: core, height: core }}
        >
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[1.5px] bg-white/45 blur-[0.5px]" />
            <div className="absolute top-1/2 left-0 -translate-y-1/2 h-[1.5px] w-full bg-white/45 blur-[0.5px]" />
          </div>
        </div>

        {/* Orbiting twinkles */}
        <span className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/80 animate-orbit" />
        <span className="absolute -right-1/2 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-blue-200/80 animate-orbit-slow" />
        <span className="absolute -bottom-1/2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-fuchsia-200/80 animate-orbit-rev" />
      </div>

      {showLabel && (
        <div className={`select-none ${compact ? "text-xs" : "text-sm"} text-white/80`}>
          {(pct * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default BreathingNorthStar;
