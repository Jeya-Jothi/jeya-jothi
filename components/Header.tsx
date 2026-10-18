"use client";

import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { NAV_LINKS, SITE } from "@/lib/site-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v12m0 0 5-5m-5 5-5-5M5 20h14" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      className="fixed w-full top-0 z-50"
    >
      <nav
        aria-label="Primary"
        className={`relative flex items-center justify-between border px-3 py-2.5 text-white backdrop-blur-xl transition-all duration-300 sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr] ${
          scrolled
            ? "border-white/15 bg-ink/90 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.7)]"
            : "border-white/10 bg-ink"
        }`}
      >
        {/* Logo */}
        <a
          href="#home"
          className="flex w-fit items-center gap-3 rounded-full pr-3 focus-visible:outline-white"
          aria-label="Jeya Jothi, back to top"
        >
          <span className="grid size-10 place-items-center rounded-xl bg-sceptre-600 font-mono text-xs tracking-wider text-white sm:rounded-2xl">
            JJ
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm text-white">Jeya Jothi</span>
            <span className="hidden text-xs text-white/60 sm:block">
              {SITE.role}
            </span>
          </span>
        </a>

        {/* Desktop links (centered) */}
        <ul
          className="hidden items-center md:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onMouseEnter={() => setHovered(link.label)}
                onFocus={() => setHovered(link.label)}
                onBlur={() => setHovered(null)}
                className="relative isolate block rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-white"
              >
                {hovered === link.label && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA (right) */}
        <div className="hidden justify-self-end md:block">
          <a
            href={SITE.resume}
            download
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm text-ink transition-colors hover:bg-sceptre-100 focus-visible:outline-white"
          >
            Resume
            <DownloadIcon />
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-10 place-items-center rounded-xl bg-white/10 transition-colors hover:bg-white/15 focus-visible:outline-white md:hidden"
        >
          <span className="relative block h-3 w-5">
            <motion.span
              className="absolute left-0 top-0 h-px w-full bg-white"
              animate={open ? { y: 5.5, rotate: 45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-px w-full bg-white"
              animate={open ? { y: -5.5, rotate: -45 } : { y: 0, rotate: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </span>
        </button>

        {/* Scroll progress line along the bottom edge */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: scrollYProgress }}
          className="pointer-events-none absolute inset-x-6 bottom-0 h-0.5 origin-left rounded-full bg-sceptre-400"
        />

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="absolute inset-x-0 top-full mt-2 origin-top rounded-2xl border border-white/10 bg-ink p-3 shadow-[0_24px_60px_-24px_rgb(0_0_0/0.7)] md:hidden"
            >
              <ul className="flex flex-col">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3, ease: EASE }}
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <a
                href={SITE.resume}
                download
                className="group mt-2 flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-ink focus-visible:outline-white"
              >
                Resume
                <DownloadIcon />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
