"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import {
  Phone,
  DoorOpen,
  Megaphone,
  Code,
  Globe,
  HeartHandshake,
  PenTool,
  Camera,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Role = {
  id: string;
  icon: LucideIcon;
  title: string;
  commitment: string;
  description: string;
  remote: boolean;
  /** Larger marketing tag shown on hover. */
  tag: string;
  /** Approximate active volunteers in this track (for hover stat reveal). */
  active: number;
};

export const ROLES: Role[] = [
  {
    id: "phone-bank",
    icon: Phone,
    title: "Phone Banking",
    commitment: "2–4 hrs / week",
    description:
      "Dial members and persuadable voters from a chapter office or your living room. Scripts, training, and pizza provided.",
    remote: true,
    tag: "Highest impact / hour",
    active: 3210,
  },
  {
    id: "canvass",
    icon: DoorOpen,
    title: "Door Canvassing",
    commitment: "Weekend shifts",
    description:
      "Walk a precinct with a clipboard and a partner. The single most persuasive thing we do — and the most fun.",
    remote: false,
    tag: "Most persuasive",
    active: 2480,
  },
  {
    id: "rally",
    icon: Megaphone,
    title: "Rally Crew",
    commitment: "Event-based",
    description:
      "Stage build, marshalling, signage, mutual-aid tables. Every assembly needs a hundred hands.",
    remote: false,
    tag: "Big energy",
    active: 1960,
  },
  {
    id: "tech",
    icon: Code,
    title: "Technology",
    commitment: "Flexible",
    description:
      "Web, data, ops. Open-source codebase, real users, and shipping that actually moves the needle.",
    remote: true,
    tag: "Open source",
    active: 740,
  },
  {
    id: "translation",
    icon: Globe,
    title: "Translation Corps",
    commitment: "Async",
    description:
      "Spanish, Mandarin, Vietnamese, Haitian Creole, Arabic, ASL. Translate scripts, materials, and live events.",
    remote: true,
    tag: "06 languages live",
    active: 612,
  },
  {
    id: "mutual-aid",
    icon: HeartHandshake,
    title: "Mutual Aid",
    commitment: "Monthly drives",
    description:
      "Groceries, diapers, winter coats, eviction defense. Where chapter values meet the curb.",
    remote: false,
    tag: "Direct impact",
    active: 1840,
  },
  {
    id: "writing",
    icon: PenTool,
    title: "Writing & Research",
    commitment: "Project-based",
    description:
      "Policy briefs, dispatch articles, fact-checking, message testing. Build the case in plain English.",
    remote: true,
    tag: "Build the record",
    active: 528,
  },
  {
    id: "creative",
    icon: Camera,
    title: "Creative Studio",
    commitment: "Project-based",
    description:
      "Photo, video, design, social. The visual record of the work — and the recruiting funnel.",
    remote: true,
    tag: "Visual desk",
    active: 410,
  },
];

const FEATURED = ROLES[0];
const SECONDARY = ROLES.slice(1);

