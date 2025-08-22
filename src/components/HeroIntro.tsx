import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Smartphone, Brain } from "lucide-react";

type HeroIntroProps = {
  onStart: () => void;
  onLearnMore?: () => void;
};

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function HeroIntro({ onStart, onLearnMore }: HeroIntroProps) {
  return (
    <section className="mx-auto max-w-5xl px-4 md:px-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="rainbow-ring glass-lg p-8 md:p-12"
      >
        {/* Eyebrow */}
        <motion.span
          variants={fade}
          className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide"
        >
          <Sparkles className="h-4 w-4" />
          Welcome to NorthForm
        </motion.span>

        {/* Title */}
        <motion.h1
          variants={fade}
          className="text-4xl md:text-6xl font-semibold leading-[1.1] drop-shadow"
        >
          <span className="bg-gradient-to-r from-cyan-200 via-emerald-200 to-fuchsia-200 bg-clip-text text-transparent">
            Navigate life’s big moves
          </span>{" "}
          with clarity.
        </motion.h1>

        {/* Subcopy */}
        <motion.p
          variants={fade}
          className="mt-4 text-base md:text-lg text-white/95 leading-relaxed"
        >
          I’m your AI guide—smart, steady, and tuned to your unique patterns.
          We’ll start with a quick, conversational onboarding to learn your goals
          and constraints. From there, I’ll connect the dots and guide your next best step.
        </motion.p>

        {/* Steps row */}
        <motion.ul variants={fade} className="mt-6 grid gap-3 md:grid-cols-3">
          <li className="flex items-start gap-3 rounded-xl bg-black/30 p-3">
            <Brain className="mt-1 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Step 1 — Light Onboarding</p>
              <p className="text-sm text-white/85">No forms, just chat.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-black/30 p-3">
            <Clock className="mt-1 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Step 2 — Flexible Progress</p>
              <p className="text-sm text-white/85">Pause and resume anytime.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-black/30 p-3">
            <Smartphone className="mt-1 h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">Step 3 — Add as You Go</p>
              <p className="text-sm text-white/85">I adapt in real time.</p>
            </div>
          </li>
        </motion.ul>

        {/* CTA row */}
        <motion.div variants={fade} className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onStart}
            className="rounded-2xl bg-white text-black px-6 py-3 text-base font-semibold shadow-xl hover:shadow-2xl active:scale-[0.98] transition"
          >
            Start your journey <ArrowRight className="ml-2 inline h-5 w-5" />
          </button>
          {onLearnMore && (
            <button
              onClick={onLearnMore}
              className="text-sm md:text-base underline underline-offset-4 text-white/90 hover:text-white"
            >
              How it works
            </button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
