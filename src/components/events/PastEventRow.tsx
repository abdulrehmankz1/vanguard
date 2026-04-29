"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  EVENT_TYPE_ICONS,
  formatEventDate,
  type EventRecord,
} from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function PastEventRow({
  event,
  index,
}: {
  event: EventRecord;
  index: number;
}) {
  const Icon = EVENT_TYPE_ICONS[event.type];

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      whileInView={{
        opacity: 1,
        x: 0,
        transition: { duration: 0.7, delay: index * 0.05, ease: EASE },
      }}
      viewport={{ once: true, margin: "-40px" }}
      className="border-b border-foreground/15"
    >
      <motion.div
        whileHover={{ x: 12 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <Link
          href={`/events/${event.slug}`}
          className="group grid grid-cols-12 gap-4 md:gap-8 items-center py-6 md:py-8 px-4 md:px-6 hover:bg-surface/40 transition-colors duration-300"
        >
        <span className="col-span-12 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="col-span-4 md:col-span-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/70">
          {formatEventDate(event.date)}
        </span>
        <span className="col-span-8 md:col-span-2 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/55">
          <Icon className="w-3.5 h-3.5 text-accent shrink-0" strokeWidth={2} />
          {event.type}
        </span>
        <h3 className="col-span-12 md:col-span-5 font-display text-2xl md:text-3xl uppercase leading-[0.95] tracking-wide group-hover:text-accent transition-colors duration-300">
          {event.title}
        </h3>
        <span className="col-span-10 md:col-span-1 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/55">
          {event.city}, {event.state}
        </span>
        <ArrowUpRight
          className="col-span-2 md:col-span-1 w-4 h-4 text-foreground/40 group-hover:text-accent justify-self-end group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300"
          strokeWidth={2}
        />
        </Link>
      </motion.div>
    </motion.li>
  );
}
