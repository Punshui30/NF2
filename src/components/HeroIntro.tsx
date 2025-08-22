import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Smartphone, Brain } from "lucide-react";

type HeroIntroProps = {
  onStart: () => void;
  onLearnMore?: () => void;
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function HeroIntro({ onStart, onLearnMore }: HeroIntroProps) {
  return (
    <section className="mx-auto max-w-4xl px-2 md:px-6">
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="glass rounded-3xl p-7 md:p-10"
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Welcome to NorthForm
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="text-3xl md:text-5xl font-semibold leading-tight"
        >
          Navigate life’s big moves with clarity.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 text-base md:text-lg text-white/90 leading-relaxed"
        >
          I’m your AI guide—smart, steady, and tuned to your unique patterns.
          We’ll start with a quick, conversational onboarding so I can learn your
          goals and constraints. From there, I’ll connect the dots and guide your
          next best step.
        </motion.p>

        <motion.ul variants={fadeUp} className="mt-6 grid gap-3 md:grid-cols-3">
          <li className="flex items-start gap-3 rounded-xl bg-black/25 p-3">
            <Brain className="mt-1 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">Step 1 — Light Onboarding</p>
              <p className="text-sm text-white/85">No forms, just chat.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-black/25 p-3">
            <Clock className="mt-1 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">Step 2 — Flexible Progress</p>
              <p className="text-sm text-white/85">Pause and resume anytime.</p>
            </div>
          </li>
          <li className="flex items-start gap-3 rounded-xl bg-black/25 p-3">
            <Smartphone className="mt-1 h-5 w-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">Step 3 — Add as You Go</p>
              <p className="text-sm text-white/85">I adapt in real time.</p>
            </div>
          </li>
        </motion.ul>

        <motion.p variants={fadeUp} className="mt-5 text-sm md:text-base text-white/85">
          Don’t worry—I’m smart enough to connect the dots, fill in gaps, and guide you forward.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
          <button
            onClick={onStart}
            className="rounded-2xl bg-white text-black px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl active:scale-[0.99] transition"
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
