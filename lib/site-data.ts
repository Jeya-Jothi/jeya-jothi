export const SITE = {
  name: "Jeya Jothi S",
  role: "Frontend Developer",
  email: "jeyajothi108@gmail.com",
  location: "Tenkasi, Tamil Nadu",
  // Set NEXT_PUBLIC_SITE_URL in Vercel once you have your final domain
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jeya-jothi.vercel.app",
  description:
    "Jeya Jothi S is a frontend developer from Tamil Nadu, India, building fast, responsive and accessible web interfaces with React, Next.js, TypeScript and Tailwind CSS.",
  // Put your PDF in /public with exactly this file name
  resume: "/Jeya_Jothi_Resume.pdf",
} as const;

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
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
