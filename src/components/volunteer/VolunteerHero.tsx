"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Users,
  Clock,
  MapPin,
  Heart,
  Activity,
  Phone,
  DoorOpen,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { BleedButton } from "@/components/ui/BleedButton";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Stat = { icon: LucideIcon; value: number; label: string; suffix?: string };

const STATS: Stat[] = [
  { icon: Users, value: 12480, label: "Active Volunteers" },
  { icon: Clock, value: 184000, label: "Hours Logged", suffix: "+" },
  { icon: MapPin, value: 180, label: "Cities" },
  { icon: Heart, value: 96, label: "Retention", suffix: "%" },
];

type Pulse = {
  id: number;
  icon: LucideIcon;
  city: string;
  state: string;
  action: string;
  ago: string;
};

const PULSE_FEED: Pulse[] = [
  { id: 1, icon: Phone, city: "Detroit", state: "MI", action: "Phone bank · 14 dialers", ago: "Just now" },
  { id: 2, icon: DoorOpen, city: "Atlanta", state: "GA", action: "Door knock · 22 doors", ago: "2m ago" },
  { id: 3, icon: Megaphone, city: "Chicago", state: "IL", action: "Rally prep · 6 captains", ago: "4m ago" },
  { id: 4, icon: Heart, city: "Cleveland", state: "OH", action: "Mutual aid · 1,200 lbs", ago: "11m ago" },
  { id: 5, icon: Phone, city: "Pittsburgh", state: "PA", action: "Phone bank · 9 dialers", ago: "18m ago" },
  { id: 6, icon: DoorOpen, city: "Brooklyn", state: "NY", action: "Door knock · 31 doors", ago: "23m ago" },
];

export function VolunteerHero() {
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
      {/* Diagonal acid line pattern */}
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

      {/* Grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f0ede6 1px, transparent 1px), linear-gradient(90deg, #f0ede6 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Soft accent + urgent blobs */}
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
            <span className="w-10 h-px bg-accent" />/ Volunteer — Field Roster
          </span>
          <span className="hidden md:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Recruiting Spring 2026
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left — title + intro */}
          <div className="lg:col-span-7">
            <h1 className="font-display uppercase leading-[0.85] text-[clamp(4rem,11vw,11rem)] tracking-brutal">
              <ChapterReveal text="Show Up." className="block overflow-hidden" immediate />
              <ChapterReveal
                text="Plug In."
                delay={0.3}
                className="block overflow-hidden"
                immediate
              />
              <ChapterReveal
                text="Build."
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
              Phone banks, canvasses, mutual aid, tech build-outs, translation
              corps. Every Vanguard chapter is run by volunteers — no paid
              staff, no consultants, no compromises.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <BleedButton href="#sign-up" variant="card" size="md">
                Sign Up
              </BleedButton>
              <BleedButton href="#roles" variant="ghost" size="md">
                Browse Roles
              </BleedButton>
            </motion.div>
          </div>

          {/* Right — Pulse feed */}
          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
            className="lg:col-span-5"
          >
            <PulseFeed />
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

/* ── Live pulse feed of active volunteer activity ────────────────── */

function PulseFeed() {
  const [counter, setCounter] = useState(2347);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setCounter((c) => c + Math.floor(Math.random() * 3) + 1), 1900);
    const b = setInterval(() => setIdx((i) => (i + 1) % PULSE_FEED.length), 2400);
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

      {/* Header */}
      <div className="relative flex items-center justify-between px-6 py-3 border-b border-foreground/15">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          / Live Pulse
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/60 flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-accent" strokeWidth={2} />
          On Shift Now
        </span>
      </div>

      {/* Big counter */}
      <div className="relative px-6 py-7 border-b border-foreground/15">
        <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          Volunteers Active
        </span>
        <div className="mt-3 flex items-baseline gap-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={counter}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="font-display text-5xl md:text-6xl leading-none tracking-tight tabular-nums text-accent"
            >
              {counter.toLocaleString()}
            </motion.span>
          </AnimatePresence>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
            right now
          </span>
        </div>

        {/* Capacity bar */}
        <div className="mt-5 relative h-[3px] bg-foreground/10 overflow-hidden">
          <motion.span
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(85, (counter / 3000) * 100)}%` }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-y-0 left-0 bg-accent"
          />
        </div>
        <div className="mt-2 flex justify-between font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/45">
          <span>0</span>
          <span>3K target</span>
        </div>
      </div>

      {/* Live ticker */}
      <ul className="relative">
        {visible.map((p, i) => (
          <PulseRow key={`${p.id}-${idx}-${i}`} pulse={p} index={i} />
        ))}
      </ul>

      <div className="relative px-6 py-3 border-t border-foreground/15 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">
          Updated continuously · 06 most recent
        </span>
      </div>
    </div>
  );
}

function PulseRow({ pulse, index }: { pulse: Pulse; index: number }) {
  const Icon = pulse.icon;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.05 }}
      className="grid grid-cols-12 gap-3 items-center px-6 py-3.5 border-b border-foreground/10 last:border-b-0 hover:bg-accent/5 transition-colors duration-300"
    >
      <span className="col-span-1 w-7 h-7 border border-foreground/20 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
      </span>
      <div className="col-span-8 min-w-0">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/85 truncate block">
          {pulse.city}, {pulse.state}
        </span>
        <span className="font-mono text-[10px] tracking-[0.15em] text-foreground/55 truncate block">
          {pulse.action}
        </span>
      </div>
      <span className="col-span-3 text-right font-mono text-[9px] uppercase tracking-[0.25em] text-accent/80 tabular-nums">
        {pulse.ago}
      </span>
    </motion.li>
  );
}

/* ── Hero stat cell — count-up + hover scramble + animated icon ───── */

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;
  const numRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [countedUp, setCountedUp] = useState(false);

  // Count-up
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: stat.value,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
        onUpdate: () => {
          el.textContent = Math.round(counter.v).toLocaleString();
        },
        onComplete: () => setCountedUp(true),
      });
    });
    return () => ctx.revert();
  }, [stat.value]);

  // Hover scramble — flicker around the real value, then settle back
  useEffect(() => {
    if (!hovered || !countedUp) return;
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
  }, [hovered, countedUp, stat.value]);

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
