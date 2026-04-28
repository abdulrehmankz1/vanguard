"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Variant = "default" | "hover" | "explore";
type Theme = "dark" | "light";

const PALETTE: Record<Theme, {
  dotBg: string;
  dotGlow: string;
  ringDefault: string;
  ringHover: string;
  exploreBg: string;
  exploreText: string;
}> = {
  dark: {
    dotBg: "#C8F400",
    dotGlow: "rgba(200, 244, 0, 0.6)",
    ringDefault: "rgba(240, 237, 230, 0.35)",
    ringHover: "#C8F400",
    exploreBg: "#C8F400",
    exploreText: "#050505",
  },
  light: {
    dotBg: "#050505",
    dotGlow: "rgba(5, 5, 5, 0.35)",
    ringDefault: "rgba(5, 5, 5, 0.35)",
    ringHover: "#050505",
    exploreBg: "#050505",
    exploreText: "#C8F400",
  },
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>("default");
  const [theme, setTheme] = useState<Theme>("dark");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    let seeded = false;
    let lastThemeCheck = 0;
    const onMove = (e: MouseEvent) => {
      if (!seeded) {
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        gsap.set(ring, { x: e.clientX, y: e.clientY });
        seeded = true;
      } else {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      }

      // Throttled theme re-check from the actual stack of elements at the
      // pointer position. Catches cases where an element under the cursor
      // dynamically gains/loses `data-cursor-theme` (e.g. cards toggling
      // light on hover) — `mouseover` alone misses those.
      const now = performance.now();
      if (now - lastThemeCheck < 60) return;
      lastThemeCheck = now;
      const stack = document.elementsFromPoint(e.clientX, e.clientY);
      let nextTheme: Theme = "dark";
      for (const el of stack) {
        const themeEl = (el as HTMLElement).closest("[data-cursor-theme]");
        if (themeEl) {
          const v = themeEl.getAttribute("data-cursor-theme") as Theme;
          if (v === "light" || v === "dark") {
            nextTheme = v;
            break;
          }
        }
      }
      setTheme((prev) => (prev === nextTheme ? prev : nextTheme));
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Theme is also evaluated on every move (above), but updating it here
      // makes the swap feel instant when crossing element boundaries.
      const themeEl = target.closest("[data-cursor-theme]");
      const themeVal =
        (themeEl?.getAttribute("data-cursor-theme") as Theme) ?? "dark";
      setTheme(themeVal);

      if (target.closest("[data-cursor='explore']")) setVariant("explore");
      else if (
        target.closest(
          "a, button, input, [role='button'], [data-cursor='hover']",
        )
      )
        setVariant("hover");
      else setVariant("default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isExplore = variant === "explore";
  const isHover = variant === "hover";
  const colors = PALETTE[theme];

  return (
    <>
      {/* Leading dot — marks the exact pointer position */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <div
          className="rounded-full -translate-x-1/2 -translate-y-1/2 transition-[width,height,opacity,background-color,box-shadow] duration-200 ease-out"
          style={{
            width: isHover || isExplore ? 0 : 6,
            height: isHover || isExplore ? 0 : 6,
            opacity: isHover || isExplore ? 0 : 1,
            background: colors.dotBg,
            boxShadow: `0 0 12px ${colors.dotGlow}`,
          }}
        />
      </div>

      {/* Trailing ring — morphs per variant + theme */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
      >
        <div
          className="rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color,color] duration-300 ease-out"
          style={{
            width: isExplore ? 92 : isHover ? 56 : 34,
            height: isExplore ? 92 : isHover ? 56 : 34,
            background: isExplore ? colors.exploreBg : "transparent",
            border: isExplore
              ? "0px solid transparent"
              : isHover
                ? `1.5px solid ${colors.ringHover}`
                : `1px solid ${colors.ringDefault}`,
            color: colors.exploreText,
            fontSize: isExplore ? 11 : 0,
            letterSpacing: "0.25em",
            fontFamily: "var(--font-grotesk), sans-serif",
            fontWeight: 500,
            textTransform: "uppercase",
          }}
        >
          {isExplore && "Explore"}
        </div>
      </div>
    </>
  );
}
