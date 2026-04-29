"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DollarSign,
  Users,
  Banknote,
  Activity,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { BleedButton } from "@/components/ui/BleedButton";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Stat = {
  icon: LucideIcon;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
};

const STATS: Stat[] = [
  { icon: DollarSign, value: 8420000, label: "Raised 2026", prefix: "$" },
  { icon: Users, value: 142800, label: "Member Donors" },
  { icon: Banknote, value: 38, label: "Avg Gift", prefix: "$" },
  { icon: TrendingUp, value: 0, label: "Corporate $", suffix: "%" },
];

type Pulse = {
  id: number;
  amount: number;
  donor: string;
  city: string;
  state: string;
  ago: string;
};

const PULSE_FEED: Pulse[] = [
  { id: 1, amount: 50, donor: "Maya R.", city: "Detroit", state: "MI", ago: "Just now" },
  { id: 2, amount: 25, donor: "Anonymous", city: "Atlanta", state: "GA", ago: "1m ago" },
  { id: 3, amount: 100, donor: "Lin H.", city: "Chicago", state: "IL", ago: "2m ago" },
  { id: 4, amount: 10, donor: "Carlos D.", city: "Cleveland", state: "OH", ago: "5m ago" },
  { id: 5, amount: 500, donor: "B. Strand", city: "Pittsburgh", state: "PA", ago: "8m ago" },
  { id: 6, amount: 35, donor: "Anonymous", city: "Brooklyn", state: "NY", ago: "12m ago" },
];

export function DonateHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden pt-32 md:pt-40 pb-24 md:pb-32 px-6 md:px-10 flex items-center bg-background"
    >
      {/* Diagonal acid pattern */}
      <motion.div
        aria-hidden
        style={{ y: bgY, willChange: "transform" }}
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #C8F400, #C8F400 1px, transparent 1px, transparent 28px)",
          }}
        />
      </motion.div>

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f0ede6 1px, transparent 1px), linear-gradient(90deg, #f0ede6 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div
        aria-hidden
        className="absolute top-1/4 -left-24 w-[28rem] h-[28rem] rounded-full bg-accent/15 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[34rem] h-[34rem] rounded-full bg-urgent/15 blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-[1600px] w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="inline-flex items-center gap-4 font-label uppercase text-[11px] tracking-[0.35em] text-accent">
            <span className="w-10 h-px bg-accent" />/ Donate — Member-Funded
          </span>
          <span className="hidden md:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            FEC-compliant · 501(c)(4)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Title */}
          <div className="lg:col-span-7">
            <h1 className="font-display uppercase leading-[0.85] text-[clamp(4rem,11vw,11rem)] tracking-brutal">
              <ChapterReveal text="No Corp." className="block overflow-hidden" immediate />
              <ChapterReveal
                text="No Super-PAC."
                delay={0.3}
                className="block overflow-hidden"
                immediate
              />
              <ChapterReveal
                text="Just Us."
                delay={0.6}
                className="block overflow-hidden text-accent"
                immediate
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
              className="mt-10 max-w-xl font-grotesk text-[15px] md:text-[16px] text-foreground/80 leading-relaxed"
            >
              Vanguard takes zero corporate money. Zero super-PAC money. Every
              dollar comes from members like you — and every dollar is spent in
              public, on the work. Average gift: $38.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <BleedButton href="#give" variant="card" size="md">
                Give Now
              </BleedButton>
              <BleedButton href="#impact" variant="ghost" size="md">
                Where It Goes
              </BleedButton>
            </motion.div>
          </div>

          {/* Live ticker */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="lg:col-span-5"
          >
            <DonationPulse />
          </motion.aside>
        </div>

        {/* Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 1.3 } },
          }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 border border-foreground/25 max-w-5xl"
        >
          {STATS.map((s, i) => (
            <StatCell key={s.label} stat={s} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Live donation pulse ─────────────────────────────────────────── */

function DonationPulse() {
  const [total, setTotal] = useState(8423140);
  const [idx, setIdx] = useState(0);
  const goal = 10_000_000;

  useEffect(() => {
    const a = setInterval(
      () => setTotal((t) => t + Math.floor(Math.random() * 80) + 10),
      1700,
    );
    const b = setInterval(
      () => setIdx((i) => (i + 1) % PULSE_FEED.length),
      2400,
    );
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const visible = [
    PULSE_FEED[idx],
    PULSE_FEED[(idx + 1) % PULSE_FEED.length],
    PULSE_FEED[(idx + 2) % PULSE_FEED.length],
  ];

  const pct = Math.min(100, (total / goal) * 100);

  return (
    <div className="relative bg-surface/70 backdrop-blur-md border border-muted/40 overflow-hidden">
      <span aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor, currentColor 1px, transparent 1px, transparent 18px)",
        }}
      />

      <div className="relative flex items-center justify-between px-6 py-3 border-b border-foreground/15">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          / Live
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/60 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-accent" strokeWidth={2} />
          Q2 Goal
        </span>
      </div>

      <div className="relative px-6 py-7 border-b border-foreground/15">
        <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          Raised This Quarter
        </span>
        <div className="mt-3 flex items-baseline gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={total}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-display text-5xl md:text-6xl leading-none tracking-tight tabular-nums text-accent"
            >
              ${total.toLocaleString()}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="mt-5 relative h-[3px] bg-foreground/10 overflow-hidden">
          <motion.span
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-y-0 left-0 bg-accent"
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/45">
          <span>{pct.toFixed(1)}% of goal</span>
          <span>${(goal / 1_000_000).toFixed(0)}M target</span>
        </div>
      </div>

      <ul className="relative">
        {visible.map((p, i) => (
          <PulseRow key={`${p.id}-${idx}-${i}`} pulse={p} index={i} />
        ))}
      </ul>

      <div className="relative px-6 py-3 border-t border-foreground/15">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">
          Updated continuously · 06 most recent
        </span>
      </div>
    </div>
  );
}

function PulseRow({ pulse, index }: { pulse: Pulse; index: number }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.05 }}
      className="grid grid-cols-12 gap-3 items-center px-6 py-3.5 border-b border-foreground/10 last:border-b-0 hover:bg-accent/5 transition-colors duration-300"
    >
      <span className="col-span-2 font-display text-xl text-accent leading-none tabular-nums">
        ${pulse.amount}
      </span>
      <div className="col-span-7 min-w-0">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/85 truncate block">
          {pulse.donor}
        </span>
        <span className="font-mono text-[10px] tracking-[0.15em] text-foreground/55 truncate block">
          {pulse.city}, {pulse.state}
        </span>
      </div>
      <span className="col-span-3 text-right font-mono text-[9px] uppercase tracking-[0.25em] text-accent/80 tabular-nums">
        {pulse.ago}
      </span>
    </motion.li>
  );
}

