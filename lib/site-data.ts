/* Single source of truth for links and contact details.
   Header, Footer, SEO and any future section import from here. */

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
