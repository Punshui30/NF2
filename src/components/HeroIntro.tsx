import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Smartphone, Brain } from "lucide-react";
import { Button } from "@/components/ui/button"; // shadcn
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HeroIntroProps = {
  onStart: () => void;                // call to begin onboarding chat
  onLearnMore?: () => void;           // optional: open “How it works” modal/route
  className?: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HeroIntro({ onStart, onLearnMore, className }: HeroIntroProps) {
  return (
    <section className={cn("relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-10 text-white", className)}>
      {/* subtle glass card over your Aurora video */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      >
        <motion.div variants={fadeUp}>
          <Card className="backdrop-blur-xl bg-white/10 border-white/15 shadow-2xl rounded-2xl">
            <CardContent className="p-8 md:p-10">
              {/* Eyebrow */}
              <motion.p
                variants={fadeUp}
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium tracking-wide"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Welcome to NorthForm
              </motion.p>

              {/* Title */}
              <motion.h1
                variants={fadeUp}
                className="text-3xl md:text-5xl font-semibold leading-tight drop-shadow-sm"
              >
                Navigate life’s big moves with clarity.
              </motion.h1>

              {/* Subcopy */}
              <motion.p
                variants={fadeUp}
                className="mt-4 text-base md:text-lg text-white/90 leading-relaxed"
              >
                I’m your AI guide—smart, steady, and tuned to your unique patterns.
                We’ll begin with a quick, conversational onboarding so I can understand
                your goals and constraints. From there, I’ll connect the dots and help you
                make decisions you can trust.
              </motion.p>

              {/* Steps */}
              <motion.ul variants={fadeUp} className="mt-6 grid gap-3 md:grid-cols-3">
                <li className="flex items-start gap-3 rounded-xl bg-black/20 p-3">
                  <Brain className="mt-1 h-5 w-5 shrink-0" aria-hidden />
                  <div>
                    <p className="font-medium">Step 1 — Light Onboarding</p>
                    <p className="text-sm text-white/85">
                      A few quick questions to learn your context—no forms, just chat.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-black/20 p-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0" aria-hidden />
                  <div>
                    <p className="font-medium">Step 2 — Flexible Progress</p>
                    <p className="text-sm text-white/85">
                      Pause anytime. Pick up later and I’ll remember exactly where you left off.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 rounded-xl bg-black/20 p-3">
                  <Smartphone className="mt-1 h-5 w-5 shrink-0" aria-hidden />
                  <div>
                    <p className="font-medium">Step 3 — Add as You Go</p>
                    <p className="text-sm text-white/85">
                      Update details on the go from any device—I'll adapt in real time.
                    </p>
                  </div>
                </li>
              </motion.ul>

              {/* Reassurance */}
              <motion.p variants={fadeUp} className="mt-5 text-sm md:text-base text-white/85">
                Don’t worry—I’m smart enough to connect the dots, fill in gaps, and guide your next best step.
              </motion.p>

              {/* CTA Row */}
              <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  onClick={onStart}
                  className="rounded-2xl px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl"
                >
                  Start your journey
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden />
                </Button>

                <button
                  type="button"
                  onClick={onLearnMore}
                  className="text-sm md:text-base underline underline-offset-4 text-white/90 hover:text-white/100"
                >
                  How it works
                </button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </section>
  );
}
