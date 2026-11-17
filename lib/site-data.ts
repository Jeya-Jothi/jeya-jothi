export const GITHUB_URL = "https://github.com/Jeya-Jothi";

export const SITE = {
  name: "Jeya Jothi",
  role: "Frontend Developer",
  email: "jeyajothi108@gmail.com",
  location: "Tenkasi, Tamil Nadu",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once you have your final domain
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jeya-jothi.vercel.app",
  description:
    "Jeya Jothi S is a frontend developer from Tamil Nadu, India, building fast, responsive and accessible web interfaces with React, Next.js, TypeScript and Tailwind CSS.",
  // Put your PDF in /public with exactly this file name
  resume: "/Jeya Jothi - Resume.pdf",
} as const;

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/Jeya-Jothi" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jeya-jothi-841277211",
  },
  { label: "Email", href: `mailto:${SITE.email}` },
] as const;

/* Skills section content (taken from the resume) */
export const SKILL_GROUPS = [
  {
    id: "frontend",
    title: "Frontend Development",
    blurb: "Interfaces built to be fast, responsive and accessible.",
    skills: [
      "Next.js",
      "React.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Bootstrap",
    ],
  },
  {
    id: "design",
    title: "UI/UX Design",
    blurb: "From Figma to polished, consistent layouts.",
    skills: [
      "Figma",
      "UI Design",
      "Responsive Design",
      "Layout Design",
      "Typography",
      "Component Design",
      "Visual Hierarchy",
      "Design-to-Code",
    ],
  },
  {
    id: "ai",
    title: "AI-Assisted Tools",
    blurb: "Workflows that speed up design and development.",
    skills: ["Stitch AI", "ChatGPT", "Claude", "GitHub Copilot"],
  },
  {
    id: "tools",
    title: "Development Tools",
    blurb: "Everyday tooling for shipping and testing.",
    skills: ["Git", "GitHub", "VS Code", "Postman", "REST API Integration"],
  },
  {
    id: "backend",
    title: "Backend",
    blurb: "Server-side basics to work with real APIs.",
    note: "Working knowledge",
    skills: ["Node.js", "Express.js"],
  },
] as const;

export type ProjectKind = "production" | "personal";

export type Project = {
  slug: string;
  title: string;
  /** Short mark shown on the placeholder (falls back to the title) */
  short?: string;
  kind: ProjectKind;
  /** Small label above the title */
  context: string;
  summary: string;
  tags: readonly string[];
  live?: string;
  repo?: string;
  status: "live" | "private";
  /** Grid size on desktop: lg = 4 of 6 columns, md = 3, sm = 2 */
  size: "lg" | "md" | "sm";
  image: string;
};

export const PROJECTS: readonly Project[] = [
  /* ---- Production: built at Growify India (Mar 2026 - Nov 2026) ---- */
  {
    slug: "gbc",
    title: "Growify Business Consultancy",
    short: "GBC",
    kind: "production",
    context: "Growify India · Full website",
    summary:
      "Independently designed and developed the complete website, from UI design to implementation. Responsive layouts with a focus on professional branding and user experience.",
    tags: ["UI design to code", "Branding", "Responsive"],
    live: "https://growify-business-consultancy.vercel.app",
    status: "live",
    size: "lg",
    image: "/projects/gbc.png",
  },
  {
    slug: "growify-india",
    title: "Growify India",
    kind: "production",
    context: "Company website",
    summary:
      "Designed and developed website sections and responsive frontend interfaces, with a focus on visual consistency and modern web presentation.",
    tags: ["Website sections", "Responsive"],
    live: "https://growifyindia.com",
    status: "live",
    size: "sm",
    image: "/projects/growify-india.png",
  },
  {
    slug: "school-sanchalak",
    title: "School Sanchalak",
    kind: "production",
    context: "School management platform",
    summary:
      "Designed and developed the platform's landing-page interface, communicating product features through clear layouts and responsive UI.",
    tags: ["SaaS", "Landing page", "Responsive"],
    live: "https://academiaflow.growifyindia.com",
    status: "live",
    size: "md",
    image: "/projects/school-sanchalak.png",
  },
  {
    slug: "v-fixer",
    title: "V-Fixer",
    kind: "production",
    context: "Business website",
    summary:
      "Designed and developed the landing-page interface, focused on responsive presentation and clear content structure.",
    tags: ["Business site", "Landing page", "Responsive"],
    live: "https://vfixerchemical.com",
    status: "live",
    size: "md",
    image: "/projects/v-fixer.png",
  },
  {
    slug: "hrm-growify",
    title: "HRM Growify",
    kind: "production",
    context: "HR management platform",
    summary:
      "A SaaS HR management product I worked on as part of my frontend work at Growify India, designing and building its web interfaces.",
    tags: ["SaaS", "HR platform"],
    status: "private",
    size: "md",
    image: "/projects/hrm-growify.webp",
  },
  {
    slug: "founders-portfolio",
    title: "Founder's Portfolio",
    kind: "production",
    context: "Growify India · Portfolio",
    summary:
      "Designed and developed the founder's portfolio, focusing on responsive UI and visual consistency.",
    tags: ["Portfolio", "Responsive UI"],
    status: "private",
    size: "md",
    image: "/projects/founders-portfolio.png",
  },

  /* ---- Personal ---- */
  {
    slug: "play-nft",
    title: "Play NFT",
    kind: "personal",
    context: "NFT marketplace UI",
    summary:
      "A modern, responsive web app for exploring digital artworks and NFT collections, built around clean UI and smooth interactions.",
    tags: ["JavaScript", "Responsive", "UI"],
    live: "https://play-nft-e07i.onrender.com",
    repo: "https://github.com/Jeya-Jothi/Play-NFT",
    status: "live",
    size: "md",
    image: "/projects/play-nft.png",
  },
  {
    slug: "bricks-dashboard",
    title: "Bricks Dashboard",
    kind: "personal",
    context: "Personal project",
    summary: "A personal dashboard interface project, deployed on Vercel.",
    tags: ["Dashboard", "UI"],
    live: "https://sms-bricks.vercel.app",
    status: "live",
    size: "md",
    image: "/projects/bricks-dashboard.png",
  },
];
