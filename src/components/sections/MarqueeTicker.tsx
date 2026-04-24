"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flame, Zap, Star, ArrowUpRight, Radio, Crosshair } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const SLOGANS = [
  "Seize The Future",
  "Power To The People",
  "Build. Organize. Win.",
  "Break The Cycle",
  "Code Is Politics",
  "New Deal For A New Century",
  "No Platform For Apathy",
  "The Movement Is Now",
];
const ICONS: LucideIcon[] = [Flame, Zap, Star, ArrowUpRight, Radio, Crosshair];

type RowProps = {
  direction: "left" | "right";
  accent: boolean;
  speed: number;
};

function Row({ direction, accent, speed }: RowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row) return;

    let tween: gsap.core.Tween | null = null;
    let rafId = 0;

    const start = () => {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth === 0) {
        rafId = requestAnimationFrame(start);
        return;
      }

      // Doubled track — scrolling one half's width is visually identical to x:0.
      // So a fromTo that ends on -halfWidth can repeat seamlessly with no wrap.
      if (direction === "left") {
        gsap.set(track, { x: 0 });
        tween = gsap.to(track, {
          x: -halfWidth,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
      } else {
        gsap.set(track, { x: -halfWidth });
        tween = gsap.to(track, {
          x: 0,
          duration: speed,
          ease: "none",
          repeat: -1,
        });
      }
    };
    start();

    // Smooth timeScale ramp = no blink on hover enter/leave.
    const onEnter = () => {
      if (!tween) return;
      gsap.to(tween, {
        timeScale: 0.18,
        duration: 0.55,
        ease: "power2.out",
        overwrite: true,
      });
    };
    const onLeave = () => {
      if (!tween) return;
      gsap.to(tween, {
        timeScale: 1,
        duration: 0.55,
        ease: "power2.out",
        overwrite: true,
      });
    };

    row.addEventListener("mouseenter", onEnter);
    row.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      row.removeEventListener("mouseenter", onEnter);
      row.removeEventListener("mouseleave", onLeave);
      if (tween) tween.kill();
    };
  }, [direction, speed]);

  const items = [...SLOGANS, ...SLOGANS];

  return (
    <div ref={rowRef} className="relative overflow-hidden group/row">
      <div
        ref={trackRef}
        className="flex whitespace-nowrap gap-14 py-4 will-change-transform"
      >
        {items.map((text, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              key={i}
              className="relative flex items-center gap-10 shrink-0 group/item"
            >
              <span
                className={`relative font-display uppercase text-6xl md:text-8xl tracking-wider transition-opacity duration-300 ${
                  accent ? "text-accent" : "text-foreground"
                } group-hover/row:opacity-40 group-hover/item:!opacity-100`}
              >
                {text}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] w-0 transition-[width] duration-500 ease-out group-hover/item:w-full ${
                    accent ? "bg-foreground" : "bg-accent"
                  }`}
                />
              </span>
              <Icon
                className={`w-8 h-8 shrink-0 ${
                  accent ? "text-accent/40" : "text-foreground/30"
                }`}
                strokeWidth={1.25}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MarqueeTicker() {
  return (
    <section
      aria-label="Slogan ticker"
      className="relative border-y border-muted/40 bg-surface py-6 overflow-hidden"
    >
      <Row direction="left" accent={false} speed={60} />
      <Row direction="right" accent={true} speed={60} />
    </section>
  );
}
