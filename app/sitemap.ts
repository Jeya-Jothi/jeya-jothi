import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
// move sitemap.ts to app folder to fix the error "The route /sitemap.xml is not defined in your app router"
