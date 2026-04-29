"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  EVENT_TYPE_ICONS,
  formatShortDate,
  type EventRecord,
} from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function OnDeckList({ events }: { events: EventRecord[] }) {
  if (events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
      className="relative bg-surface/60 backdrop-blur-md border border-muted/40 overflow-hidden"
    >
      <span aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-foreground/30" />

      <div className="flex items-center justify-between px-6 py-3 border-b border-foreground/15">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
          / On Deck
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/50">
          Next {String(events.length).padStart(2, "0")}
        </span>
      </div>

      <ul>
        {events.map((event, i) => {
          const Icon = EVENT_TYPE_ICONS[event.type];
          const date = formatShortDate(event.date);
          return (
            <motion.li
              key={event.slug}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.08, ease: EASE }}
              className={i > 0 ? "border-t border-foreground/10" : ""}
            >
              <Link
                href={`/events/${event.slug}`}
                className="group grid grid-cols-12 gap-3 items-center px-6 py-4 hover:bg-accent/5 transition-colors duration-300"
              >
                <div className="col-span-2 flex flex-col items-start">
                  <span className="font-display text-2xl leading-none text-accent group-hover:text-foreground transition-colors duration-300">
                    {date.day}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55 mt-1">
                    {date.month}
                  </span>
                </div>

                <div className="col-span-9 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      className="w-3 h-3 text-accent shrink-0"
                      strokeWidth={2}
                    />
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55">
                      {event.type} · {event.startTime}
                    </span>
                  </div>
                  <h4 className="font-display text-base uppercase leading-[1.05] tracking-wide group-hover:text-accent transition-colors duration-300 truncate">
                    {event.title}
                  </h4>
                  <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/50">
                    <MapPin className="w-2.5 h-2.5 text-accent" strokeWidth={2} />
                    {event.city}, {event.state}
                  </p>
                </div>

                <div className="col-span-1 flex justify-end">
                  <ArrowUpRight
                    className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
                    strokeWidth={2}
                  />
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>

      <Link
        href="#also-coming-up"
        className="group block border-t border-foreground/15 px-6 py-3 hover:bg-accent/5 transition-colors duration-300"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 group-hover:text-accent transition-colors duration-300">
            View Full Schedule
          </span>
          <ArrowUpRight
            className="w-3.5 h-3.5 text-foreground/45 group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300"
            strokeWidth={2}
          />
        </div>
      </Link>
    </motion.div>
  );
}
