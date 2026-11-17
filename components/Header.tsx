"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from "motion/react";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/lib/site-data";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Two looks for the bar: dark at the very top, white frosted glass after scrolling.
   Every colour change is a CSS transition, so the switch is smooth. */
const THEMES = {
  dark: {
    nav: "border-white/10 bg-ink text-white",
    focus: "focus-visible:outline-white",
    role: "text-white/60",
    link: "text-white/70 hover:text-sceptre-950",
    pill: "bg-white",
    cta: "bg-white text-ink hover:bg-sceptre-100",
    toggle: "bg-white/10 text-white hover:bg-white/15",
    line: "bg-sceptre-400",
    menu: "border-white/10 bg-ink text-white shadow-[0_24px_60px_-24px_rgb(0_0_0/0.7)]",
    menuLink: "hover:bg-white/10 active:bg-white/10",
    menuNum: "text-sceptre-300",
    chip: "border-white/15 text-white/80 hover:bg-white/10 hover:text-white",
    divider: "border-white/10",
  },
  light: {
    nav: "border-sceptre-100 bg-white/70 text-ink shadow-[0_16px_48px_-20px_rgb(132_0_22/0.35)]",
    focus: "focus-visible:outline-sceptre-600",
    role: "text-sceptre-700",
    link: "text-ink/70 hover:text-white",
    pill: "bg-sceptre-600",
    cta: "bg-sceptre-600 text-white hover:bg-sceptre-700",
    toggle: "bg-sceptre-50 text-sceptre-700 hover:bg-sceptre-100",
    line: "bg-sceptre-600",
    menu: "border-sceptre-100 bg-white text-ink shadow-[0_24px_60px_-24px_rgb(132_0_22/0.4)]",
    menuLink: "hover:bg-sceptre-50 active:bg-sceptre-50",
    menuNum: "text-sceptre-500",
    chip: "border-sceptre-200 text-sceptre-700 hover:bg-sceptre-50",
    divider: "border-sceptre-100",
  },
} as const;

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    scale: 0.96,
    clipPath: "inset(0% 0% 100% 0% round 24px)",
    transition: { duration: 0.3, ease: EASE },
  },
  open: {
    opacity: 1,
    scale: 1,
    clipPath: "inset(0% 0% 0% 0% round 24px)",
    transition: {
      duration: 0.55,
      ease: EASE,
      when: "beforeChildren",
      delayChildren: 0.08,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  closed: { opacity: 0, y: 24 },
  open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/* ---------- Icons ---------- */

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

/** Three bars of different lengths that morph into an X. */
function MenuIcon({ open }: { open: boolean }) {
  const t = { duration: 0.4, ease: EASE };
  return (
    <span aria-hidden="true" className="relative block h-3.5 w-5">
      <motion.span
        className="absolute left-0 top-0 h-0.5 w-5 rounded-full bg-current"
        animate={open ? { y: 6, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={t}
      />
      <motion.span
        className="absolute right-0 top-1/2 -mt-px h-0.5 w-3 origin-right rounded-full bg-current"
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={t}
      />
      <motion.span
        className="absolute bottom-0 left-0 h-0.5 w-5 rounded-full bg-current"
        animate={open ? { y: -6, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={t}
      />
    </span>
  );
}

/* ---------- Header ---------- */

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Close the mobile menu with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const t = scrolled ? THEMES.light : THEMES.dark;

  return (
    <MotionConfig reducedMotion="user">
      {/* Dimmed backdrop behind the mobile menu; tap it to close */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          scrolled ? "px-3 pt-3 sm:px-4" : "px-0 pt-0"
        }`}
      >
        {/* At the top: full-width dark bar.
            After scrolling: a centred, rounded, white frosted-glass bar. */}
        <nav
          aria-label="Primary"
          className={`relative mx-auto flex w-full items-center justify-between border px-3 py-2.5 backdrop-blur-xl transition-[max-width,border-radius,background-color,border-color,box-shadow,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr] ${
            scrolled ? "max-w-5xl rounded-[2rem]" : "max-w-full rounded-none"
          } ${t.nav}`}
        >
          {/* Logo */}
          <a
            href="#home"
            className={`group flex w-fit items-center gap-3 rounded-full pr-3 ${t.focus}`}
            aria-label="Jeya Jothi, back to top"
          >
            <Image
              src="/jothi-logo.png"
              alt=""
              width={40}
              height={40}
              priority
              className="size-10 rounded-full transition-transform duration-500 ease-out group-hover:-rotate-12"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">Jeya Jothi</span>
              <span
                className={`hidden text-xs transition-colors duration-500 sm:block ${t.role}`}
              >
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
                  className={`relative isolate block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${t.link} ${t.focus}`}
                >
                  {hovered === link.label && (
                    <motion.span
                      layoutId="nav-pill"
                      className={`absolute inset-0 -z-10 rounded-full ${t.pill}`}
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                      }}
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
              className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition-colors ${t.cta} ${t.focus}`}
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
            className={`grid size-11 place-items-center rounded-full transition-colors duration-300 md:hidden ${t.toggle} ${t.focus}`}
          >
            <MenuIcon open={open} />
          </button>

          {/* Mobile menu panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                id="mobile-menu"
                variants={menuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                style={{ transformOrigin: "top right" }}
                className={`absolute inset-x-0 top-full mt-3 rounded-3xl border p-3 md:hidden ${t.menu}`}
              >
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link, i) => (
                    <motion.li key={link.href} variants={itemVariants}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center justify-between gap-4 rounded-2xl px-4 py-3.5 transition-colors ${t.menuLink} ${t.focus}`}
                      >
                        <span className="flex items-baseline gap-4">
                          <span
                            className={`font-mono text-xs tracking-[0.14em] ${t.menuNum}`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-2xl tracking-[-0.02em]">
                            {link.label}
                          </span>
                        </span>
                        <ArrowUpRight className="size-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-active:translate-x-0 group-active:opacity-100" />
                      </a>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  variants={itemVariants}
                  className={`mt-3 border-t pt-3 ${t.divider}`}
                >
                  <a
                    href={SITE.resume}
                    download
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-center gap-2 rounded-2xl px-5 py-3 transition-colors ${t.cta} ${t.focus}`}
                  >
                    Resume
                    <DownloadIcon />
                  </a>

                  <ul className="mt-3 flex flex-wrap gap-2">
                    {SOCIAL_LINKS.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          target={
                            link.href.startsWith("http") ? "_blank" : undefined
                          }
                          rel={
                            link.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition-colors ${t.chip} ${t.focus}`}
                        >
                          {link.label}
                          <ArrowUpRight className="size-3.5" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.header>
    </MotionConfig>
  );
}
