"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Page-wide smooth scrolling powered by Lenis.
 *
 * - Smooths every wheel / trackpad / scrollbar interaction (no click required).
 * - Intercepts every `<a>` whose href contains a hash:
 *     - Same-page (`#foo` or `/current-path#foo`) → Lenis scrollTo, no nav.
 *     - Cross-page (`/other-path#foo`) → does nothing; Next.js Link routes
 *       normally and the route-change effect below scrolls to the hash on
 *       arrival.
 * - Drives Lenis from GSAP's ticker and forwards each tick to ScrollTrigger,
 *   so existing scroll-tied animations (pin, scrub, parallax) stay in sync.
 *
 * Touch input is left native — Lenis-on-touch fights platform momentum.
 */
export default function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const getOffset = () => {
      const header = document.querySelector("header");
      return header ? -header.getBoundingClientRect().height : -76;
    };

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!link) return;
      if (link.target === "_blank") return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Parse href into [path, hash]
      let path: string;
      let hash: string;
      if (href.startsWith("#")) {
        path = "";
        hash = href.slice(1);
      } else {
        const idx = href.indexOf("#");
        if (idx === -1) return; // no hash → not our concern
        path = href.slice(0, idx);
        hash = href.slice(idx + 1);
      }

      // Cross-page link → don't preventDefault; let Next.js navigate.
      // The pathname-change effect below will handle the hash on arrival.
      const currentPath = window.location.pathname;
      const linkPath = path === "" ? currentPath : path;
      const samePage =
        linkPath === currentPath ||
        linkPath + "/" === currentPath ||
        linkPath === currentPath + "/";
      if (!samePage) return;

      const dest =
        hash === "" || hash === "home"
          ? 0
          : (document.getElementById(hash) as HTMLElement | null);
      if (dest === null) return;

      e.preventDefault();
      lenis.scrollTo(dest as number | HTMLElement, {
        offset: getOffset(),
        duration: 1.4,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // After a route change (e.g. /thank-you → /#manifesto), if the URL has a
  // hash, scroll smoothly to the matching element. Native browser scroll-to-
  // hash doesn't fire reliably with Lenis hijacking the scroll position.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const lenis = lenisRef.current;
    if (!lenis) return;
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Wait one paint so the destination section has measured layout.
    const t = setTimeout(() => {
      const dest =
        hash === "home"
          ? 0
          : (document.getElementById(hash) as HTMLElement | null);
      if (dest === null) return;
      const header = document.querySelector("header");
      const offset = header
        ? -header.getBoundingClientRect().height
        : -76;
      lenis.scrollTo(dest as number | HTMLElement, {
        offset,
        duration: 1.2,
        easing: (t2: number) => 1 - Math.pow(1 - t2, 3),
      });
    }, 120);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
