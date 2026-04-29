"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ClipboardList, GitBranch, GraduationCap, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Step = {
  n: string;
  icon: LucideIcon;
  title: string;
  duration: string;
  body: string;
  detail: string[];
};

const STEPS: Step[] = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Apply",
    duration: "5 min",
    body:
      "Five minutes. We ask the basics — name, city, the work you'd like to do, when you're free.",
    detail: [
      "Identity + location",
      "Role preferences",
      "Honest hours estimate",
    ],
  },
  {
    n: "02",
    icon: GitBranch,
    title: "Match",
    duration: "≤ 48 hrs",
    body:
      "Within 48 hours, your chapter coordinator emails you with two or three role tracks that match your skills + schedule.",
    detail: [
      "Coordinator-led, not algorithmic",
      "Two role options minimum",
      "Local chapter intro",
    ],
  },
  {
    n: "03",
    icon: GraduationCap,
    title: "Train",
    duration: "1 evening",
    body:
      "One short orientation (45 min) plus a role-specific training. Both run weekly online and at chapter offices.",
    detail: [
      "45-min movement orientation",
      "Role-specific track training",
      "Buddy assignment",
    ],
  },
  {
    n: "04",
    icon: Rocket,
    title: "Ship",
    duration: "Week 1",
    body:
      "First shift inside a week. Real work, with a buddy on day one. No volunteer is left to figure it out alone.",
    detail: [
      "Real shift, week one",
      "Paired with experienced volunteer",
      "Debrief + next-shift sign-up",
    ],
  },
];

export function VolunteerProcess() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10 overflow-hidden"
    >
      {/* Diagonal acid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 38px)",
        }}
      />
      {/* Soft urgent blob */}
      <div
        aria-hidden
        className="absolute -bottom-20 left-1/3 w-[28rem] h-[28rem] rounded-full bg-urgent/10 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1600px] mx-auto">
        {/* Heading */}
        <div className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-end">
          <div className="lg:col-span-7">
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Onboarding · 04 Steps · 7 Days Total
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.9] tracking-wide">
              <ChapterReveal text="From Form" className="block overflow-hidden" />
              <ChapterReveal
                text="To Field."
                delay={0.3}
                className="block overflow-hidden text-accent"
              />
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pb-2">
            <p className="font-grotesk text-[14px] md:text-[15px] text-foreground/65 leading-relaxed max-w-md">
              One week from sign-up to your first real shift. We mean it. No
              wait-list theatre, no email purgatory.
            </p>
            <div className="mt-5 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Avg. apply → first shift: 4.2 days</span>
            </div>
          </div>
        </div>

        {/* Desktop: horizontal scroll-progress timeline ───────────── */}
        <div className="hidden lg:block relative">
          {/* Spine */}
          <div className="absolute top-[3.25rem] left-0 right-0 h-[2px] bg-foreground/15">
            <motion.span
              style={{ scaleX: lineScale, transformOrigin: "left center" }}
              className="absolute inset-0 bg-accent"
            />
          </div>

          <ol className="relative grid grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <DesktopStep key={step.n} step={step} index={i} progress={scrollYProgress} />
            ))}
          </ol>
        </div>

        {/* Mobile / tablet stacked */}
        <ol className="lg:hidden relative pl-10">
          <span aria-hidden className="absolute left-4 top-3 bottom-3 w-px bg-foreground/15" />
          <motion.span
            aria-hidden
            style={{ scaleY: lineScale, transformOrigin: "top center" }}
            className="absolute left-4 top-3 bottom-3 w-px bg-accent"
          />
          {STEPS.map((step, i) => (
            <MobileStep key={step.n} step={step} index={i} />
          ))}
        </ol>

        {/* Bottom strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-foreground/15 border border-foreground/15"
        >
          {[
            { k: "Avg. days to ship", v: "4.2" },
            { k: "Coordinator response SLA", v: "48 hr" },
            { k: "Trainings / month", v: "32" },
            { k: "Buddy match rate", v: "100%" },
          ].map((item, i) => (
            <div
              key={item.k}
              className="group bg-background p-5 hover:bg-surface/40 transition-colors duration-500 relative"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out"
              />
              <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">
                {String(i + 1).padStart(2, "0")} · {item.k}
              </span>
              <span className="mt-2 block font-display text-3xl md:text-4xl tracking-tight text-foreground group-hover:text-accent transition-colors duration-500">
                {item.v}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Desktop step ────────────────────────────────────────────────── */

function DesktopStep({
  step,
  index,
  progress,
}: {
  step: Step;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each step's node lights up as the spine fills past it
  const threshold = (index + 0.5) / STEPS.length;
  const lit = useTransform(progress, (v) => (v >= threshold ? 1 : 0));
  const bgColor = useTransform(lit, (v) => (v ? "#C8F400" : "#0F0F0F"));
  const borderColor = useTransform(lit, (v) =>
    v ? "#C8F400" : "rgba(240,237,230,0.25)",
  );
  const iconColor = useTransform(lit, (v) => (v ? "#050505" : "#C8F400"));
  const Icon = step.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      className="group relative"
    >
      {/* Node on spine */}
      <div className="relative h-[6.5rem] flex items-center justify-center">
        <motion.span
          aria-hidden
          style={{ opacity: lit }}
          className="absolute w-7 h-7 rounded-full bg-accent/20 blur-md"
        />
        <motion.span
          style={{ backgroundColor: bgColor, borderColor, color: iconColor }}
          className="relative z-10 w-12 h-12 border-2 flex items-center justify-center"
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
          <motion.span
            aria-hidden
            style={{ opacity: lit }}
            className="absolute -inset-1 border border-accent"
          />
        </motion.span>
      </div>

      <div className="mt-8 relative">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          STEP / {step.n}
        </span>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          <h3 className="font-display text-3xl xl:text-4xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-300">
            {step.title}
          </h3>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45 shrink-0">
            {step.duration}
          </span>
        </div>
        <p className="mt-4 font-grotesk text-[13.5px] text-foreground/70 leading-relaxed">
          {step.body}
        </p>
        <ul className="mt-5 space-y-1.5">
          {step.detail.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55"
            >
              <span className="text-accent shrink-0 mt-[3px]">→</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </motion.li>
  );
}

/* ── Mobile step ─────────────────────────────────────────────────── */

function MobileStep({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon;
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: EASE }}
      className="relative pb-12 last:pb-0"
    >
      <span
        aria-hidden
        className="absolute -left-10 top-1 w-7 h-7 -translate-x-1/2 border-2 border-accent bg-background flex items-center justify-center"
      >
        <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
        STEP / {step.n}
      </span>
      <div className="mt-2 flex items-baseline gap-3">
        <h3 className="font-display text-3xl uppercase leading-[1] tracking-wide">
          {step.title}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
          {step.duration}
        </span>
      </div>
      <p className="mt-3 font-grotesk text-[14px] text-foreground/70 leading-relaxed">
        {step.body}
      </p>
      <ul className="mt-4 space-y-1.5">
        {step.detail.map((d) => (
          <li
            key={d}
            className="flex items-start gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55"
          >
            <span className="text-accent shrink-0 mt-[3px]">→</span>
            {d}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}
