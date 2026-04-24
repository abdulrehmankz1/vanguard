"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function useMagneticEffect<T extends HTMLElement>(strength: number = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.6,
      ease: "elastic.out(1, 0.35)",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.6,
      ease: "elastic.out(1, 0.35)",
    });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      xTo(x * strength);
      yTo(y * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}
