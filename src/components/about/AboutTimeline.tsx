"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const TIMELINE: { year: string; title: string; desc: string }[] = [
  {
    year: "2012",
    title: "Founding Assembly",
    desc: "47 organizers from 11 cities convene at a public library in Detroit. The first manifesto is drafted in three days.",
  },
  {
    year: "2015",
    title: "First 100 Chapters",
    desc: "The chapter network crosses 100 active groups. Member dues replace early seed-grant funding entirely.",
  },
  {
    year: "2018",
    title: "Field-Tested",
    desc: "Vanguard-trained organizers run 14 successful local races. The model is proven at scale.",
  },
  {
    year: "2020",
    title: "Million-Member March",
    desc: "Membership crosses 1,000,000. National assemblies become biennial. The dispatch reaches 4M weekly readers.",
  },
  {
    year: "2024",
    title: "Coalition Era",
    desc: "Five sister organizations merge under the Vanguard umbrella. The five-pillar manifesto is ratified by member vote.",
  },
  {
    year: "2026",
    title: "Today",
    desc: "4.2M members across 180 cities. Six active national campaigns. The work continues, quietly and on schedule.",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
// Where the dot sits vertically inside each row — aligns with the year line.
const DOT_TOP = "3.75rem";

export function AboutTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  // Vertical progress fill bound to scroll position
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 75%", "end 75%"],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Year count-up
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".tl-year-num").forEach((el) => {
        const target = Number(el.dataset.target || "0");
        const start = target - 30;
        const counter = { v: start };
        gsap.to(counter, {
          v: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
            / Trajectory
          </span>
          <h2 className="mt-4 font-display text-5xl md:text-7xl uppercase leading-[0.95] tracking-wide">
            <ChapterReveal text="Fourteen Years" className="block overflow-hidden" immediate />
            <ChapterReveal
              text="In Motion."
              delay={0.3}
              className="block overflow-hidden text-accent"
              immediate
            />
          </h2>
          <p className="mt-6 max-w-xl mx-auto font-grotesk text-[15px] text-foreground/60 leading-relaxed">
            A short ledger of the inflection points. Most of the work happened
            on the days nobody wrote down.
          </p>
        </div>

        {/* Timeline */}
        <div ref={railRef} className="relative">
          {/* Static rail — left edge on mobile, centered on desktop */}
          <span
            aria-hidden
            className="md:hidden absolute top-0 bottom-0 w-px bg-foreground/15"
            style={{ left: "1rem" }}
          />
          <span
            aria-hidden
            className="hidden md:block absolute top-0 bottom-0 w-px bg-foreground/15"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          />

          {/* Animated progress fill */}
          <motion.span
            aria-hidden
            style={{
              height: progressHeight,
              left: "1rem",
            }}
            className="md:hidden absolute top-0 w-[2px] bg-accent shadow-[0_0_14px_rgba(200,244,0,0.55)]"
          />
          <motion.span
            aria-hidden
            style={{
              height: progressHeight,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            className="hidden md:block absolute top-0 w-[2px] bg-accent shadow-[0_0_14px_rgba(200,244,0,0.55)]"
          />

          <ol className="relative space-y-8 md:space-y-14">
            {TIMELINE.map((t, i) => (
              <TimelineRow key={t.year} entry={t} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({
  entry,
  index,
}: {
  entry: { year: string; title: string; desc: string };
  index: number;
}) {
  const isLeft = index % 2 === 0;
  const rowRef = useRef<HTMLLIElement>(null);

  // Per-row scroll-driven parallax + opacity on the card
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "center center"],
  });
  const cardX = useTransform(
    scrollYProgress,
    [0, 1],
    [isLeft ? -50 : 50, 0],
  );
  const cardOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const cardScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);

  return (
    <motion.li
      ref={rowRef}
      className="relative grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-20 items-start"
    >
      {/* ── Dot on the rail ──
          Outer div owns positioning (so the centering offset survives),
          inner motion.span owns the scale animation. Otherwise Framer
          Motion's transform overrides the inline translate(-50%, 0). */}
      <div
        aria-hidden
        className="md:hidden absolute z-10 w-4 h-4"
        style={{ left: "calc(1rem - 8px)", top: DOT_TOP }}
      >
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
          className="block w-full h-full rounded-full bg-accent shadow-[0_0_18px_rgba(200,244,0,0.7)] ring-4 ring-background"
        />
      </div>
      <div
        aria-hidden
        className="hidden md:block absolute z-10 w-4 h-4"
        style={{ left: "calc(50% - 8px)", top: DOT_TOP }}
      >
        <motion.span
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
          className="block w-full h-full rounded-full bg-accent shadow-[0_0_18px_rgba(200,244,0,0.7)] ring-4 ring-background"
        />
      </div>

      {/* ── Horizontal connector line from dot to card edge (desktop only) ── */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
        className={`hidden md:block absolute h-px bg-accent/40 z-[5] ${
          isLeft ? "origin-right" : "origin-left"
        }`}
        style={{
          top: `calc(${DOT_TOP} + 7px)`,
          [isLeft ? "right" : "left"]: "50%",
          width: "calc(2.5rem)",
        }}
      />

      {/* ── Card ── slides in horizontally + parallax on scroll */}
      <motion.div
        style={{ x: cardX, opacity: cardOpacity, scale: cardScale }}
        className={`group relative pl-12 md:pl-0 ${
          isLeft ? "md:pr-0 md:col-start-1" : "md:pl-0 md:col-start-2"
        }`}
      >
        <div
          className={`relative bg-surface border border-muted/30 p-6 md:p-8 overflow-hidden transition-colors duration-500 hover:border-accent/40 ${
            isLeft ? "md:mr-10" : "md:ml-10"
          }`}
        >
          {/* Hover accent bar — slides in from the rail-facing edge */}
          <span
            aria-hidden
            className={`absolute inset-y-0 ${
              isLeft ? "right-0" : "left-0"
            } w-0 group-hover:w-1.5 bg-accent transition-[width] duration-500 ease-out`}
          />
          {/* Hatch pattern */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, currentColor, currentColor 1px, transparent 1px, transparent 18px)",
            }}
          />

          <div className="relative">
            <div
              className={`flex items-baseline gap-3 ${
                isLeft ? "md:justify-end" : ""
              }`}
            >
              <motion.span
                whileHover={{ scale: 1.06 }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
                className="tl-year-num font-display text-5xl md:text-7xl leading-none tracking-tight tabular-nums text-accent inline-block cursor-default"
                data-target={entry.year}
              >
                {entry.year}
              </motion.span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
                Phase {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3
              className={`mt-4 font-display text-2xl md:text-3xl uppercase leading-[0.95] tracking-wide group-hover:text-accent transition-colors duration-500 ${
                isLeft ? "md:text-right" : ""
              }`}
            >
              {entry.title}
            </h3>
            <p
              className={`mt-3 font-grotesk text-[14px] md:text-[15px] text-foreground/65 leading-relaxed max-w-md ${
                isLeft ? "md:ml-auto md:text-right" : ""
              }`}
            >
              {entry.desc}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Empty grid cell on the opposite side keeps the layout balanced */}
      <div
        aria-hidden
        className={
          isLeft
            ? "hidden md:block md:col-start-2"
            : "hidden md:block md:col-start-1"
        }
      />
    </motion.li>
  );
}
