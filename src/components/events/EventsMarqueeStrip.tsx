"use client";

import { useMemo } from "react";
import { ChevronRight, MapPin, Calendar } from "lucide-react";
import { type EventRecord } from "@/data/events";

/**
 * Top-of-hero marquee. Scrolls upcoming events as a single continuous strip
 * — title · city · days-until · location — for a "live feed" feel.
 * Uses the project's existing `.marquee-left` keyframes from globals.css.
 */
export function EventsMarqueeStrip({ events }: { events: EventRecord[] }) {
  const items = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.map((e) => {
      const ed = new Date(e.date + "T00:00:00");
      const days = Math.max(
        0,
        Math.ceil((ed.getTime() - today.getTime()) / 86_400_000),
      );
      return {
        title: e.title,
        city: `${e.city}, ${e.state}`,
        days,
        type: e.type,
      };
    });
  }, [events]);

  if (!items.length) return null;

  // Doubled track so the keyframe's -50% wrap looks seamless
  const track = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-y border-foreground/15 bg-surface/40 backdrop-blur-sm">
      <div className="flex whitespace-nowrap gap-12 py-3.5 marquee-left will-change-transform">
        {track.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/75"
          >
            <ChevronRight className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
            <span className="text-accent">Next Up</span>
            <span className="text-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-accent" strokeWidth={2} />
              {item.title}
            </span>
            <span className="text-foreground/40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-accent" strokeWidth={2} />
              {item.city}
            </span>
            <span className="text-foreground/40">·</span>
            <span className="text-accent">{item.days} Days Until</span>
          </div>
        ))}
      </div>

      {/* Edge fades so the marquee dissolves into the bg at left/right */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none"
      />
    </div>
  );
}
