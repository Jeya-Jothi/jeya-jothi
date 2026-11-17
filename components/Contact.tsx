"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { motion, MotionConfig, useReducedMotion } from "motion/react";

/* ---------- Edit these ---------- */
const CONTACT = {
  email: "jeyajothi108@gmail.com",
  whatsapp: "918270907155",
  whatsappLabel: "+91 8270907155",
  availability: "Open to remote frontend roles",
  replyTime: "I usually reply within a day.",
};

const QUOTES = [
  "Good work starts with a good conversation.",
  "Behind every brief is a person. I'd like to meet yours.",
  "No pitch needed. Just tell me what you're building.",
  "Great interfaces are made by people who listen first.",
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const WA_HREF = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
  "Hi Jeya, I found your portfolio and wanted to say hello.",
)}`;
const MAIL_HREF = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
  "Hello from your portfolio",
)}`;

/* ---------- Icons ---------- */

function Icon({
  children,
  className = "size-5",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const MailIcon = () => (
  <Icon>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </Icon>
);
const ChatIcon = () => (
  <Icon>
    <path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12Z" />
    <path d="M9 10c.5 2 2 3.5 4 4l1.2-1.2a.8.8 0 0 1 .8-.2l1.6.6" />
  </Icon>
);
const CopyIcon = () => (
  <Icon>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6.5A2.5 2.5 0 0 1 7.5 4H15" />
  </Icon>
);
const CheckIcon = () => (
  <Icon>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Icon>
);
const ArrowUpRight = () => (
  <Icon className="size-6">
    <path d="M7 17 17 7M8 7h9v9" />
  </Icon>
);

/* ---------- Building blocks ---------- */

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

/** One quote. Words rise in when active, drop out when not. All quotes share one grid cell. */
function QuoteLine({ text, active }: { text: string; active: boolean }) {
  return (
    <motion.p
      aria-hidden={!active}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      className={`col-start-1 row-start-1 text-balance text-[clamp(1.75rem,5.5vw,3.25rem)] leading-[1.1] tracking-[-0.03em] text-white ${
        active ? "" : "pointer-events-none"
      }`}
    >
      {`“${text}”`.split(" ").map((word, i) => (
        <span
          key={i}
          className="-my-[0.1em] mr-[0.25em] inline-block overflow-hidden py-[0.1em] align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: {
                y: "-110%",
                opacity: 0,
                transition: { duration: 0.35, ease: EASE },
              },
              show: {
                y: "0%",
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: EASE,
                  delay: 0.15 + i * 0.05,
                },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.p>
  );
}

function QuoteRotator({ reduce }: { reduce: boolean }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % QUOTES.length),
      5500,
    );
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div>
      <div className="grid">
        {QUOTES.map((q, i) => (
          <QuoteLine key={q} text={q} active={i === active} />
        ))}
      </div>

      <div className="mt-6 flex items-center">
        {QUOTES.map((q, i) => (
          <button
            key={q}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show quote ${i + 1}`}
            aria-current={i === active}
            className="flex h-8 items-center px-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                i === active ? "w-6 bg-white" : "w-1.5 bg-white/30"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/** Big background text that scrolls forever. */
function Marquee({ reduce }: { reduce: boolean }) {
  const line = "SAY HELLO ✦ LET'S BUILD SOMETHING ✦ ";
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 select-none overflow-hidden"
    >
      <motion.div
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        style={{ willChange: "transform" }}
        className="flex w-max whitespace-nowrap text-[clamp(4rem,14vw,10rem)] font-black leading-none tracking-[-0.04em] text-white/[0.05]"
      >
        <span>{line.repeat(3)}</span>
        <span>{line.repeat(3)}</span>
      </motion.div>
    </div>
  );
}

/** Large link row. A white fill sweeps across on hover. */
function ContactRow({
  href,
  icon,
  title,
  value,
  external,
  action,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  value: string;
  external?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-stretch gap-3">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group relative flex min-h-20 min-w-0 flex-1 items-center gap-4 overflow-hidden rounded-2xl border border-white/20 bg-white/[0.06] p-4 backdrop-blur-sm transition-colors duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:p-5"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
        />
        <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-colors duration-500 group-hover:border-ink/20 group-hover:text-ink">
          {icon}
        </span>
        <span className="relative min-w-0 flex-1">
          <span className="block text-lg text-white transition-colors duration-500 group-hover:text-ink sm:text-xl">
            {title}
          </span>
          <span className="block truncate text-sm text-white/70 transition-colors duration-500 group-hover:text-ink/70 sm:text-base">
            {value}
          </span>
        </span>
        <span className="relative text-white transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink">
          <ArrowUpRight />
        </span>
      </a>
      {action}
    </div>
  );
}

function CopyButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="grid w-14 shrink-0 place-items-center rounded-2xl border border-white/20 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-16"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

/* ---------- Section ---------- */

export default function Contact() {
  const reduce = useReducedMotion() ?? false;
  const panelRef = useRef<HTMLDivElement>(null);

  // Light that follows the pointer. Updates CSS vars only, no re-render.
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="contact"
        aria-labelledby="contact-title"
        className="scroll-mt-20 bg-white py-20 sm:py-28"
      >
        <div className="container-page">
          <header className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">Contact</p>
              <h2
                id="contact-title"
                className="mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-[0.95] tracking-[-0.04em] text-ink"
              >
                <RevealText text="Let's talk" />
              </h2>
            </div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              className="max-w-sm text-pretty text-sceptre-700 sm:text-lg"
            >
              Email for work. WhatsApp for a quick hello. Either way, a real
              person replies.
            </motion.p>
          </header>

          <motion.div
            ref={panelRef}
            onPointerMove={onMove}
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="group/panel relative overflow-hidden rounded-[2rem] bg-sceptre-700 p-6 pb-24 text-white sm:p-10 sm:pb-32 lg:p-14 lg:pb-36"
          >
            {/* Cursor light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/panel:opacity-100"
              style={{
                background:
                  "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgb(255 255 255 / 0.12), transparent 60%)",
              }}
            />

            {/* Slowly rotating star */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="currentColor"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
              className="pointer-events-none absolute -right-24 -top-24 size-72 text-white/[0.07] sm:size-96"
            >
              <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0z" />
            </motion.svg>

            <Marquee reduce={reduce} />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-14">
              {/* Left: human touch */}
              <div className="flex flex-col gap-8">
                <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/20 px-4 py-2 text-sm text-white/90">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-300" />
                  </span>
                  {CONTACT.availability}
                </span>

                <QuoteRotator reduce={reduce} />

                <p className="text-sm text-sceptre-200">{CONTACT.replyTime}</p>
              </div>

              {/* Right: contact rows, staggered in */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
                className="flex flex-col gap-4"
              >
                {[
                  <ContactRow
                    key="mail"
                    href={MAIL_HREF}
                    icon={<MailIcon />}
                    title="Email"
                    value={CONTACT.email}
                    action={<CopyButton />}
                  />,
                  <ContactRow
                    key="wa"
                    href={WA_HREF}
                    external
                    icon={<ChatIcon />}
                    title="WhatsApp"
                    value={CONTACT.whatsappLabel}
                  />,
                ].map((row) => (
                  <motion.div
                    key={row.key}
                    variants={{
                      hidden: { opacity: 0, x: 40 },
                      show: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.8, ease: EASE },
                      },
                    }}
                  >
                    {row}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
