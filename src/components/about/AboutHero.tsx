"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

type StatFormat = "year" | "M" | "int" | "%";
type Stat = { value: number; format: StatFormat; label: string };

const STATS: Stat[] = [
  { value: 2012, format: "year", label: "Founded" },
  { value: 4_200_000, format: "M", label: "Members" },
  { value: 180, format: "int", label: "Cities" },
  { value: 0, format: "%", label: "Corporate Funding" },
];

function formatStat(n: number, format: StatFormat) {
  if (format === "year") return `${Math.round(n)}`;
  if (format === "M") return `${(n / 1_000_000).toFixed(1)}M`;
  if (format === "%") return `${Math.round(n)}%`;
  return `${Math.round(n)}`;
}

export function AboutHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.1]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-10 flex items-center bg-background"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          aria-hidden
          style={{ y: bgY, scale: bgScale, willChange: "transform" }}
          className="relative w-full h-full"
        >
          <Image
            src="/images/about/hero.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-top grayscale contrast-[1.15]"
          />
        </motion.div>
      </div>

      {/* Dark gradient overlay — sits ON TOP of the image but BELOW content */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background pointer-events-none"
      />

      {/* Noise overlay (same as home hero — kept above the gradient for grain) */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft accent + urgent blobs */}
      <div
        aria-hidden
        className="absolute top-1/3 -left-20 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-10 w-[34rem] h-[34rem] rounded-full bg-urgent/15 blur-3xl pointer-events-none"
      />

      {/* ── Content ── */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto">
        <span className="inline-flex items-center gap-4 font-label uppercase text-[11px] tracking-[0.35em] text-accent">
          <span className="w-10 h-px bg-accent" />/ About — Origin Story
        </span>

        <h1 className="mt-6 font-display uppercase leading-[0.85] text-[clamp(4rem,12vw,12rem)] tracking-brutal max-w-5xl">
          <ChapterReveal text="We Are" className="block overflow-hidden" immediate />
          <ChapterReveal
            text="The Movement."
            delay={0.35}
            className="block overflow-hidden text-accent"
            immediate
          />
        </h1>

        <p className="mt-10 max-w-xl font-grotesk text-[15px] md:text-[16px] text-foreground/85 leading-relaxed">
          A coalition of workers, technologists, and neighbors building the political infrastructure
          of the next century. Member-funded. Volunteer-run. Built to last beyond any single
          election.
        </p>

        {/* Stats with count-up + hover scramble */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 border border-foreground/25 max-w-5xl">
          {STATS.map((s, i) => (
            <StatCell key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [countedUp, setCountedUp] = useState(stat.format === "year");

  // Count-up animation on scroll-in (year format skips this and renders static)
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    if (stat.format === "year") {
      el.textContent = formatStat(stat.value, stat.format);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: stat.value,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
        onUpdate: () => {
          el.textContent = formatStat(counter.v, stat.format);
        },
        onComplete: () => setCountedUp(true),
      });
    });
    return () => ctx.revert();
  }, [stat.value, stat.format]);

  // Hover scramble — random digits flash before settling back to the real value
  useEffect(() => {
    if (!hovered || !countedUp) return;
    const el = numRef.current;
    if (!el) return;
    if (stat.format === "year") return; // year stays clean

    const counter = { v: stat.value };
    const tl = gsap.timeline();
    tl.to(counter, {
      v: stat.value * (0.3 + Math.random() * 0.5),
      duration: 0.1,
      ease: "none",
      onUpdate: () => {
        el.textContent = formatStat(counter.v, stat.format);
      },
    })
      .to(counter, {
        v: stat.value * (1.2 + Math.random() * 0.3),
        duration: 0.12,
        ease: "none",
        onUpdate: () => {
          el.textContent = formatStat(counter.v, stat.format);
        },
      })
      .to(counter, {
        v: stat.value,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = formatStat(counter.v, stat.format);
        },
      });

    return () => {
      tl.kill();
      el.textContent = formatStat(stat.value, stat.format);
    };
  }, [hovered, countedUp, stat.value, stat.format]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative py-8 px-4 md:px-6 cursor-default overflow-hidden border-foreground/25 ${
        index % 2 === 1 ? "border-l" : ""
      } ${index === 2 ? "md:border-l" : ""} ${index >= 2 ? "border-t md:border-t-0" : ""}`}
    >
      {/* Hover bg fill from below — stays clipped inside the cell */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0 bg-accent/10 group-hover:h-full transition-[height] duration-500 ease-out pointer-events-none"
      />
      {/* Hover bottom accent bar */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out pointer-events-none"
      />
      {/* Index marker */}
      <span
        aria-hidden
        className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/30 group-hover:text-accent transition-colors duration-500"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <motion.span
        ref={numRef}
        animate={{ color: hovered ? "#C8F400" : "#F0EDE6" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative block font-display text-5xl md:text-7xl leading-none tracking-tight tabular-nums"
      >
        {formatStat(0, stat.format)}
      </motion.span>
      <span className="relative block mt-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 group-hover:text-foreground transition-colors duration-500">
        {stat.label}
      </span>
    </div>
  );
}
