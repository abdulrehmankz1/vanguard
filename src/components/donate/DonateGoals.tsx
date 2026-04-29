"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Calendar } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Goal = {
  title: string;
  raised: number;
  target: number;
  donors: number;
  deadline: string;
  tag: "Critical" | "Active" | "Stretch";
  body: string;
};

const GOALS: Goal[] = [
  {
    title: "Spring Field Push",
    raised: 1_840_000,
    target: 2_500_000,
    donors: 38420,
    deadline: "May 31",
    tag: "Critical",
    body: "Funds canvass operations + chapter office leases for the May–July sprint across 60 priority precincts.",
  },
  {
    title: "Voter Protection Fund",
    raised: 920_000,
    target: 1_200_000,
    donors: 16210,
    deadline: "Jun 14",
    tag: "Active",
    body: "Hotlines, poll watchers, and emergency rideshares on election day. Activated in 14 states.",
  },
  {
    title: "Mutual Aid Reserve",
    raised: 412_000,
    target: 750_000,
    donors: 11920,
    deadline: "Open",
    tag: "Stretch",
    body: "Eviction defense, food drops, and disaster response. Drawn down by chapter request, audited monthly.",
  },
];

const TAG_STYLES: Record<Goal["tag"], string> = {
  Critical: "border-urgent text-urgent",
  Active: "border-accent text-accent",
  Stretch: "border-foreground/40 text-foreground/65",
};

export function DonateGoals() {
  return (
    <section className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10 overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-20 -left-24 w-[28rem] h-[28rem] rounded-full bg-urgent/8 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1600px] mx-auto">
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-end">
          <div className="lg:col-span-7">
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Goals · 03 Live Drives
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-wide">
              <ChapterReveal text="Active" className="block overflow-hidden" />
              <ChapterReveal
                text="Drives."
                delay={0.3}
                className="block overflow-hidden text-accent"
              />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="font-grotesk text-[14px] md:text-[15px] text-foreground/65 leading-relaxed max-w-md">
              Every dollar tagged to a specific drive lands there. Restricted
              gifts can never be reallocated without donor consent.
            </p>
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {GOALS.map((g, i) => (
            <GoalCard key={g.title} goal={g} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function GoalCard({ goal, index }: { goal: Goal; index: number }) {
  const barRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const pct = (goal.raised / goal.target) * 100;

  useEffect(() => {
    const bar = barRef.current;
    const num = numRef.current;
    if (!bar || !num) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${pct}%`,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: { trigger: bar, start: "top 92%", once: true },
        },
      );
      const c = { v: 0 };
      gsap.to(c, {
        v: goal.raised,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: num, start: "top 92%", once: true },
        onUpdate: () => {
          num.textContent = `$${Math.round(c.v).toLocaleString()}`;
        },
      });
    });
    return () => ctx.revert();
  }, [goal.raised, pct]);

  return (
    <motion.a
      href="#give"
      data-cursor="hover"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative bg-surface/60 border border-muted/40 p-7 overflow-hidden flex flex-col min-h-[360px] hover:border-accent/60 transition-colors duration-300"
    >
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out"
      />
      <span
        aria-hidden
        className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/30 group-hover:text-accent transition-colors duration-500"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-1 border font-mono text-[9px] uppercase tracking-[0.25em] ${TAG_STYLES[goal.tag]}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              goal.tag === "Critical"
                ? "bg-urgent animate-pulse"
                : goal.tag === "Active"
                  ? "bg-accent animate-pulse"
                  : "bg-foreground/45"
            }`}
          />
          {goal.tag}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55">
          <Calendar className="w-3 h-3 text-accent" strokeWidth={2} />
          {goal.deadline}
        </span>
      </div>

      <h3 className="mt-6 font-display text-3xl md:text-4xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-300">
        {goal.title}
      </h3>
      <p className="mt-3 font-grotesk text-[13.5px] text-foreground/65 leading-relaxed">
        {goal.body}
      </p>

      <div className="mt-auto pt-7">
        <div className="flex items-baseline justify-between mb-2">
          <span ref={numRef} className="font-display text-3xl tracking-tight tabular-nums text-foreground group-hover:text-accent transition-colors duration-300">
            $0
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            of ${goal.target.toLocaleString()}
          </span>
        </div>
        <div className="h-[3px] bg-foreground/10 relative overflow-hidden">
          <span
            ref={barRef}
            className="absolute inset-y-0 left-0 bg-accent"
            style={{ width: 0 }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 tabular-nums">
            {pct.toFixed(0)}% · {goal.donors.toLocaleString()} donors
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-accent group-hover:text-foreground transition-colors duration-300">
            Give
            <ArrowUpRight
              className="w-3.5 h-3.5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300"
              strokeWidth={2}
            />
          </span>
        </div>
      </div>
    </motion.a>
  );
}
