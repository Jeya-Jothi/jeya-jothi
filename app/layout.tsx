import { Oxygen, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  metadata as seoMetadata,
  viewport as seoViewport,
  jsonLd,
} from "@/lib/seo";

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

/* SEO config lives in lib/seo.ts, site details in lib/site-data.ts */
export const metadata = seoMetadata;
export const viewport = seoViewport;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${oxygen.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-ink">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