export function VolunteerRoles() {
  return (
    <section
      id="roles"
      className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10 overflow-hidden scroll-mt-24"
    >
      {/* Decorative diagonal ambient */}
      <div
        aria-hidden
        className="absolute top-1/2 -right-32 w-[36rem] h-[36rem] rounded-full bg-accent/8 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1600px] mx-auto">
        {/* Heading row */}
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-end">
          <div className="lg:col-span-7">
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Roles · 08 Open Tracks
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-wide">
              <ChapterReveal text="Pick" className="block overflow-hidden" />
              <ChapterReveal
                text="A Lane."
                delay={0.3}
                className="block overflow-hidden text-accent"
              />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="font-grotesk text-[14px] md:text-[15px] text-foreground/65 leading-relaxed max-w-md">
              Every role has a coordinator, a training pathway, and a real
              campaign deadline. No busywork, no theatre.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 bg-accent" />
                Remote OK
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2 h-2 border border-foreground/40" />
                On-site
              </span>
              <span className="ml-auto hidden md:inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {ROLES.reduce((s, r) => s + r.active, 0).toLocaleString()} active
              </span>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <RolesMarquee roles={ROLES} />

        {/* Asymmetric grid: featured spotlight + 7 secondary */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5">
          <FeaturedRole role={FEATURED} />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5"
          >
            {SECONDARY.map((role, i) => (
              <RoleCard key={role.id} role={role} index={i + 1} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Roles marquee (top strip) ───────────────────────────────────── */

function RolesMarquee({ roles }: { roles: Role[] }) {
  const items = [...roles, ...roles];
  return (
    <div className="relative border-y border-foreground/15 overflow-hidden">
      {/* Edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent"
      />
      <div className="flex gap-10 py-3.5 marquee-scroll whitespace-nowrap">
        {items.map((r, i) => {
          const Icon = r.icon;
          return (
            <span
              key={`${r.id}-${i}`}
              className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/55"
            >
              <Icon className="w-3 h-3 text-accent shrink-0" strokeWidth={2} />
              {r.title}
              <span className="text-foreground/25">·</span>
              <span className="text-accent/80 tabular-nums">
                {r.active.toLocaleString()} active
              </span>
            </span>
          );
        })}
      </div>

      <style jsx>{`
        .marquee-scroll {
          animation: marquee-x 38s linear infinite;
          width: max-content;
        }
        @keyframes marquee-x {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

/* ── Featured spotlight card (large left column) ─────────────────── */

function FeaturedRole({ role }: { role: Role }) {
  const Icon = role.icon;
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(420px at ${mx}px ${my}px, rgba(200,244,0,0.18), transparent 70%)`;

  return (
    <motion.a
      ref={ref}
      href="#sign-up"
      data-cursor="hover"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: EASE }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="lg:col-span-5 group relative bg-surface/70 border border-muted/50 overflow-hidden p-8 md:p-10 flex flex-col min-h-[520px] hover:border-accent/60 transition-colors duration-500"
    >
      {/* Mouse-follow gradient */}
      <motion.span
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      {/* Top accent bar */}
      <span aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
      {/* Diagonal ghost */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor, currentColor 1px, transparent 1px, transparent 18px)",
        }}
      />

      {/* Big background number — wipes in on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-6 font-display text-[18rem] leading-none text-foreground/[0.03] group-hover:text-accent/20 transition-colors duration-700 select-none"
      >
        01
      </span>

      <div className="relative flex items-center justify-between">
        <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Featured Track
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-accent border border-accent/40 px-2 py-1">
          <span className="w-2 h-2 bg-accent" />
          Remote OK
        </span>
      </div>

      <div className="relative mt-10 flex items-center gap-4">
        <div className="w-14 h-14 border border-foreground/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors duration-500">
          <Icon className="w-6 h-6 text-accent" strokeWidth={2} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          {role.commitment}
        </span>
      </div>

      <h3 className="relative mt-6 font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-wide group-hover:text-accent transition-colors duration-500">
        {role.title}
      </h3>

      <p className="relative mt-5 font-grotesk text-[15px] text-foreground/75 leading-relaxed max-w-md">
        {role.description}
      </p>

      <div className="relative mt-auto pt-10 flex items-end justify-between gap-6">
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
            Active Volunteers
          </span>
          <span className="mt-2 block font-display text-3xl md:text-4xl leading-none tracking-tight tabular-nums text-foreground group-hover:text-accent transition-colors duration-500">
            {role.active.toLocaleString()}
          </span>
        </div>
        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/70 group-hover:text-accent transition-colors duration-500">
          {role.tag}
          <ArrowUpRight
            className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-500"
            strokeWidth={2}
          />
        </span>
      </div>
    </motion.a>
  );
}

/* ── Standard role card with mouse-follow + hover number reveal ──── */

function RoleCard({ role, index }: { role: Role; index: number }) {
  const Icon = role.icon;
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const bg = useMotionTemplate`radial-gradient(260px at ${mx}px ${my}px, rgba(200,244,0,0.14), transparent 70%)`;

  return (
    <motion.a
      ref={ref}
      href="#sign-up"
      data-cursor="hover"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="group relative bg-surface/60 border border-muted/40 p-6 overflow-hidden hover:border-accent/60 transition-colors duration-300 flex flex-col min-h-[280px]"
    >
      {/* Mouse-follow gradient */}
      <motion.span
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      {/* Top wipe */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out"
      />
      {/* Big background number — slides up & in on hover */}
      <motion.span
        aria-hidden
        animate={{
          opacity: hovered ? 1 : 0,
          y: hovered ? 0 : 20,
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="pointer-events-none absolute -bottom-3 -right-1 font-display text-[7rem] leading-none text-accent/15 select-none"
      >
        {String(index + 1).padStart(2, "0")}
      </motion.span>
      {/* Index marker */}
      <span
        aria-hidden
        className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/30 group-hover:text-accent transition-colors duration-500"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-center justify-between mb-5">
        <motion.div
          animate={{ rotate: hovered ? -8 : 0, scale: hovered ? 1.1 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 18 }}
          className="w-10 h-10 border border-foreground/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/5 transition-colors duration-300"
        >
          <Icon className="w-4 h-4 text-accent" strokeWidth={2} />
        </motion.div>
        <span
          className={`font-mono text-[9px] uppercase tracking-[0.25em] px-2 py-1 border transition-colors duration-300 ${
            role.remote
              ? "border-accent/40 text-accent"
              : "border-foreground/25 text-foreground/55"
          }`}
        >
          {role.remote ? "Remote OK" : "On-site"}
        </span>
      </div>

      <h3 className="relative font-display text-2xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-300">
        {role.title}
      </h3>
      <p className="relative mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
        {role.commitment}
      </p>
      <p className="relative mt-4 font-grotesk text-[13px] text-foreground/70 leading-relaxed">
        {role.description}
      </p>

      <div className="relative mt-auto pt-5 flex items-center justify-between border-t border-foreground/10">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 group-hover:text-foreground transition-colors duration-300">
          {role.active.toLocaleString()} active
        </span>
        <ArrowUpRight
          className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
          strokeWidth={2}
        />
      </div>
    </motion.a>
  );
}
