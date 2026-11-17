"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { motion, MotionConfig, type Variants } from "motion/react";
import {
  GITHUB_URL,
  PROJECTS,
  type Project,
  type ProjectKind,
} from "@/lib/site-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Tone = "red" | "tint" | "white";

const TABS: { id: ProjectKind; label: string; blurb: string }[] = [
  {
    id: "production",
    label: "Production",
    blurb: "Client and company work I designed and built at Growify India.",
  },
  {
    id: "personal",
    label: "Personal",
    blurb: "Projects I build on my own to practise and experiment.",
  },
];

const TONES: Record<
  Tone,
  {
    tile: string;
    glow: string;
    title: string;
    muted: string;
    eyebrow: string;
    chip: string;
    preview: string;
    mark: string;
    cta: string;
    ghost: string;
    status: string;
  }
> = {
  red: {
    tile: "bento-tile--red",
    glow: "rgb(255 255 255 / 0.16)",
    title: "text-white",
    muted: "text-sceptre-200",
    eyebrow: "",
    chip: "border-white/25 bg-white/10 text-white",
    preview: "bg-white/10",
    mark: "text-white/15",
    cta: "bg-white text-sceptre-700 hover:bg-sceptre-100",
    ghost: "border-white/30 text-white hover:bg-white/10",
    status: "border-white/30 text-sceptre-100",
  },
  tint: {
    tile: "bento-tile--tint",
    glow: "rgb(132 0 22 / 0.09)",
    title: "text-ink",
    muted: "text-sceptre-700",
    eyebrow: "",
    chip: "border-sceptre-200 bg-white text-sceptre-700",
    preview: "bg-sceptre-100",
    mark: "text-sceptre-600/15",
    cta: "bg-sceptre-600 text-white hover:bg-sceptre-700",
    ghost:
      "border-sceptre-200 text-sceptre-700 hover:border-sceptre-600 hover:bg-white",
    status: "border-sceptre-200 text-sceptre-700",
  },
  white: {
    tile: "",
    glow: "rgb(132 0 22 / 0.09)",
    title: "text-ink",
    muted: "text-sceptre-700",
    eyebrow: "",
    chip: "border-sceptre-200 bg-sceptre-50 text-sceptre-700",
    preview: "bg-sceptre-100",
    mark: "text-sceptre-600/15",
    cta: "bg-sceptre-600 text-white hover:bg-sceptre-700",
    ghost:
      "border-sceptre-200 text-sceptre-700 hover:border-sceptre-600 hover:bg-sceptre-50",
    status: "border-sceptre-200 text-sceptre-700",
  },
};

const SIZE_CLASS: Record<Project["size"], string> = {
  lg: "sm:col-span-2 lg:col-span-4",
  md: "lg:col-span-3",
  sm: "lg:col-span-2",
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE, delay: i * 0.08 },
  }),
};

/* ---------- Small building blocks ---------- */

