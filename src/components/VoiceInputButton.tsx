import React, { useRef, useState } from "react";

declare global {
  interface Window { webkitSpeechRecognition: any; SpeechRecognition: any; }
}

export default function VoiceInputButton({
  onAppend,
  label = "Speak",
}: { onAppend: (text: string) => void; label?: string }) {
  const [rec, setRec] = useState<any>(null);
  const active = useRef(false);

  function start() {
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!R) { alert("Voice input not supported in this browser."); return; }
    const r = new R();
    r.lang = "en-US";
    r.interimResults = false;
    r.onresult = (e: any) => {
      const t = Array.from(e.results).map((res: any) => res[0].transcript).join(" ");
      if (t) onAppend(t.trim());
    };
    r.onend = () => (active.current = false);
    active.current = true;
    setRec(r);
    r.start();
  }

  function stop() { if (rec && active.current) rec.stop(); }

  return (
    <button
      type="button"
      onMouseDown={start}
      onMouseUp={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      className="px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm"
      title="Hold to talk"
    >
      {label}
    </button>
  );
}
