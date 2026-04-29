"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  DoorOpen,
  Megaphone,
  Code,
  HeartHandshake,
  Building2,
  ScrollText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Allocation = {
  icon: LucideIcon;
  pct: number;
  label: string;
  body: string;
};

const ALLOCATIONS: Allocation[] = [
  {
    icon: DoorOpen,
    pct: 32,
    label: "Field Organizing",
    body:
      "Door-knocks, phone banks, training stipends, and chapter office leases. The single biggest line item — by design.",
  },
  {
    icon: Megaphone,
    pct: 22,
    label: "Direct Voter Contact",
    body:
      "Mailers, persuasion ads, voter-protection hotlines. Buying nothing we can't measure twice.",
  },
  {
    icon: HeartHandshake,
    pct: 14,
    label: "Mutual Aid",
    body:
      "Food drops, eviction defense, transit stipends. The line between our politics and our care.",
  },
  {
    icon: Code,
    pct: 12,
    label: "Tech & Data",
    body:
      "Open-source codebase, voter file ops, hosting, and security. Every dollar published, every vendor disclosed.",
  },
  {
    icon: ScrollText,
    pct: 10,
    label: "Policy & Research",
    body:
      "In-house research desk, fact-checkers, and the brief writers who arm every chapter.",
  },
  {
    icon: Building2,
    pct: 10,
    label: "Operations",
    body:
      "Compliance, legal, payroll for the small permanent staff. Audited annually and posted publicly.",
  },
];

export function DonateImpact() {
  return (
    <section
      id="impact"
      className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10 overflow-hidden scroll-mt-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 38px)",
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-20 right-1/4 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1600px] mx-auto">
        <div className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-end">
          <div className="lg:col-span-7">
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Impact · 06 Buckets · 100¢ on the dollar
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-wide">
              <ChapterReveal text="Where Every" className="block overflow-hidden" />
              <ChapterReveal
                text="Dollar Goes."
                delay={0.3}
                className="block overflow-hidden text-accent"
              />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="font-grotesk text-[14px] md:text-[15px] text-foreground/65 leading-relaxed max-w-md">
              We publish the books quarterly. Every vendor. Every line item.
              Open the ledger at{" "}
              <a
                href="#"
                className="text-accent hover:underline underline-offset-4"
                data-cursor="hover"
              >
                vanguard.org/ledger
              </a>
              .
            </p>
          </div>
        </div>

        {/* Animated stacked bar */}
        <SegmentBar />

        {/* Allocation cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {ALLOCATIONS.map((a, i) => (
            <AllocationCard key={a.label} a={a} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SegmentBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const segments = el.querySelectorAll<HTMLElement>("[data-seg]");
    const ctx = gsap.context(() => {
      gsap.from(segments, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="flex w-full h-12 overflow-hidden border border-foreground/25">
        {ALLOCATIONS.map((a, i) => (
          <div
            key={a.label}
            data-seg
            style={{ width: `${a.pct}%` }}
            className={`relative h-full flex items-center justify-center ${
              i % 2 === 0 ? "bg-accent" : "bg-accent/55"
            }`}
            title={`${a.label} — ${a.pct}%`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-background tabular-nums">
              {a.pct}%
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
        {ALLOCATIONS.map((a, i) => (
          <span key={a.label} className="inline-flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 ${
                i % 2 === 0 ? "bg-accent" : "bg-accent/55"
              }`}
            />
            {a.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AllocationCard({ a, index }: { a: Allocation; index: number }) {
  const Icon = a.icon;
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { width: "0%" },
        {
          width: `${a.pct}%`,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    });
    return () => ctx.revert();
  }, [a.pct]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      className="group relative bg-surface/60 border border-muted/40 p-6 overflow-hidden hover:border-accent/60 transition-colors duration-300"
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

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border border-foreground/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors duration-300">
          <Icon className="w-4 h-4 text-accent" strokeWidth={2} />
        </div>
        <span className="font-display text-2xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-300">
          {a.label}
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between">
        <span className="font-display text-5xl md:text-6xl leading-none tracking-tight tabular-nums text-foreground group-hover:text-accent transition-colors duration-300">
          {a.pct}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/55">
          ¢ / dollar
        </span>
      </div>

      <div className="mt-3 h-[3px] bg-foreground/10 relative overflow-hidden">
        <span
          ref={barRef}
          className="absolute inset-y-0 left-0 bg-accent"
          style={{ width: 0 }}
        />
      </div>

      <p className="mt-5 font-grotesk text-[13.5px] text-foreground/70 leading-relaxed">
        {a.body}
      </p>
    </motion.div>
  );
}
