"use client";

import { useEffect, useRef } from "react";
import { motion, MotionConfig, useScroll, useTransform } from "motion/react";

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

/**
 * Measures the text at 100px using the real font, including the empty
 * space (side bearings) before the first glyph and after the last one.
 * Letters are separate inline-blocks, so widths are summed per character.
 */
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

/**
 * Bold giant text. The visible INK (not the text box) is stretched to the
 * exact width of its container, so the first and last letters touch both
 * edges and line up with everything else in the column.
 */
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
function Marquee() {
  const items = Array.from({ length: 6 });
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-t border-line bg-ink py-4"
    >
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-8 pr-8">
            {items.map((_, i) => (
              <span key={i} className="flex items-center gap-8">
                <span className="eyebrow whitespace-nowrap text-white">
                  Frontend Developer
                </span>
                <Sparkle className="size-3 text-white" />
                <span className="eyebrow whitespace-nowrap text-white">
                  Portfolio
                </span>
                <Sparkle className="size-3 text-white" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- Hero ---------- */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Gentle scroll parallax: giant word drifts down, role slides away
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const giantY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const roleX = useTransform(scrollYProgress, [0, 1], [0, 160]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} id="home" className="h-svh">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative h-full overflow-hidden bg-white"
        >
          {/* Main content: centered in the full screen height */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14">
            {/* Real heading for screen readers and SEO */}
            <h1 className="sr-only">
              Jeya Jothi, Frontend Developer Portfolio
            </h1>

            {/* 1. Name, small */}
            <div aria-hidden="true" className=" ml-2">
              <p className="text-[clamp(1.1rem,2.4vw,2.25rem)] leading-tight text-ink">
                <Line text="Jeya Jothi" delay={0.2} />
              </p>
            </div>

            {/* 2. PORTFOLIO, giant, bold, full width */}
            <motion.div aria-hidden="true" style={{ y: giantY }}>
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
              style={{ x: roleX }}
              className="mt-4 flex items-center justify-end gap-4 sm:mt-6 sm:gap-6"
            >
              <p className="text-[clamp(1.1rem,2.4vw,2.25rem)] leading-tight text-ink">
                <Line text="Frontend Developer" delay={1.05} />
              </p>
            </motion.div>
          </div>

          {/* Marquee pinned to the bottom edge */}
          <div className="absolute inset-x-0 bottom-0">
            <Marquee />
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
