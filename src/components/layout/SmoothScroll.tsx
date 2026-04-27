"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Page-wide smooth scrolling powered by Lenis.
 *
 * - Smooths every wheel / trackpad / scrollbar interaction (no click required).
 * - Intercepts every `<a href="#…">` click on the page and routes it through
 *   `lenis.scrollTo(...)` so anchor navigation eases instead of jumping.
 * - Drives Lenis from GSAP's ticker and forwards each tick to ScrollTrigger,
 *   so existing scroll-tied animations (pin, scrub, parallax) stay in sync.
 *
 * Touch input is left native — Lenis-on-touch tends to fight platform momentum.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Keep ScrollTrigger in sync with Lenis's interpolated scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Read the navbar height so anchor jumps land *below* the fixed header.
    const getOffset = () => {
      const header = document.querySelector("header");
      return header ? -header.getBoundingClientRect().height : -76;
    };

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const link = target.closest(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      if (!link) return;
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      if (link.target === "_blank") return;

      const id = href.slice(1);
      const dest =
        id === "" || id === "home"
          ? 0
          : (document.getElementById(id) as HTMLElement | null);
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
    };
  }, []);

  return null;
}
