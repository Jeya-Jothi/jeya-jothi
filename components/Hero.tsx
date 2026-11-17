"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useTransform,
} from "motion/react";
import { useRevealProgress } from "@/components/HeroReveal";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Small building blocks ---------- */

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
    </svg>
  );
}

/** Letter-by-letter reveal. Letters slide up out of a clipped line. */
function Line({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`-my-[0.12em] block overflow-hidden py-[0.12em] ${className}`}
    >
      <motion.span
        className="flex"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.045, delayChildren: delay },
          },
        }}
      >
        {text.split("").map((char, i) => (
          <motion.span
            key={i}
            className="inline-block origin-bottom-left"
            variants={{
              hidden: { y: "130%", rotate: 8 },
              show: {
                y: "0%",
                rotate: 0,
                transition: { duration: 0.9, ease: EASE },
              },
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}

/* ---------- Giant text that fits the exact ink width ---------- */

const TRACKING = -0.03; // letter-spacing in em
const TRAILING_PAD = 0.04; // em, stops the last glyph being clipped

function measureInk(text: string, el: HTMLElement) {
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;

  const cs = getComputedStyle(el);
  ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;

  const chars = text.split("");
  const advances = chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0);
  const first = ctx.measureText(chars[0]);
  const last = ctx.measureText(chars[chars.length - 1]);

  return {
    content: advances + chars.length * TRACKING * 100,
    left: -first.actualBoundingBoxLeft, // gap before the first glyph's ink
    right: last.width - last.actualBoundingBoxRight, // gap after the last
  };
}

function FitLine({
  text,
  delay = 0,
  fallback,
}: {
  text: string;
  delay?: number;
  fallback: string; // first-paint size, before JS measures
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) return;

    const fit = () => {
      const available = box.clientWidth;
      if (!available) return; // hidden at this breakpoint

      const m = measureInk(text, el);
      if (!m) return;

      // Visible ink width at 100px (tracking after the last glyph removed)
      const ink = m.content - TRACKING * 100 - m.left - m.right;
      if (ink <= 0) return;

      const scale = available / ink;
      el.style.fontSize = `${100 * scale}px`;
      el.style.marginLeft = `${-m.left * scale}px`; // pull ink to the edge
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    document.fonts?.ready.then(fit);
    document.fonts?.addEventListener("loadingdone", fit);

    return () => {
      observer.disconnect();
      document.fonts?.removeEventListener("loadingdone", fit);
    };
  }, [text]);

  return (
    <div ref={boxRef} className="w-full">
      <span
        ref={textRef}
        className="-my-[0.12em] inline-flex overflow-hidden whitespace-nowrap py-[0.12em] font-black leading-[0.9] text-ink"
        style={{
          letterSpacing: `${TRACKING}em`,
          paddingRight: `${TRAILING_PAD}em`,
        }}
      >
        <motion.span
          className="flex"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.06, delayChildren: delay },
            },
          }}
        >
          {text.split("").map((char, i) => (
            <motion.span
              key={i}
              className="inline-block origin-bottom-left"
              variants={{
                hidden: { y: "130%", rotate: 10 },
                show: {
                  y: "0%",
                  rotate: 0,
                  transition: { duration: 1, ease: EASE },
                },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </span>
    </div>
  );
}

/** Endless strip at the bottom of the card. */

const MARQUEE_ITEMS = [
  "Frontend Developer",
  "UI Design Enthusiast",
  "Creative Problem Solver",
  "Interactive Web Experiences",
  "Design to Code",
  "Always Building",
];
const REPEAT = 3; // list repeats per copy, so one copy is wider than any screen (up to 4K)
const SPEED = 50; // pixels per second

function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Visitors who asked for reduced motion get a still strip
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let anim: Animation | null = null;

    const sync = () => {
      const copyWidth = track.scrollWidth / 2; // the track holds two identical copies
      if (!copyWidth) return;
      const duration = (copyWidth / SPEED) * 1000;

      if (!anim) {
        anim = track.animate(
          [
            { transform: "translate3d(0,0,0)" },
            { transform: "translate3d(-50%,0,0)" },
          ],
          { duration, iterations: Infinity, easing: "linear" },
        );
        return;
      }

      // Width changed (font loaded, window resized): same speed, same position
      const effect = anim.effect;
      if (!effect) return;
      const old = Number(effect.getTiming().duration) || duration;
      if (Math.abs(old - duration) < 1) return;
      const ratio = (Number(anim.currentTime) % old) / old;
      effect.updateTiming({ duration });
      anim.currentTime = ratio * duration;
    };

    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    document.fonts?.ready.then(sync);

    return () => {
      observer.disconnect();
      anim?.cancel();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-t border-line bg-ink py-4"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-10 pr-10">
            {Array.from({ length: REPEAT }).flatMap((_, r) =>
              MARQUEE_ITEMS.map((item) => (
                <span key={`${r}-${item}`} className="flex items-center gap-10">
                  <span className="eyebrow whitespace-nowrap text-white">
                    {item}
                  </span>
                  <Sparkle className="size-3 shrink-0 text-white" />
                </span>
              )),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Hero ---------- */

export default function Hero() {
  const wipe = useRevealProgress();
  const reduce = useReducedMotion();

  const squeeze = useTransform(wipe, [0, 1], [1, reduce ? 1 : 0.02]);
  return (
    <MotionConfig reducedMotion="user">
      <section id="home" className="h-lvh">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative h-full overflow-hidden bg-white"
        >
          {/* Main content: centered in the full screen height */}
          <motion.div
            style={{ scaleX: squeeze, originX: 1 }}
            className="absolute inset-x-0 top-0 flex h-svh flex-col justify-center px-6 sm:px-10 lg:px-14"
          >
            {" "}
            {/* Real heading for screen readers and SEO */}
            <h1 className="sr-only">
              Jeya Jothi, Frontend Developer Portfolio
            </h1>
            {/* 1. Name, small */}
            <div aria-hidden="true" className="ml-2">
              <p className="text-[clamp(1.1rem,2.4vw,2.25rem)] leading-tight text-ink">
                <Line text="Jeya Jothi" delay={0.2} />
              </p>
            </div>
            {/* 2. PORTFOLIO, giant, bold, full width */}
            <motion.div aria-hidden="true">
              {/* Desktop and tablet: one line */}
              <div className="hidden md:block">
                <FitLine text="PORTFOLIO" delay={0.35} fallback="16vw" />
              </div>
              {/* Mobile: stacked so it stays huge */}
              <div className="md:hidden">
                <FitLine text="PORT" delay={0.35} fallback="28vw" />
                <FitLine text="FOLIO" delay={0.6} fallback="24vw" />
              </div>
            </motion.div>
            {/* 3. Role, right end */}
            <motion.div
              aria-hidden="true"
              className="mt-4 flex items-center justify-end gap-4 sm:mt-6 sm:gap-6"
            >
              <p className="text-[clamp(1.1rem,2.4vw,2.25rem)] leading-tight text-ink">
                <Line text="Frontend Developer" delay={1.05} />
              </p>
            </motion.div>
          </motion.div>
          <motion.div
            style={{ scaleX: squeeze, originX: 1 }}
            className="absolute inset-x-0 bottom-0 top-[100svh] bg-ink"
          >
            <div className="absolute inset-x-0 bottom-full">
              <Marquee />
            </div>
          </motion.div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
