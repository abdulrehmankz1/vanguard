/**
 * Single source of truth for site-wide metadata. Imported by:
 *   - src/app/layout.tsx (page <head> defaults)
 *   - src/app/robots.ts
 *   - src/app/sitemap.ts
 *
 * Override `NEXT_PUBLIC_SITE_URL` at build time per environment.
 */

const url =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://vanguard.example";

export const siteConfig = {
  name: "Vanguard",
  shortName: "Vanguard",
  url,
  title: "VANGUARD — A Political Movement For The Next Century",
  description:
    "The future is not given. It is taken. Join the 4.2M-strong coalition rebuilding the political infrastructure of the next century.",
  keywords: [
    "political movement",
    "policy",
    "manifesto",
    "campaigns",
    "vanguard",
    "organizing",
  ],
  themeColor: "#050505",
  ogImage: `${url}/og-image.svg`,
  twitter: "@vanguard",
} as const;

export type SiteConfig = typeof siteConfig;
