import type { Metadata, Viewport } from "next";
import { SITE, SOCIAL_LINKS } from "@/lib/site-data";

const TITLE = `${SITE.name} | ${SITE.role}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: TITLE,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: `${SITE.name} Portfolio`,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  keywords: [
    "Jeya Jothi",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Tailwind CSS",
    "UI Developer",
    "Portfolio",
    "Tamil Nadu",
    "India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${SITE.name} Portfolio`,
    title: TITLE,
    description: SITE.description,
    locale: "en_IN",
    // /opengraph-image is generated automatically from opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#240006",
  colorScheme: "light",
};

/** Person + WebSite structured data for Google rich results. */
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE.url}/#person`,
      name: SITE.name,
      alternateName: "Jeya Jothi",
      jobTitle: SITE.role,
      url: SITE.url,
      email: SITE.email,
      description: SITE.description,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tenkasi",
        addressRegion: "Tamil Nadu",
        addressCountry: "IN",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Francis Xavier Engineering College",
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Responsive Web Design",
        "UI Design",
        "Figma",
      ],
      sameAs: SOCIAL_LINKS.filter((l) => l.href.startsWith("http")).map(
        (l) => l.href,
      ),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: SITE.url,
      name: `${SITE.name} Portfolio`,
      description: SITE.description,
      inLanguage: "en",
      publisher: { "@id": `${SITE.url}/#person` },
    },
  ],
};
