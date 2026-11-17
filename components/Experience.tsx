"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { EXPERIENCE, type ExperienceItem, type Role } from "@/lib/experience";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ---------- Small building blocks ---------- */

function ArrowDown({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v16m0 0 6-6m-6 6-6-6" />
    </svg>
  );
}

/** Words slide up out of a clipped line when scrolled into view. */
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

/** Counts up from 0 when it scrolls into view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return <span ref={ref}>{reduce ? to : 0}</span>;
}

/** One step of a timeline. Its entrance is tied to scroll position (scrubbed). */
function TimelineItem({
  item,
  index,
  reduce,
}: {
  item: ExperienceItem;
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start 88%", "start 55%"],
  });

  const opacity = useTransform(p, [0, 1], [0.15, 1]);
  const y = useTransform(p, [0, 1], [64, 0]);
  const scale = useTransform(p, [0, 1], [0.96, 1]);
  const dotColor = useTransform(
    p,
    [0, 1],
    ["rgba(255,255,255,0.18)", "rgb(207,95,110)"],
  );
  const dotGlow = useTransform(
    p,
    (v) => `0 0 ${v * 18}px ${v * 4}px rgba(207,95,110,${v * 0.55})`,
  );

  return (
    <li ref={ref} className="relative pl-10 sm:pl-14">
      {/* Dot on the line: lights up as the step arrives */}
      <motion.span
        aria-hidden="true"
        style={
          reduce
            ? { backgroundColor: "rgb(207,95,110)" }
            : { backgroundColor: dotColor, boxShadow: dotGlow }
        }
        className="absolute left-0 top-8 size-5 rounded-full border-2 border-ink ring-1 ring-white/20"
      />

      <motion.div
        style={reduce ? undefined : { opacity, y, scale }}
        className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.07] sm:p-8"
      >
        <span className="eyebrow text-sceptre-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 className="mt-4 text-balance text-xl text-white sm:text-2xl">
          {item.title}
        </h4>
        <p className="mt-3 text-pretty text-white/70 sm:text-lg">{item.body}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-sceptre-200 sm:text-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  );
}

/** One job: sticky role card on the left, scroll-driven timeline on the right. */
function RoleBlock({
  role,
  reduce,
  first,
}: {
  role: Role;
  reduce: boolean;
  first: boolean;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: blockProgress } = useScroll({
    target: blockRef,
    offset: ["start end", "end start"],
  });
  const wordX = useTransform(blockProgress, [0, 1], ["12%", "-32%"]);

  // The timeline line fills as you scroll through the list
  const { scrollYProgress: listProgress } = useScroll({
    target: listRef,
    offset: ["start 60%", "end 60%"],
  });
  const lineScale = useSpring(listProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.3,
  });

  return (
    <div
      ref={blockRef}
      className={`relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 ${
        first ? "" : "mt-16 border-t border-white/10 pt-16 lg:mt-24 lg:pt-24"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-1/2 flex w-screen -translate-x-1/2 select-none items-center"
      >
        <motion.div
          style={reduce ? undefined : { x: wordX }}
          className="shrink-0 whitespace-nowrap text-[28vw] font-black leading-none tracking-[-0.05em] text-white/[0.035]"
        >
          {role.watermark}
        </motion.div>
      </div>

      {/* Left: role card, stays in view while the timeline scrolls */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-8"
        >
          <p className="eyebrow text-sceptre-300">{role.period}</p>
          <h3 className="mt-5 text-4xl leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl">
            {role.company}
          </h3>
          <p className="mt-2 text-lg text-sceptre-200 sm:text-xl">
            {role.role}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {role.kind === "internship" && (
              <li className="rounded-full border border-sceptre-400/60 px-3 py-1 text-xs text-sceptre-200 sm:text-sm">
                Internship
              </li>
            )}
            <li className="rounded-full border border-white/15 px-3 py-1 text-xs text-sceptre-200 sm:text-sm">
              {role.mode}
            </li>
            <li className="rounded-full border border-white/15 px-3 py-1 text-xs text-sceptre-200 sm:text-sm">
              {role.months} months
            </li>
          </ul>

          <p className="mt-6 text-pretty text-white/70 sm:text-lg">
            {role.summary}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-6">
            {role.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="eyebrow text-sceptre-300">{stat.label}</dt>
                <dd
                  aria-label={`${stat.value} ${stat.label.toLowerCase()}`}
                  className={`mt-1 tracking-[-0.04em] text-white ${
                    typeof stat.value === "number"
                      ? "text-5xl"
                      : "text-3xl leading-[1.6] sm:text-4xl"
                  }`}
                >
                  {typeof stat.value === "number" ? (
                    <CountUp to={stat.value} />
                  ) : (
                    stat.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {role.cta && (
            <a
              href={role.cta.href}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-ink transition-colors hover:bg-sceptre-100"
            >
              {role.cta.label}
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          )}
        </motion.div>
      </aside>

      {/* Right: scroll-driven timeline */}
      <ol ref={listRef} className="relative flex flex-col gap-8 sm:gap-10">
        {/* Track + progress fill */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[9px] top-0 w-0.5 rounded-full bg-white/15"
        />
        <motion.span
          aria-hidden="true"
          style={{ scaleY: reduce ? 1 : lineScale }}
          className="absolute bottom-0 left-[9px] top-0 w-0.5 origin-top rounded-full bg-sceptre-400 shadow-[0_0_16px_2px_rgb(207_95_110/0.5)]"
        />

        {role.items.map((item, i) => (
          <TimelineItem key={item.id} item={item} index={i} reduce={reduce} />
        ))}
      </ol>
    </div>
  );
}

/* ---------- Section ---------- */

export default function Experience() {
  const reduce = useReducedMotion() ?? false;

  return (
    <MotionConfig reducedMotion="user">
      {/* overflow-clip (not overflow-hidden) so the sticky cards still stick */}
      <section
        id="experience"
        aria-labelledby="experience-title"
        className="relative scroll-mt-20 overflow-clip bg-ink py-20 text-white sm:py-28 lg:py-36"
      >
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.07)_1.2px,transparent_1.2px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_50%_40%,black,transparent_75%)]"
        />

        <div className="container-page relative">
          <header className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow text-sceptre-300">Experience</p>
              <h2
                id="experience-title"
                className="mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em] text-white"
              >
                <RevealText text="Where I've worked" />
              </h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="max-w-sm text-pretty text-white/70 sm:text-lg"
            >
              Production work at Growify India, and the internship where it
              started.
            </motion.p>
          </header>

          {EXPERIENCE.map((role, i) => (
            <RoleBlock
              key={role.id}
              role={role}
              reduce={reduce}
              first={i === 0}
            />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
