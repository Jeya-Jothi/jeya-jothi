"use client";

import KilnWordmarkFooter, {
  type KilnLink,
} from "@/components/ui/kiln-wordmark-footer";
import { NAV_LINKS, SITE, SOCIAL_LINKS } from "@/lib/site-data";

const toLink = (l: { label: string; href?: string }): KilnLink => ({
  label: l.label,
  href: l.href,
});

const nav = NAV_LINKS.map(toLink);
const navigation: KilnLink[][] = [nav.slice(0, 3), nav.slice(3)].filter(
  (c) => c.length,
);
const socials: KilnLink[][] = [SOCIAL_LINKS.map(toLink)];
const legal = SOCIAL_LINKS.filter((l) => l.href?.startsWith("http")).map(
  toLink,
);

export default function Footer() {
  return (
    <>
      <style>{`
      .kwf .kwf-top { min-height: 10cqw; }
      @container (max-width: 720px) {
        .kwf .kwf-top { min-height: 44cqw; }
      }
    `}</style>
      <KilnWordmarkFooter
        brand={SITE.name}
        wordmark="Jeya Jothi"
        motto={["Have an idea?", "Let's build it."]}
        address={[SITE.role, "↳ Tenkasi, Tamil Nadu - India"]}
        navigationTitle="Navigate"
        navigation={navigation}
        followTitle="Connect"
        socials={socials}
        year={2026}
        registry="All rights reserved"
        legal={legal}
        surface="#840016"
        deep="#3a000a"
        ink="#fdf3f4"
        paper="#3a000a"
        fontSans="var(--font-sans), system-ui, sans-serif"
        weight={0.9}
        defaultTile={0}
      />
    </>
  );
}
