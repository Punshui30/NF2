import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, HelpCircle, Menu, X, Sparkles, Info } from "lucide-react";
import HeroIntro from "../components/HeroIntro";
import { useNavigate } from "react-router-dom";

/**
 * LandingPage
 * - Aurora background with contrast overlay
 * - Top nav with hidden admin tap (logo tapped 7x within 5s)
 * - Rich hero via <HeroIntro />
 * - Simple "How it works" modal
 * - Mobile sheet menu
 */

type Props = {
  onEnterApp: () => void;
  onLearnMore?: () => void;
  onAdminOpen?: () => void;
};

const ADMIN_TAP_THRESHOLD = 7;
const ADMIN_TAP_WINDOW_MS = 5000;

export default function LandingPage({ onEnterApp, onLearnMore, onAdminOpen }: Props) {
  const navigate = useNavigate();

  // UI state
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hidden admin access via logo taps
  const [tapCount, setTapCount] = useState(0);
  const firstTapRef = useRef<number | null>(null);

  // Tiny toast
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // "?" key opens How it works
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setShowHowItWorks(true);
      }
      if (e.key === "Escape") {
        setShowHowItWorks(false);
        setShowTour(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-clear toast
  useEffect(() => {
    if (!toast) return;
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    }, 2000);
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, [toast]);

  // Logo tap logic → admin
  const handleLogoTap = () => {
    const now = Date.now();
    if (firstTapRef.current === null) {
      firstTapRef.current = now;
      setTapCount(1);
      setToast("👀");
      return;
    }
    if (now - firstTapRef.current > ADMIN_TAP_WINDOW_MS) {
      firstTapRef.current = now;
      setTapCount(1);
      setToast("👀");
      return;
    }
    setTapCount((c) => {
      const next = c + 1;
      if (next >= ADMIN_TAP_THRESHOLD) {
        firstTapRef.current = null;
        setTapCount(0);
        if (onAdminOpen) onAdminOpen();
        else navigate("/admin");
        return 0;
      } else {
        setToast(`${next}/${ADMIN_TAP_THRESHOLD}`);
        return next;
      }
    });
  };

  const openHowItWorks = () => {
    if (onLearnMore) onLearnMore();
    else setShowHowItWorks(true);
  };

  return (
    <div className="aurora-bg relative min-h-screen text-white">
      {/* contrast overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/25 to-black/60" />

      {/* Top Nav */}
      <header className="relative z-20">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          {/* Logo (hidden admin tap) */}
          <button
            type="button"
            onClick={handleLogoTap}
            aria-label="NorthForm"
            title="NorthForm"
            className="group inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 hover:bg-white/10 transition"
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold tracking-wide">NorthForm</span>
            <span className="sr-only">Tap logo 7 times for admin</span>
          </button>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={openHowItWorks}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
            >
              <HelpCircle className="h-4 w-4" />
              How it works
            </button>
            <button
              onClick={() => setShowTour(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm hover:bg-white/10 transition"
            >
              <Info className="h-4 w-4" />
              Tour
            </button>
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg hover:shadow-xl active:scale-[0.99] transition"
            >
              Start now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden rounded-xl bg-white/5 p-2 hover:bg-white/10 transition"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-6">
        <HeroIntro onStart={onEnterApp} onLearnMore={openHowItWorks} />
      </main>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center">
          <div className="pointer-events-auto rounded-full bg-white/15 px-4 py-2 text-sm shadow-xl backdrop-blur">
            {toast}
          </div>
        </div>
      )}

      {/* Mobile Sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-[#0b0f1a] p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button
                className="rounded-xl bg-white/10 p-2 hover:bg-white/15 transition"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openHowItWorks();
                }}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-left hover:bg-white/10 transition"
              >
                <HelpCircle className="h-5 w-5" />
                How it works
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setShowTour(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-3 text-left hover:bg-white/10 transition"
              >
                <Info className="h-5 w-5" />
                Tour
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onEnterApp();
                }}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 font-semibold text-black shadow-lg hover:shadow-xl active:scale-[0.99] transition"
              >
                <span>Start now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How it works Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowHowItWorks(false)}
          />
          <div className="relative z-10 max-w-lg rounded-2xl bg-[#0b0f1a] p-6 shadow-2xl border border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold">How it works</h3>
              <button
                className="rounded-xl bg-white/10 p-2 hover:bg-white/15 transition"
                onClick={() => setShowHowItWorks(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ol className="list-decimal space-y-2 pl-5 text-white/90">
              <li>Start with a light onboarding chat—no forms, just conversation.</li>
              <li>Pause anytime; you can pick up later and I’ll remember context.</li>
              <li>As you add details, I adapt your plan and guide the next best step.</li>
            </ol>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  setShowHowItWorks(false);
                  onEnterApp();
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 font-semibold text-black shadow-lg hover:shadow-xl active:scale-[0.99] transition"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Tour Modal (optional placeholder) */}
      {showTour && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setShowTour(false)}
          />
          <div className="relative z-10 max-w-lg rounded-2xl bg-[#0b0f1a] p-6 shadow-2xl border border-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Quick tour</h3>
              <button
                className="rounded-xl bg-white/10 p-2 hover:bg-white/15 transition"
                onClick={() => setShowTour(false)}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-white/90">
              NorthForm helps you make confident decisions. You’ll see your journey, tools,
              and suggestions adapt as you share more context.
            </p>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowTour(false)}
                className="rounded-2xl bg-white/10 px-4 py-2 hover:bg-white/15 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
