"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ART, PINTEREST_URL, type Artwork } from "@/lib/art";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SHAPE: Record<Artwork["shape"], string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  wide: "aspect-[5/4]",
};

// Small offsets and tilts so the row feels hand-placed, not gridded
const TILT = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];
const SHIFT = [
  "translate-y-8",
  "-translate-y-6",
  "translate-y-2",
  "-translate-y-10",
];

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

/* ---------- Pieces of the track ---------- */

function Intro() {
  return (
    <div className="w-[min(86vw,34rem)] shrink-0 pr-6 sm:pr-12">
      <p className="eyebrow text-sceptre-300">Off the clock</p>
      <h2
        id="gallery-title"
        className="mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em] text-white"
      >
        Art I make for fun
      </h2>
      <p className="mt-6 max-w-md text-pretty text-white/70 sm:text-lg">
        Away from code, I paint and make things by hand. A small selection from
        my Pinterest gallery. Scroll sideways through it, tap any piece to see
        it larger.
      </p>
      <p
        aria-hidden="true"
        className="mt-10 inline-flex items-center gap-3 text-sm text-sceptre-300"
      >
        Keep scrolling
        <span className="h-px w-12 bg-sceptre-400" />
      </p>
    </div>
  );
}

function Card({
  art,
  index,
  progress,
  onOpen,
  reduce,
}: {
  art: Artwork;
  index: number;
  progress: MotionValue<number>;
  onOpen: (i: number) => void;
  reduce: boolean;
}) {
  // The picture drifts slightly inside its frame while you scroll (parallax)
  const dir = index % 2 === 0 ? 1 : -1;
  const innerX = useTransform(
    progress,
    [0, 1],
    [`${-5 * dir}%`, `${5 * dir}%`],
  );

  return (
    <li className={`shrink-0 ${reduce ? "" : SHIFT[index % SHIFT.length]}`}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        aria-label={`View ${art.title} larger`}
        className={`group relative block h-[50svh] max-h-[34rem] overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition duration-500 ease-out hover:z-10 hover:rotate-0 hover:scale-[1.03] hover:border-white/30 focus-visible:rotate-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sceptre-300 ${SHAPE[art.shape]} ${reduce ? "" : TILT[index % TILT.length]}`}
      >
        <motion.div
          style={reduce ? undefined : { x: innerX }}
          className="absolute -inset-x-[8%] inset-y-0"
        >
          <Image
            src={art.src}
            alt={`${art.title}, artwork by Jeya Jothi`}
            fill
            sizes="(max-width: 768px) 70vw, 30vw"
            className="object-cover"
          />
        </motion.div>

        {/* Caption slides up on hover / focus */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-full items-end justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12 text-white transition-transform duration-500 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
          <span className="text-sm">{art.title}</span>
          <span className="eyebrow text-sceptre-200">{art.id}</span>
        </span>
      </button>
    </li>
  );
}

function PinterestEnd() {
  return (
    <li className="w-[min(80vw,26rem)] shrink-0 pl-6 sm:pl-12">
      <a
        href={PINTEREST_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex aspect-square flex-col justify-between rounded-[2rem] border border-sceptre-400/50 bg-sceptre-900/40 p-7 text-white transition-colors duration-300 hover:bg-sceptre-400 hover:text-ink"
      >
        <span className="eyebrow text-sceptre-300 transition-colors group-hover:text-ink/70">
          Want more?
        </span>
        <span className="text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          See the full gallery on Pinterest
        </span>
        <span className="flex items-center gap-2 text-sm">
          @jeyajothi22
          <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </span>
      </a>
    </li>
  );
}

/* ---------- Lightbox ---------- */

function Lightbox({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const art = ART[index];
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, onStep]);

  const navBtn =
    "grid size-11 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sceptre-300";

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${art.title}, artwork ${index + 1} of ${ART.length}`}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        key={art.id}
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="relative h-[72svh] w-[min(92vw,64rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={art.src}
          alt={`${art.title}, artwork by Jeya Jothi`}
          fill
          sizes="92vw"
          className="object-contain"
          priority
        />
      </motion.div>

      <div
        className="mt-5 flex w-[min(92vw,64rem)] items-center justify-between gap-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-lg">{art.title}</p>
          <p className="eyebrow text-sceptre-300">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(ART.length).padStart(2, "0")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="Previous artwork"
            className={navBtn}
          >
            <ArrowUpRight className="size-5 -rotate-[135deg]" />
          </button>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="Next artwork"
            className={navBtn}
          >
            <ArrowUpRight className="size-5 rotate-45" />
          </button>
        </div>
      </div>

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className={`${navBtn} absolute right-4 top-4`}
      >
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </motion.div>
  );
}

/* ---------- Section ---------- */

export default function Gallery() {
  const reduce = useReducedMotion() ?? false;
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 140, damping: 30, mass: 0.4 });
  const travel = useMotionValue(0);
  const x = useTransform([progress, travel], ([p, t]: number[]) => -p * t);
  const wordX = useTransform(progress, [0, 1], ["0%", "-45%"]);

  const [current, setCurrent] = useState(1);
  useMotionValueEvent(progress, "change", (v) =>
    setCurrent(Math.min(ART.length, Math.floor(v * ART.length) + 1)),
  );

  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((i) => (i === null ? i : (i + dir + ART.length) % ART.length)),
    [],
  );

  /* Pinned horizontal scroll.
     Progress comes from window.scrollY and fixed lengths (never innerHeight),
     so the mobile address bar showing/hiding cannot make it jump. */
  useEffect(() => {
    if (reduce) return;
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    let top = 0;
    let dist = 0;

    const update = () => {
      raw.set(
        dist > 0 ? Math.min(1, Math.max(0, (window.scrollY - top) / dist)) : 0,
      );
    };
    const measure = () => {
      dist = Math.max(
        0,
        track.offsetWidth - document.documentElement.clientWidth,
      );
      travel.set(dist);
      // Scroll length = one full screen (the pinned stage) + the sideways distance
      outer.style.height = `calc(100lvh + ${dist}px)`;
      top = outer.getBoundingClientRect().top + window.scrollY;
      update();
    };

    measure();
    window.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    ro.observe(document.body);
    document.fonts?.ready.then(measure);

    return () => {
      window.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [reduce, raw, travel]);

  const items = (
    <>
      <li className="shrink-0">
        <Intro />
      </li>
      {ART.map((art, i) => (
        <Card
          key={art.id}
          art={art}
          index={i}
          progress={progress}
          onOpen={setOpen}
          reduce={reduce}
        />
      ))}
      <PinterestEnd />
    </>
  );

  const trackPadding =
    "pl-5 pr-5 sm:pl-8 sm:pr-8 lg:pl-[max(2rem,calc((100vw-72rem)/2))] lg:pr-[max(2rem,calc((100vw-72rem)/2))]";

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="gallery"
        aria-labelledby="gallery-title"
        className="relative scroll-mt-0 bg-ink text-white"
      >
        {reduce ? (
          /* Reduced motion: no pinning, a plain swipeable row */
          <div className="py-20 sm:py-28">
            <ul
              className={`flex snap-x snap-mandatory items-center gap-6 overflow-x-auto pb-6 [&>li]:snap-start ${trackPadding}`}
            >
              {items}
            </ul>
          </div>
        ) : (
          <div ref={outerRef} className="h-[calc(100lvh+300vw)]">
            <div className="sticky top-0 h-lvh overflow-clip">
              {/* Faint word drifting behind the art */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-[calc(50svh-0.5em)] select-none text-[34vw] font-black leading-none tracking-[-0.05em] text-white/[0.035]"
              >
                <motion.div
                  style={{ x: wordX }}
                  className="whitespace-nowrap pl-[5vw]"
                >
                  ARTWORK
                </motion.div>
              </div>

              <div className="flex h-svh items-center">
                <motion.ul
                  ref={trackRef}
                  style={{ x }}
                  className={`flex w-max items-center gap-6 will-change-transform sm:gap-10 ${trackPadding}`}
                >
                  {items}
                </motion.ul>
              </div>

              {/* Counter + progress line, kept above the mobile toolbar */}
              <div className="pointer-events-none absolute inset-x-0 top-[calc(100svh-4.5rem)] container-page">
                <div className="flex items-center gap-4">
                  <span className="eyebrow w-16 text-sceptre-300 tabular-nums">
                    {String(current).padStart(2, "0")} /{" "}
                    {String(ART.length).padStart(2, "0")}
                  </span>
                  <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      style={{ scaleX: progress }}
                      className="h-full origin-left rounded-full bg-sceptre-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {open !== null && (
            <Lightbox index={open} onClose={close} onStep={step} />
          )}
        </AnimatePresence>
      </section>
    </MotionConfig>
  );
}
