"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
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
  const stageRef = useRef<HTMLDivElement>(null);
  const metrics = useRef({ top: 0, distance: 1 });

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const measure = () => {
      metrics.current.top =
        wrapper.getBoundingClientRect().top + window.scrollY;
      metrics.current.distance = Math.max(
        1,
        wrapper.offsetHeight - stage.offsetHeight,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const { scrollY } = useScroll();

  const scrollYProgress = useTransform(scrollY, (y) => {
    const { top, distance } = metrics.current;
    return Math.min(1, Math.max(0, (y - top) / distance));
  });

  // Smooths out mouse-wheel steps so the wipe feels fluid
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.25,
  });

  const wipe = useTransform(progress, [0, 0.6], [0, 1]);

  const clipPath = useTransform(
    wipe,
    (v) => `inset(0% ${(1 - v) * 100}% 0% 0%)`,
  );
  const edgeLeft = useTransform(wipe, (v) => `${v * 100}%`);
  const edgeOpacity = useTransform(wipe, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  // Panel content appears after the panel is (almost) full width
  const contentOpacity = useTransform(progress, [0.5, 0.85], [0, 1]);
  const contentY = useTransform(progress, [0.5, 0.85], [48, 0]);

  return (
    <RevealContext.Provider value={wipe}>
      <div ref={wrapperRef} className="relative h-[calc(100lvh+150svh)]">
        {/* Anchor for the "About" nav link */}
        <span
          id="about"
          aria-hidden="true"
          className="absolute left-0 top-[135svh] h-px w-px"
        />

        {/* Pinned stage: full height even when the address bar is hidden */}
        <div
          ref={stageRef}
          className="sticky top-0 h-lvh overflow-hidden bg-white"
        >
          {/* Base layer: hero (laid out in svh, so it never moves) */}
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
            <motion.div
              style={{ opacity: contentOpacity, y: contentY }}
              className="relative flex h-svh items-center justify-center px-6 py-24 sm:px-10 lg:px-14"
            >
              {panel}
            </motion.div>
          </motion.section>
        </div>
      </div>
    </RevealContext.Provider>
  );
}
