import type { Metadata, Viewport } from "next";
import { Oxygen, Geist_Mono } from "next/font/google";
import "./globals.css";

/* ---------------------------------------------------------------
   Fonts
   Oxygen: main font for the whole site.
   --------------------------------------------------------------- */
const oxygen = Oxygen({
  variable: "--font-oxygen",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// Small monospace accent for labels, chips and code snippets
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ---------------------------------------------------------------
   Site config: change SITE_URL once your domain is live
   --------------------------------------------------------------- */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://jeya-jothi-portfolio.onrender.com";
const SITE_NAME = "Jeya Jothi";
const TITLE = "Jeya Jothi | Frontend Developer (React, Next.js)";
const DESCRIPTION =
  "Jeya Jothi is a Frontend Developer from Tenkasi, Tamil Nadu, building fast, responsive web applications with React, Next.js, TypeScript and Tailwind CSS.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Jeya Jothi",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Jeya Jothi", url: SITE_URL }],
  creator: "Jeya Jothi",
  keywords: [
    "Jeya Jothi",
    "Jeya Jothi",
    "Jeya Jothi Frontend Developer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "Portfolio",
    "Tamil Nadu",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_IN",
    // Add app/opengraph-image.png (1200x630) and Next.js wires it up automatically
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // verification: { google: "PASTE_SEARCH_CONSOLE_TOKEN" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#240006",
  colorScheme: "dark",
};

/* Structured data: helps Google connect your name to this site */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jeya Jothi",
  alternateName: "Jeya Jothi",
  url: SITE_URL,
  jobTitle: "Frontend Developer",
  description: DESCRIPTION,
  email: "mailto:jeyajothi108@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tenkasi",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  alumniOf: "Francis Xavier Engineering College",
  worksFor: { "@type": "Organization", name: "Growify India" },
  knowsAbout: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "UI Development",
  ],
  sameAs: [
    // Replace with your real profile URLs
    "https://github.com/Jeya-Jothi",
    "https://www.linkedin.com/in/jeya-jothi-841277211",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oxygen.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-sceptre-950 text-white">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
