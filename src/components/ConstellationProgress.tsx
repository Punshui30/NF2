import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

export type ConstellationStep = { id: string; label: string; done: boolean; active?: boolean; };
type Props = { steps: ConstellationStep[]; percent: number; className?: string; };

export default function ConstellationProgress({ steps, percent, className = "" }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 360, h: 320 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth || 360, h: el.clientHeight || 320 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const N = Math.max(steps.length, 3);
  const { pts, cx, cy, r } = useMemo(() => {
    const w = size.w, h = size.h, cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.36;
    const pts = steps.map((_, i) => {
      const ang = (Math.PI * 2 * i) / N - Math.PI / 2;
      return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
    });
    return { pts, cx, cy, r };
  }, [steps, size, N]);

  const pathD = useMemo(() => {
    if (!pts.length) return "";
    return ["M", pts[0].x, pts[0].y].concat(pts.slice(1).flatMap(p => ["L", p.x, p.y]), ["Z"]).join(" ");
  }, [pts]);

  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div ref={wrapRef} className={`rounded-2xl border border-white/10 bg-white/5 p-3 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs sm:text-sm text-white/70">Constellation</div>
        <div className="text-xs sm:text-sm text-white/90">{percent}%</div>
      </div>

      <svg width="100%" height={size.h - 52} viewBox={`0 0 ${size.w} ${size.h - 52}`} className="block">
        <defs>
          <radialGradient id="g" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#6ea8ff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy - 26} r={r + 22} fill="url(#g)" opacity="0.4" />
        <circle cx={cx} cy={cy - 26} r={r} stroke="rgba(255,255,255,0.15)" fill="none" />

        {pts.length >= 3 && (
          <motion.path
            d={pathD.replace(/([\d.]+),([\d.]+)/g, (_m, x, y) => `${x},${Number(y) - 26}`)}
            stroke="rgba(139, 92, 246, 0.8)" strokeWidth="2" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: steps.length ? doneCount / steps.length : 0 }}
            transition={{ duration: 1.1 }}
          />
        )}

        {pts.map((p, i) => {
          const s = steps[i];
          const glow = s.done ? 0.9 : s.active ? 0.5 : 0.2;
          const rr = s.done ? 6 : 4;
          const y = p.y - 26;
          return (
            <g key={s.id}>
              <circle cx={p.x} cy={y} r={rr + 10} fill="#8b5cf6" opacity={glow * 0.15} />
              <circle cx={p.x} cy={y} r={rr} fill={s.done ? "#c4b5fd" : "#94a3b8"} />
              <text x={p.x} y={y + 20} fontSize={size.w < 420 ? 10 : 12} textAnchor="middle"
                fill="rgba(255,255,255,0.85)" className={size.w < 360 ? "hidden" : ""}>
                {s.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
