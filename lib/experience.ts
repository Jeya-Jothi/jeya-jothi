/* Experience section content, newest role first.
   Everything below comes from the resume; no numbers are invented. */

import { PROJECTS } from "@/lib/site-data";

export type ExperienceItem = {
  id: string;
  title: string;
  body: string;
  tags: readonly string[];
};

export type RoleStat = { label: string; value: number | string };

export type Role = {
  id: string;
  watermark: string;
  kind: "professional" | "internship";
  company: string;
  role: string;
  mode: string;
  period: string;
  months: number;
  summary: string;
  stats: readonly RoleStat[];
  items: readonly ExperienceItem[];
  cta?: { label: string; href: string };
};

const PRODUCTION_COUNT = PROJECTS.filter((p) => p.kind === "production").length;

export const EXPERIENCE: readonly Role[] = [
  {
    id: "growify",
    watermark: "GROWIFY INDIA",
    kind: "professional",
    company: "Growify India",
    role: "Frontend Developer",
    mode: "Remote",
    period: "Mar 2026 – Nov 2026",
    months: 8,
    summary:
      "Frontend developer on a remote basis, designing and building websites, landing pages and SaaS interfaces.",
    stats: [
      { label: "Months", value: 8 },
      { label: "Production projects", value: PRODUCTION_COUNT },
    ],
    cta: { label: "See the projects", href: "#projects" },
    items: [
      {
        id: "sites",
        title: "Websites and landing pages for business and SaaS products",
        body: "Designed and developed websites and landing pages across multiple business and SaaS projects.",
        tags: ["HRM Growify", "School Sanchalak", "Growify India", "V-Fixer"],
      },
      {
        id: "gbc",
        title: "A complete website, built independently",
        body: "Took Growify Business Consultancy from UI design to implementation on my own, with responsive layouts and a focus on professional branding and user experience.",
        tags: [
          "Growify Business Consultancy",
          "UI design to code",
          "Responsive",
        ],
      },
      {
        id: "founder",
        title: "The founder's portfolio",
        body: "Designed and developed the founder's portfolio, focusing on responsive UI and visual consistency.",
        tags: ["Portfolio", "Responsive UI", "Visual consistency"],
      },
      {
        id: "workflow",
        title: "Performance and a faster workflow",
        body: "Improved frontend performance, and used Figma and AI-assisted tools to speed up UI design and development.",
        tags: ["Frontend performance", "Figma", "AI-assisted tools"],
      },
    ],
  },
  {
    id: "technohacks",
    watermark: "TECHNOHACKS",
    kind: "internship",
    company: "Technohacks Edutech",
    role: "Web Development Intern",
    mode: "Remote",
    period: "May 2025 – Jun 2025",
    months: 2,
    summary:
      "A remote web development internship where I built responsive interfaces with HTML, CSS and JavaScript.",
    stats: [
      { label: "Months", value: 2 },
      { label: "Certificate", value: "Jun 2025" },
    ],
    items: [
      {
        id: "interfaces",
        title: "Responsive web interfaces",
        body: "Developed responsive web interfaces using HTML, CSS and JavaScript.",
        tags: ["HTML", "CSS", "JavaScript"],
      },
      {
        id: "components",
        title: "Interactive components and better layouts",
        body: "Implemented interactive frontend components and improved layouts across different screen sizes.",
        tags: ["Components", "Responsive layouts"],
      },
      {
        id: "workflow",
        title: "A real development workflow",
        body: "Practiced frontend development workflows and collaborated on implementation and testing.",
        tags: ["Workflow", "Collaboration", "Testing"],
      },
    ],
  },
];
