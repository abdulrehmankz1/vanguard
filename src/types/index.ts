/**
 * Cross-cutting type aliases. Add types here when they're shared by more
 * than one feature; keep feature-local types co-located with their component.
 */

import type { LucideIcon } from "lucide-react";

/** A 4-tuple cubic-bezier easing curve consumable by Framer Motion's `ease`. */
export type Ease = [number, number, number, number];

/** Generic card-style content used across sections. */
export type IconCard = {
  title: string;
  desc: string;
  icon: LucideIcon;
};

/** Anchor link record used by Navbar / Footer / SEO sitemap. */
export type NavLink = {
  label: string;
  href: string;
};
