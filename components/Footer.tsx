"use client";

import { motion } from "motion/react";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/lib/site-data";
import { Suspense } from "react";
import Year from "@/components/Year";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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

const linkClass =
  "inline-block text-white/90 transition-colors duration-200 hover:text-white hover:underline hover:underline-offset-4";

export default function Footer() {
  return (
    <footer id="contact">
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative overflow-hidden bg-sceptre-600 text-white"
      >
        <div className="px-6 pt-10 sm:px-10 lg:px-14 lg:pt-14">
          {/* Big email CTA */}
          <p className="eyebrow text-sceptre-200">Contact</p>
          <a
            href={`mailto:${SITE.email}`}
            className="group mt-4 flex items-center justify-between gap-6 border-b border-white/20 pb-8"
          >
            <span className="break-all text-[clamp(1.35rem,5.2vw,4.5rem)] leading-tight">
              {SITE.email}
            </span>
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:rotate-45 sm:size-16 lg:size-20">
              <ArrowUpRight className="size-1/2" />
            </span>
          </a>

          {/* Columns */}
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            <p className="max-w-xs text-sceptre-200">
              {SITE.role} building fast, responsive interfaces with React and
              Next.js.
            </p>

            <nav aria-label="Footer navigation">
              <p className="eyebrow mb-4 text-sceptre-200">Navigate</p>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="eyebrow mb-4 text-sceptre-200">Connect</p>
              <ul className="space-y-2">
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
                      className={`${linkClass} inline-flex items-center gap-1.5`}
                    >
                      {link.label}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-sceptre-200 sm:flex-row sm:items-center sm:justify-between">
            <p>
              ©{" "}
              <Suspense fallback="2026">
                <Year />
              </Suspense>{" "}
              {SITE.name}. All rights reserved.{" "}
            </p>
            <p>Designed and built in {SITE.location}.</p>
            <a
              href="#home"
              className="inline-flex items-center gap-1.5 text-white hover:underline hover:underline-offset-4"
            >
              Back to top
              <span aria-hidden="true">↑</span>
            </a>
          </div>
        </div>

        {/* Oversized watermark, cropped at the bottom */}
        <div
          aria-hidden="true"
          className="mt-6 h-[10.5vw] select-none overflow-hidden text-center"
        >
          <p className="text-[14.5vw] leading-[0.8] tracking-[-0.04em] text-sceptre-700">
            Jeya Jothi
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