function ArrowUpRight({ className = "" }: { className?: string }) {
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
      <path d="M7 17 17 7M8 7h9v9" />
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

/** Tile with a soft light that follows the pointer (CSS vars, no re-render). */
function Tile({ tone, children }: { tone: Tone; children: ReactNode }) {
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
      className={`bento-tile ${t.tile} group h-full p-4 sm:p-5`}
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

/** Screenshot with a styled placeholder behind it (shown until the image exists). */
function Preview({
  project,
  tone,
  featured,
}: {
  project: Project;
  tone: Tone;
  featured: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const t = TONES[tone];

  return (
    <div
      className={`relative flex-1 overflow-hidden rounded-2xl ${t.preview} ${
        featured ? "min-h-56 sm:min-h-80" : "min-h-44"
      }`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center p-4 text-center"
      >
        <span
          className={`font-black leading-none tracking-[-0.04em] ${t.mark} ${
            featured
              ? "text-[clamp(3rem,9vw,7rem)]"
              : "text-[clamp(1.75rem,4vw,3rem)]"
          }`}
        >
          {project.short ?? project.title}
        </span>
      </div>

      {!failed && (
        <Image
          src={project.image}
          alt={`${project.title} website screenshot`}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 800px, 100vw"
              : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          }
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function StatusBadge({
  status,
  tone,
}: {
  status: Project["status"];
  tone: Tone;
}) {
  const t = TONES[tone];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.12em] ${t.status}`}
    >
      {status === "live" ? (
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-sceptre-400 opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-sceptre-400" />
        </span>
      ) : (
        <span className="inline-flex size-2 rounded-full bg-current opacity-40" />
      )}
      {status === "live" ? "Live" : "No public demo"}
    </span>
  );
}

function ProjectCard({
  project,
  index,
  wideOnTablet,
}: {
  project: Project;
  index: number;
  wideOnTablet: boolean;
}) {
  const featured = project.size === "lg";
  const tone: Tone = featured ? "red" : "white";
  const t = TONES[tone];

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={`${SIZE_CLASS[project.size]} ${
        wideOnTablet ? "sm:col-span-2" : ""
      }`}
    >
      <Tile tone={tone}>
        <div className="flex h-full flex-col gap-5">
          <Preview project={project} tone={tone} featured={featured} />

          <div className="px-1 sm:px-2">
            <div className="flex items-center justify-between gap-3">
              <span className={`eyebrow ${t.eyebrow}`}>{project.context}</span>
              <StatusBadge status={project.status} tone={tone} />
            </div>

            <h3
              className={`mt-4 ${t.title} ${
                featured ? "text-3xl sm:text-4xl" : "text-2xl"
              }`}
            >
              {project.title}
            </h3>
            <p className={`mt-2 text-sm sm:text-base ${t.muted}`}>
              {project.summary}
            </p>

            <ul className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className={`rounded-full border px-3 py-1 text-xs sm:text-sm ${t.chip}`}
                >
                  {tag}
                </li>
              ))}
            </ul>

            {(project.live || project.repo) && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {project.live && (
                  // Stretched link: the whole card opens the live site
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${project.title} live site (opens in a new tab)`}
                    className={`group/cta inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors after:absolute after:inset-0 after:content-[''] ${t.cta}`}
                  >
                    Visit live site
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:rotate-45" />
                  </a>
                )}
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} source code on GitHub (opens in a new tab)`}
                    className={`relative z-10 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors ${t.ghost}`}
                  >
                    GitHub
                    <ArrowUpRight className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Tile>
    </motion.article>
  );
}

function GithubTile({ index }: { index: number }) {
  const t = TONES.tint;
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className="sm:col-span-2 lg:col-span-2"
    >
      <Tile tone="tint">
        <div className="flex h-full min-h-56 flex-col justify-between gap-8 p-1 sm:p-2">
          <span className="eyebrow">More work</span>
          <div>
            <h3 className={`text-2xl ${t.title}`}>More on GitHub</h3>
            <p className={`mt-2 text-sm sm:text-base ${t.muted}`}>
              Smaller experiments, UI practice and learning projects live on my
              GitHub profile.
            </p>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View my GitHub profile (opens in a new tab)"
              className={`group/cta mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors after:absolute after:inset-0 after:content-[''] ${t.cta}`}
            >
              View GitHub
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/cta:rotate-45" />
            </a>
          </div>
        </div>
      </Tile>
    </motion.article>
  );
}

/* ---------- Section ---------- */

export default function Projects() {
  const [tab, setTab] = useState<ProjectKind>("production");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const list = PROJECTS.filter((p) => p.kind === tab);
  const activeTab = TABS.find((x) => x.id === tab) ?? TABS[0];

  // On tablet (2 columns) an odd last card spans both columns, so no gap is left
  const singles = list.filter((p) => p.size !== "lg");
  const oddSingles = singles.length % 2 === 1;

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((x) => x.id === tab);
    const next =
      TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="projects"
        aria-labelledby="projects-title"
        className="scroll-mt-20 bg-white py-20 sm:py-28 lg:py-36"
      >
        <div className="container-page">
          <header className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Projects</p>
              <h2
                id="projects-title"
                className="mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em] text-ink"
              >
                <RevealText text="Selected work" />
              </h2>
            </div>

            <div className="flex flex-col gap-4 lg:items-end">
              <div
                role="tablist"
                aria-label="Project type"
                className="inline-flex w-fit rounded-full border border-sceptre-200 bg-sceptre-50 p-1"
              >
                {TABS.map((x) => {
                  const active = x.id === tab;
                  const count = PROJECTS.filter((p) => p.kind === x.id).length;
                  return (
                    <button
                      key={x.id}
                      ref={(el) => {
                        tabRefs.current[x.id] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`tab-${x.id}`}
                      aria-selected={active}
                      aria-controls={`panel-${x.id}`}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setTab(x.id)}
                      onKeyDown={onKeyDown}
                      className={`relative isolate flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors sm:text-base ${
                        active
                          ? "text-white"
                          : "text-sceptre-700 hover:text-sceptre-900"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="projects-tab"
                          className="absolute inset-0 -z-10 rounded-full bg-sceptre-600"
                          transition={{
                            type: "spring",
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}
                      {x.label}
                      <span
                        className={`font-mono text-xs ${
                          active ? "text-sceptre-200" : "text-sceptre-400"
                        }`}
                      >
                        {String(count).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p
                aria-live="polite"
                className="max-w-sm text-pretty text-sceptre-700 sm:text-lg lg:text-right"
              >
                {activeTab.blurb}
              </p>
            </div>
          </header>

          <motion.div
            key={tab}
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="bento-grid"
          >
            {list.map((project, i) => {
              const isLastSingle =
                project.size !== "lg" &&
                project.slug === singles[singles.length - 1]?.slug;
              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={i}
                  wideOnTablet={oddSingles && isLastSingle}
                />
              );
            })}
            {tab === "personal" && <GithubTile index={list.length} />}
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
