"use client";
import React, { useId, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, SingleOrMultiple } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleColor?: string;
  particleDensity?: number;
  speed?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const { id, className, background, particleColor, particleDensity, speed } = props;
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const controls = useAnimation();
  const particlesLoaded = async (container?: Container) => {
    if (container) {
      controls.start({ opacity: 1, transition: { duration: 1 } });
    }
  };

  const generatedId = useId();

  return (
    <motion.div animate={controls} className={cn("opacity-0", className)}>
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: { color: { value: background || "transparent" } },
            fullScreen: { enable: false, zIndex: 1 },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: { enable: false, mode: "push" },
                onHover: { enable: false, mode: "repulse" },
                resize: true as any
              },
              modes: {
                push: { quantity: 4 },
                repulse: { distance: 200, duration: 0.4 }
              }
            },
            particles: {
              color: { value: particleColor || "#ffffff" },
              move: {
                enable: true,
                direction: "none",
                random: false,
                speed: { min: 0.1, max: speed || 1 },
                straight: false,
                outModes: { default: "out" }
              },
              number: {
                density: { enable: true, width: 400, height: 400 },
                value: particleDensity || 120
              },
              opacity: {
                value: { min: 0.1, max: 1 },
                animation: { enable: true, speed: speed || 4, sync: false, startValue: "random" }
              },
              size: { value: { min: 0.5, max: 2.5 } },
              collisions: { enable: false }
            },
            detectRetina: true
          }}
        />
      )}
    </motion.div>
  );
};

export default SparklesCore;
