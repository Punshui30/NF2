// src/components/MomentTagsRow.tsx
import React from "react";

const TAGS = [
  "venting",
  "planning",
  "celebrating",
  "avoiding",
  "boundary-setting",
  "seeking-help",
  "problem-solving",
];

export default function MomentTagsRow({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (t: string) => {
    onChange(value.includes(t) ? value.filter((x) => x !== t) : [...value, t]);
  };
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {TAGS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => toggle(t)}
          className={`px-2 py-1 rounded-lg border text-sm ${
            value.includes(t)
              ? "bg-white/20 border-white/50 text-white"
              : "bg-white/5 border-white/20 text-gray-200"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
