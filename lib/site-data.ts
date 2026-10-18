/* Single source of truth for links and contact details.
   Header, Footer and any future section import from here. */

export const SITE = {
  name: "Jeya Jothi S",
  role: "Frontend Developer",
  email: "jeyajothi108@gmail.com",
  location: "Tenkasi, Tamil Nadu",
  // Put your PDF in /public with exactly this file name
  resume: "/Jeya_Jothi_Resume.pdf",
} as const;

export const NAV_LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/YOUR_GITHUB" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/YOUR_LINKEDIN" },
  { label: "Email", href: `mailto:${SITE.email}` },
] as const;
