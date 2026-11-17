"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, MotionConfig, type Variants } from "motion/react";
import { SKILL_GROUPS } from "@/lib/site-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Group = (typeof SKILL_GROUPS)[number];
type Tone = "red" | "tint" | "white";

/* Bento layout: 4 + 2 on the first row, 2 + 2 + 2 on the second (desktop) */
const LAYOUT: Record<Group["id"], string> = {
  frontend: "sm:col-span-2 lg:col-span-4",
  design: "lg:col-span-2",
  ai: "lg:col-span-2",
  tools: "lg:col-span-2",
  backend: "lg:col-span-2",
};

const TONE_OF: Record<Group["id"], Tone> = {
  frontend: "red",
  design: "tint",
  ai: "white",
  tools: "white",
  backend: "white",
};

const TONES: Record<
  Tone,
  {
    tile: string;
    glow: string;
    title: string;
    muted: string;
    chip: string;
    note: string;
  }
> = {
  red: {
    tile: "bento-tile--red",
    glow: "rgb(255 255 255 / 0.16)",
    title: "text-white",
    muted: "text-sceptre-200",
    chip: "border-white/25 bg-white/10 text-white hover:bg-white hover:text-sceptre-700",
    note: "border-white/30 text-sceptre-100",
  },
  tint: {
    tile: "bento-tile--tint",
    glow: "rgb(132 0 22 / 0.09)",
    title: "text-ink",
    muted: "text-sceptre-700",
    chip: "border-sceptre-200 bg-white text-sceptre-700 hover:border-sceptre-600 hover:bg-sceptre-600 hover:text-white",
    note: "border-sceptre-200 text-sceptre-700",
  },
  white: {
    tile: "",
    glow: "rgb(132 0 22 / 0.09)",
    title: "text-ink",
    muted: "text-sceptre-700",
    chip: "border-sceptre-200 bg-sceptre-50 text-sceptre-700 hover:border-sceptre-600 hover:bg-sceptre-600 hover:text-white",
    note: "border-sceptre-200 text-sceptre-700",
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 48 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE,
      delay: i * 0.08,
      delayChildren: 0.3 + i * 0.08,
      staggerChildren: 0.045,
    },
  }),
};

const chipVariants: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: EASE },
  },
};

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

function RevealText({ text }: { text: string }) {
  return (
    <motion.span
      aria-label={text}
      className="block"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="-my-[0.1em] mr-[0.25em] inline-block overflow-hidden py-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              show: {
                y: "0%",
                transition: { duration: 0.9, ease: EASE, delay: i * 0.08 },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Tile with a soft light that follows the pointer (updates CSS vars, no re-render). */
function Tile({
  tone,
  className = "",
  children,
}: {
  tone: Tone;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const t = TONES[tone];

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={`bento-tile ${t.tile} group h-full p-6 sm:p-8 ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), ${t.glow}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

function Chip({
  label,
  tone,
  large,
}: {
  label: string;
  tone: Tone;
  large: boolean;
}) {
  return (
    <motion.li
      variants={chipVariants}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`cursor-default rounded-full border transition-colors duration-200 ${
        large ? "px-4 py-2 text-base" : "px-3 py-1.5 text-sm"
      } ${TONES[tone].chip}`}
    >
      {label}
    </motion.li>
  );
}

function SkillCard({ group, index }: { group: Group; index: number }) {
  const tone = TONE_OF[group.id];
  const t = TONES[tone];
  const featured = group.id === "frontend";
  const note = "note" in group ? group.note : undefined;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={LAYOUT[group.id]}
    >
      <Tile tone={tone} className={featured ? "lg:min-h-[22rem]" : ""}>
        {/* Slowly rotating star, only on the featured tile */}
        {featured && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-24 size-80 text-white/10 sm:size-96"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          >
            <Sparkle className="size-full" />
          </motion.div>
        )}

        <div className="relative z-10 flex h-full flex-col gap-8">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow">0{index + 1}</span>
              {note && (
                <span
                  className={`rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] ${t.note}`}
                >
                  {note}
                </span>
              )}
            </div>
            <h3
              className={`mt-6 ${t.title} ${
                featured ? "text-3xl sm:text-5xl" : "text-2xl sm:text-[1.75rem]"
              }`}
            >
              {group.title}
            </h3>
            <p className={`mt-2 max-w-sm text-sm sm:text-base ${t.muted}`}>
              {group.blurb}
            </p>
          </div>

          <ul className="mt-auto flex flex-wrap gap-2">
            {group.skills.map((skill) => (
              <Chip key={skill} label={skill} tone={tone} large={featured} />
            ))}
          </ul>
        </div>
      </Tile>
    </motion.article>
  );
}

/* ---------- Section ---------- */

export default function Skills() {
  return (
    <MotionConfig reducedMotion="user">
      <section
        id="skills"
        aria-labelledby="skills-title"
        className="scroll-mt-20 bg-white py-20 sm:py-28"
      >
        <div className="container-page">
          <header className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Skills</p>
              <h2
                id="skills-title"
                className="mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em] text-ink"
              >
                <RevealText text="Tools I build with" />
              </h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="max-w-sm text-pretty text-sceptre-700 sm:text-lg"
            >
              A focused toolkit for turning designs into fast, responsive and
              accessible interfaces.
            </motion.p>
          </header>

          <div className="bento-grid">
            {SKILL_GROUPS.map((group, i) => (
              <SkillCard key={group.id} group={group} index={i} />
            ))}
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
