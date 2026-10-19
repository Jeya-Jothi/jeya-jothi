"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

const RevealContext = createContext<MotionValue<number> | null>(null);

/** 0 → 1 while the dark panel wipes in. */
export function useRevealProgress() {
  const wipe = useContext(RevealContext);
  const fallback = useMotionValue(0);
  return wipe ?? fallback;
}
export default function HeroReveal({
  children,
  panel,
}: {
  children: ReactNode; // the base layer (hero)
  panel: ReactNode; // the content shown on the dark panel
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Smooths out mouse-wheel steps so the wipe feels fluid
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.25,
  });

  // 0 → 1 over the first half of the scroll distance
  const wipe = useTransform(progress, [0, 0.5], [0, 1]);

  const clipPath = useTransform(
    wipe,
    (v) => `inset(0% ${(1 - v) * 100}% 0% 0%)`,
  );
  const edgeLeft = useTransform(wipe, (v) => `${v * 100}%`);
  const edgeOpacity = useTransform(wipe, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  // Panel content appears after the panel is (almost) full width
  const contentOpacity = useTransform(progress, [0.42, 0.62], [0, 1]);
  const contentY = useTransform(progress, [0.42, 0.62], [48, 0]);

  return (
    <RevealContext.Provider value={wipe}>
      <div ref={wrapperRef} className="relative h-[300svh]">
        {/* Anchor for the "About" nav link */}
        <span
          id="about"
          aria-hidden="true"
          className="absolute left-0 top-[40%] h-px w-px"
        />

        {/* Pinned stage */}
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Base layer: hero */}
          <div className="absolute inset-0">{children}</div>

          {/* Glowing leading edge of the shutter */}
          <motion.div
            aria-hidden="true"
            style={{ left: edgeLeft, opacity: edgeOpacity }}
            className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-full bg-sceptre-400 shadow-[0_0_28px_6px_rgb(207_95_110/0.55)]"
          />

          {/* Top layer: dark panel revealed by clip-path */}
          <motion.section
            aria-label="About"
            style={{ clipPath }}
            className="absolute inset-0 z-10 bg-ink text-white"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.09)_1.2px,transparent_1.2px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_75%)]"
            />

            <motion.div
              style={{ opacity: contentOpacity, y: contentY }}
              className="relative flex h-full items-center justify-center px-6 py-24 sm:px-10 lg:px-14"
            >
              {panel}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </RevealContext.Provider>
  );
}
