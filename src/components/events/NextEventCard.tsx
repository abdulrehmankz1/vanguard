"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import {
  EVENT_TYPE_ICONS,
  formatShortDate,
  type EventRecord,
} from "@/data/events";
import { CapacityBar } from "./CapacityBar";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Compact "next event" preview card used in the events listing hero.
 * Shows the upcoming event's date, title, location, capacity, and a
 * client-computed days-until counter so the hero feels like a real
 * schedule instead of a generic text-on-image header.
 */
export function NextEventCard({
  event,
  className = "",
}: {
  event: EventRecord;
  className?: string;
}) {
  const Icon = EVENT_TYPE_ICONS[event.type];
  const date = formatShortDate(event.date);
  const pct = Math.round((event.registered / event.capacity) * 100);
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ed = new Date(event.date + "T00:00:00");
    const diff = Math.max(
      0,
      Math.ceil((ed.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    );
    setDays(diff);
  }, [event.date]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
      className={className}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group relative block bg-surface/85 backdrop-blur-md border border-muted/40 hover:border-accent/50 transition-colors duration-500 overflow-hidden"
      >
        {/* Top accent bar — wipes across on hover */}
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
        />

        {/* Header row */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/15">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            / Next On The Schedule
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon className="w-3 h-3 text-accent" strokeWidth={2} />
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/65">
              {event.type}
            </span>
          </span>
        </div>

        <div className="p-6">
          {/* Date + days-until row */}
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-6xl md:text-7xl leading-none text-accent tabular-nums">
                {date.day}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/65">
                  {date.month} · {date.year}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 mt-1">
                  {event.startTime}–{event.endTime}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="block font-display text-3xl md:text-4xl leading-none tabular-nums text-foreground">
                {days === null ? "—" : days}
              </span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45 mt-1">
                {days === 1 ? "Day Until" : "Days Until"}
              </span>
            </div>
          </div>

          {/* Title + location */}
          <h3 className="mt-6 font-display text-2xl md:text-3xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-500">
            {event.title}
          </h3>
          <p className="mt-2 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            <MapPin className="w-3 h-3 text-accent" strokeWidth={2} />
            {event.venue} · {event.city}, {event.state}
          </p>

          {/* Capacity */}
          <div className="mt-5 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-3 h-3 text-accent" strokeWidth={2} />
              Capacity
            </span>
            <span className="text-accent">
              {event.registered.toLocaleString()} /{" "}
              {event.capacity.toLocaleString()} ({pct}%)
            </span>
          </div>
          <CapacityBar pct={pct} thin className="mt-2" />

          {/* Footer CTA */}
          <div className="mt-6 pt-4 border-t border-foreground/15 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              View Briefing
            </span>
            <ArrowUpRight
              className="w-4 h-4 text-foreground/45 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
              strokeWidth={2}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
