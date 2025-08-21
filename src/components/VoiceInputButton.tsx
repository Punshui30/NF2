import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

type Props = {
  onAppend: (text: string) => void;
  label?: string;
  className?: string;
};

export default function VoiceInputButton({ onAppend, label = "Speak", className = "" }: Props) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const SR: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.lang = "en-US";
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = (e: any) => {
      const t = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
      if (t) onAppend(t.trim());
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, [onAppend]);

  const toggle = () => {
    if (!supported) return;
    if (listening) {
      recRef.current?.stop?.();
      setListening(false);
    } else {
      try {
        recRef.current?.start?.();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const BtnIcon = listening ? MicOff : Mic;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!supported}
      title={supported ? label : "Voice input not supported in this browser"}
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 border border-white/20 bg-white/10 text-white hover:bg-white/15 disabled:opacity-50 ${className}`}
    >
      <BtnIcon className="w-4 h-4" />
      <span className="text-sm">{listening ? "Listening…" : label}</span>
    </button>
  );
}
