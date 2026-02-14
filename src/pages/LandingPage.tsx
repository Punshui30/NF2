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
  return (
    <div className="min-h-screen border-4 border-blue-500 flex flex-col items-center justify-center bg-black text-white p-8">
      <h1 className="text-5xl font-bold mb-4">NorthForm Debug Mode</h1>
      <p className="text-xl mb-8 text-gray-400">Restoring functionality step-by-step...</p>

      <div className="flex gap-4">
        <button
          onClick={onEnterApp}
          className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Enter App (Bypass Landing)
        </button>
      </div>
    </div>
  );
}
