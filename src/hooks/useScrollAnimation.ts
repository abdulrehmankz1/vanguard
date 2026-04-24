"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scopes a GSAP context to a ref so all ScrollTriggers created inside
 * are cleaned up automatically on unmount.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  setup: (ctx: gsap.Context) => void,
  deps: React.DependencyList = [],
) {
  const scopeRef = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      setup(ctx);
    }, scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scopeRef;
}
