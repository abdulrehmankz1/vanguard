"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, MapPin, Activity, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import type { EventRecord } from "@/data/events";
import { EventCountdown } from "./EventCountdown";
import { EventsMarqueeStrip } from "./EventsMarqueeStrip";
import { OnDeckList } from "./OnDeckList";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Stat = { icon: LucideIcon; value: number; label: string };

function formatStatValue(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function EventsListingHero({
  upcomingCount,
  pastCount,
  citiesCount,
  totalRegistered,
  nextEvent,
  upcoming,
}: {
  upcomingCount: number;
  pastCount: number;
  citiesCount: number;
  totalRegistered: number;
  nextEvent: EventRecord | null;
  upcoming: EventRecord[];
}) {
  const ref = useRef<HTMLElement>(null);

  const stats: Stat[] = [
    { icon: Calendar, value: upcomingCount, label: "Upcoming" },
    { icon: Activity, value: pastCount, label: "This Quarter" },
    { icon: MapPin, value: citiesCount, label: "Cities" },
    { icon: Users, value: totalRegistered, label: "Registered" },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-background pt-24 md:pt-28 pb-20 md:pb-24"
    >
      {/* Top scrolling marquee strip */}
      <EventsMarqueeStrip events={upcoming} />

      {/* Decorative ambient elements */}
      <div
        aria-hidden
        className="absolute top-1/3 -left-24 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-10 w-[34rem] h-[34rem] rounded-full bg-urgent/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f0ede6 1px, transparent 1px), linear-gradient(90deg, #f0ede6 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative px-6 md:px-10 mt-14 md:mt-20">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <span className="inline-flex items-center gap-4 font-label uppercase text-[11px] tracking-[0.35em] text-accent">
              <span className="w-10 h-px bg-accent" />/ Field Schedule —{" "}
              {String(upcomingCount).padStart(2, "0")} Upcoming
            </span>
            <span className="hidden md:inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-foreground/20 text-foreground/75">
                <MapPin className="w-3 h-3 text-accent" strokeWidth={2} />
                <span className="tabular-nums">{String(citiesCount).padStart(2, "0")}</span>
                <span className="text-foreground/45">Cities</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-foreground/20 text-foreground/75">
                <Users className="w-3 h-3 text-accent" strokeWidth={2} />
                <span className="tabular-nums text-foreground">{totalRegistered.toLocaleString()}</span>
                <span className="text-foreground/45">RSVP&apos;d</span>
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <h1 className="font-display uppercase leading-[0.85] text-[clamp(4rem,13vw,13rem)] tracking-brutal">
                <ChapterReveal text="Attend." className="block overflow-hidden" immediate />
                <ChapterReveal
                  text="Organize."
                  delay={0.3}
                  className="block overflow-hidden"
                  immediate
                />
                <ChapterReveal
                  text="Win."
                  delay={0.6}
                  className="block overflow-hidden text-accent"
                  immediate
                />
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
                className="mt-10 max-w-xl font-grotesk text-[15px] md:text-[16px] text-foreground/75 leading-relaxed"
              >
                Assemblies, town halls, phone banks, trainings, and mutual-aid
                drives across 180 American chapters. Every event below is open
                to the public — show up, plug in, take the work home.
              </motion.p>
            </div>

            {nextEvent && (
              <div className="lg:col-span-5 lg:mt-4 flex flex-col gap-5">
                <EventCountdown event={nextEvent} />
                <OnDeckList events={upcoming.slice(1, 4)} />
              </div>
            )}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
            }}
            className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 border-t border-foreground/25"
          >
            {stats.map((s, i) => (
              <StatCell key={s.label} stat={s} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatCell({ stat, index }: { stat: Stat; index: number }) {
  const Icon = stat.icon;
  const numRef = useRef<HTMLSpanElement>(null);
  const [hovered, setHovered] = useState(false);
  const [countedUp, setCountedUp] = useState(false);

  // Count-up on scroll-in
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      gsap.to(counter, {
        v: stat.value,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
        onUpdate: () => {
          el.textContent = formatStatValue(counter.v);
        },
        onComplete: () => setCountedUp(true),
      });
    });
    return () => ctx.revert();
  }, [stat.value]);

  // Hover scramble — random flickers around the real value, then settles
  useEffect(() => {
    if (!hovered || !countedUp) return;
    const el = numRef.current;
    if (!el) return;
    const counter = { v: stat.value };
    const tl = gsap.timeline();
    tl.to(counter, {
      v: stat.value * (0.3 + Math.random() * 0.5),
      duration: 0.1,
      ease: "none",
      onUpdate: () => {
        el.textContent = formatStatValue(counter.v);
      },
    })
      .to(counter, {
        v: stat.value * (1.2 + Math.random() * 0.3),
        duration: 0.12,
        ease: "none",
        onUpdate: () => {
          el.textContent = formatStatValue(counter.v);
        },
      })
      .to(counter, {
        v: stat.value,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          el.textContent = formatStatValue(counter.v);
        },
      });
    return () => {
      tl.kill();
      el.textContent = formatStatValue(stat.value);
    };
  }, [hovered, countedUp, stat.value]);

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className={`group relative py-7 px-4 md:px-6 cursor-default overflow-hidden border-foreground/25 ${
        index % 2 === 1 ? "border-l" : ""
      } ${index === 2 ? "md:border-l" : ""} ${
        index >= 2 ? "border-t md:border-t-0" : ""
      }`}
    >
      {/* Hover bg fill rises from bottom */}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-0 bg-accent/10 group-hover:h-full transition-[height] duration-500 ease-out"
      />
      {/* Bottom accent bar wipes across */}
      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out"
      />
      {/* Top-right index marker */}
      <span
        aria-hidden
        className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/30 group-hover:text-accent transition-colors duration-500"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-center gap-2 mb-3">
        <motion.div
          animate={{
            rotate: hovered ? -14 : 0,
            scale: hovered ? 1.18 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
        </motion.div>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 group-hover:text-foreground transition-colors duration-500">
          {stat.label}
        </span>
      </div>

      <motion.span
        ref={numRef}
        animate={{
          scale: hovered ? 1.06 : 1,
          color: hovered ? "#C8F400" : "#F0EDE6",
        }}
        transition={{ duration: 0.35, ease: EASE }}
        style={{
          textShadow: hovered ? "0 0 24px rgba(200,244,0,0.35)" : "none",
        }}
        className="events-stat-num relative block font-display text-4xl md:text-6xl leading-none tracking-tight tabular-nums origin-left"
        data-target={stat.value}
      >
        0
      </motion.span>
    </motion.div>
  );
}

