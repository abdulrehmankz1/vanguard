"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

type Format = "M" | "%" | "int";

type Stat = {
  value: number;
  label: string;
  format: Format;
};

const STATS: Stat[] = [
  { value: 4_200_000, label: "Active Members", format: "M" },
  { value: 180, label: "Cities Organized", format: "int" },
  { value: 12, label: "Years Of Work", format: "int" },
  { value: 98, label: "Member Approval", format: "%" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function formatValue(n: number, format: Format) {
  if (format === "M") return `${(n / 1_000_000).toFixed(1)}M`;
  if (format === "%") return `${Math.round(n)}%`;
  return `${Math.round(n)}`;
}

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const cellRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [countedUp, setCountedUp] = useState(false);

  // Cursor-tracked spotlight (local coords inside the cell)
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mx}% ${my}%, rgba(5,5,5,0.18), transparent 65%)`;

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  // Scroll-triggered count-up — runs once, then flips countedUp so hover
  // scramble is enabled.
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: stat.value,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = formatValue(counter.v, stat.format);
        },
        onComplete: () => setCountedUp(true),
      });
    }, cellRef);

    return () => ctx.revert();
  }, [stat.value, stat.format]);

  // Hover scramble — only after the initial count-up is done, so the two
  // tweens never fight over el.textContent.
  useEffect(() => {
    if (!hovered || !countedUp) return;
    const el = numRef.current;
    if (!el) return;

    const counter = { v: stat.value };
    const tl = gsap.timeline();

    tl.to(counter, {
      v: stat.value * (0.3 + Math.random() * 0.45),
      duration: 0.1,
      ease: "none",
      onUpdate: () => {
        el.textContent = formatValue(counter.v, stat.format);
      },
    })
      .to(counter, {
        v: stat.value * (1.15 + Math.random() * 0.25),
        duration: 0.12,
        ease: "none",
        onUpdate: () => {
          el.textContent = formatValue(counter.v, stat.format);
        },
      })
      .to(counter, {
        v: stat.value * (0.6 + Math.random() * 0.3),
        duration: 0.1,
        ease: "none",
        onUpdate: () => {
          el.textContent = formatValue(counter.v, stat.format);
        },
      })
      .to(counter, {
        v: stat.value,
        duration: 0.55,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = formatValue(counter.v, stat.format);
        },
      });

    return () => {
      tl.kill();
      el.textContent = formatValue(stat.value, stat.format);
    };
  }, [hovered, countedUp, stat.value, stat.format]);

  const borderClasses = [
    "border-background/20",
    index % 2 === 1 ? "border-l" : "",
    index === 2 ? "md:border-l" : "",
    index >= 2 ? "border-t md:border-t-0" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      ref={cellRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMove}
      className={`stat-cell group relative py-10 px-4 md:px-8 overflow-hidden ${borderClasses}`}
    >
      {/* Cursor spotlight overlay */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{ background: spotlight, opacity: hovered ? 1 : 0 }}
      />

      {/* Corner arrow — slides in diagonally */}
      <motion.div
        aria-hidden
        className="absolute top-5 right-5 pointer-events-none z-10"
        animate={{
          opacity: hovered ? 1 : 0,
          x: hovered ? 0 : 14,
          y: hovered ? 0 : -14,
          rotate: hovered ? 0 : -12,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
      </motion.div>

      {/* Number — lifts + scales slightly on hover */}
      <motion.span
        ref={numRef}
        className="stat-num relative block font-display leading-[0.85] tracking-tight tabular-nums text-7xl md:text-[9rem]"
        data-target={stat.value}
        data-format={stat.format}
        animate={{
          y: hovered ? -4 : 0,
          scale: hovered ? 1.015 : 1,
        }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
      >
        {formatValue(0, stat.format)}
      </motion.span>

      {/* Label row — accent bar extends in from the left on hover */}
      <div className="relative mt-5 flex items-center gap-3">
        <motion.span
          aria-hidden
          className="block h-[2px] bg-background origin-left"
          animate={{
            width: hovered ? 28 : 0,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
          {stat.label}
        </span>
      </div>
    </motion.div>
  );
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  // Cursor-reactive character scramble on any [data-cursor-scramble] inside
  // the heading — accent is dark so it reads against the acid-green panel.

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".stats-meta", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stats-meta",
          start: "top 90%",
        },
      });

      // Clip-path reveal of the whole panel
      gsap.fromTo(
        ".stats-reveal",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 35%",
            scrub: 1,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div
        data-cursor-theme="light"
        className="stats-reveal relative bg-accent text-background py-24 md:py-32 px-6 md:px-10 noise"
      >
        <div className="relative z-10 max-w-[1600px] mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="stats-heading font-display text-5xl md:text-8xl leading-[0.9] uppercase">
              <ChapterReveal text="The Numbers" className="block overflow-hidden" />
              <ChapterReveal
                text="Do Not Lie."
                delay={0.35}
                className="block overflow-hidden"
              />
            </h2>
            <span className="stats-meta flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em]">
              <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
              Live · Refreshed 04.2026
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-background/20">
            {STATS.map((s, i) => (
              <StatCell key={s.label} stat={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