/* ── Stat cell ────────────────────────────────────────────────────── */

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;
  const numRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const c = { v: 0 };
      gsap.to(c, {
        v: stat.value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(c.v).toLocaleString();
        },
        onComplete: () => setDone(true),
      });
    });
    return () => ctx.revert();
  }, [stat.value]);

  useEffect(() => {
    if (!hovered || !done) return;
    const el = numRef.current;
    if (!el) return;
    const c = { v: stat.value };
    const tl = gsap.timeline();
    tl.to(c, {
      v: stat.value * (0.4 + Math.random() * 0.4),
      duration: 0.1,
      ease: "none",
      onUpdate: () => {
        el.textContent = Math.round(c.v).toLocaleString();
      },
    })
      .to(c, {
        v: stat.value * (1.18 + Math.random() * 0.25),
        duration: 0.12,
        ease: "none",
        onUpdate: () => {
          el.textContent = Math.round(c.v).toLocaleString();
        },
      })
      .to(c, {
        v: stat.value,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = Math.round(c.v).toLocaleString();
        },
      });
    return () => {
      tl.kill();
      el.textContent = Math.round(stat.value).toLocaleString();
    };
  }, [hovered, done, stat.value]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative py-7 px-4 md:px-6 cursor-default overflow-hidden border-foreground/25 ${
        index % 2 === 1 ? "border-l" : ""
      } ${index === 2 ? "md:border-l" : ""} ${index >= 2 ? "border-t md:border-t-0" : ""}`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0 bg-accent/10 group-hover:h-full transition-[height] duration-500 ease-out pointer-events-none"
      />
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out pointer-events-none"
      />
      <span
        aria-hidden
        className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/30 group-hover:text-accent transition-colors duration-500"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-center gap-2 mb-3">
        <motion.div
          animate={{ rotate: hovered ? -12 : 0, scale: hovered ? 1.16 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
        </motion.div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 group-hover:text-foreground transition-colors duration-500">
          {stat.label}
        </span>
      </div>

      <span className="relative inline-flex items-baseline">
        {stat.prefix && (
          <span
            className={`font-display text-2xl md:text-4xl leading-none mr-0.5 transition-colors duration-300 ${
              hovered ? "text-accent" : "text-foreground/60"
            }`}
          >
            {stat.prefix}
          </span>
        )}
        <motion.span
          ref={numRef}
          animate={{ color: hovered ? "#C8F400" : "#F0EDE6" }}
          transition={{ duration: 0.35, ease: EASE }}
          className="block font-display text-4xl md:text-6xl leading-none tracking-tight tabular-nums"
        >
          0
        </motion.span>
        {stat.suffix && (
          <span
            className={`font-display text-2xl md:text-4xl leading-none ml-1 transition-colors duration-300 ${
              hovered ? "text-accent" : "text-foreground/60"
            }`}
          >
            {stat.suffix}
          </span>
        )}
      </span>
    </motion.div>
  );
}
