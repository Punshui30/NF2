// src/hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from "react";

type RecType = typeof window & {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
};

export function useSpeechToText(lang = "en-US") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<any>(null);

  useEffect(() => {
    const w = window as RecType;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SR) {
      setSupported(true);
      const r = new SR();
      r.lang = lang;
      r.interimResults = true;
      r.continuous = true;
      recRef.current = r;
    }
  }, [lang]);

  function start(onText: (finalText: string, interimText?: string) => void) {
    if (!recRef.current) return;
    setError(null);
    try {
      recRef.current.onresult = (e: any) => {
        let interim = "";
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t;
          else interim += t;
        }
        onText(final, interim);
      };
      recRef.current.onend = () => setListening(false);
      recRef.current.onerror = (ev: any) => setError(ev?.error || "mic error");
      recRef.current.start();
      setListening(true);
    } catch (e: any) {
      setError(e?.message || "mic error");
    }
  }

  function stop() {
    try {
      recRef.current?.stop();
    } catch {}
    setListening(false);
  }

  return { supported, listening, error, start, stop };
}
