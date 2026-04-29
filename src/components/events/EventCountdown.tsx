"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  EVENT_TYPE_ICONS,
  formatShortDate,
  type EventRecord,
} from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function calculate(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  }
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    done: false,
  };
}

export function EventCountdown({ event }: { event: EventRecord }) {
  const Icon = EVENT_TYPE_ICONS[event.type];
  const date = formatShortDate(event.date);
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const target = new Date(`${event.date}T${event.startTime}:00`);
    setTime(calculate(target));
    const id = setInterval(() => setTime(calculate(target)), 1000);
    return () => clearInterval(id);
  }, [event.date, event.startTime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      className="relative bg-surface/80 backdrop-blur-md border border-muted/40 overflow-hidden"
    >
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
      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/15">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          / Live Countdown
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/65">
          <Icon className="w-3 h-3 text-accent" strokeWidth={2} />
          {event.type}
        </span>
      </div>

      {/* Time grid with flip animation */}
      <div className="grid grid-cols-4 divide-x divide-foreground/10">
        <TimeCell value={time?.days} label="Days" pad={3} />
        <TimeCell value={time?.hours} label="Hours" pad={2} />
        <TimeCell value={time?.minutes} label="Min" pad={2} />
        <TimeCell value={time?.seconds} label="Sec" pad={2} />
      </div>

      {/* Event meta + CTA */}
      <Link
        href={`/events/${event.slug}`}
        className="group block border-t border-foreground/15 px-6 py-5 hover:bg-accent/5 transition-colors duration-300"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              {date.month} {date.day} · {event.startTime}
            </p>
            <h3 className="mt-2 font-display text-2xl md:text-3xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-300 truncate">
              {event.title}
            </h3>
            <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
              <MapPin className="w-3 h-3 text-accent" strokeWidth={2} />
              {event.venue} · {event.city}, {event.state}
            </p>
          </div>
          <ArrowUpRight
            className="w-5 h-5 text-foreground/45 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300 shrink-0 mt-1"
            strokeWidth={2}
          />
        </div>
      </Link>
    </motion.div>
  );
}

function TimeCell({
  value,
  label,
  pad,
}: {
  value: number | undefined;
  label: string;
  pad: number;
}) {
  const display = value === undefined ? "—" : String(value).padStart(pad, "0");

  return (
    <div className="py-6 px-2 md:px-4 text-center">
      {/* Fixed-height window with overflow clipped so flips don't jitter the column */}
      <div className="relative h-[3rem] md:h-[4rem] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
            animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
            transition={{
              y: { duration: 0.45, ease: EASE },
              opacity: { duration: 0.25, ease: EASE },
              filter: { duration: 0.25 },
            }}
            className="absolute font-display text-4xl md:text-6xl leading-none tracking-tight tabular-nums text-foreground"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="block mt-2 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">
        {label}
      </span>
    </div>
  );
}
