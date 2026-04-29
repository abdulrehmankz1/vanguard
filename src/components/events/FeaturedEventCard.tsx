"use client";

import Image from "next/image";
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

export function FeaturedEventCard({ event }: { event: EventRecord }) {
  const Icon = EVENT_TYPE_ICONS[event.type];
  const date = formatShortDate(event.date);
  const pct = Math.round((event.registered / event.capacity) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <Link
        href={`/events/${event.slug}`}
        className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface border border-muted/30 overflow-hidden hover:border-accent/40 transition-colors duration-500"
      >
        {/* Image */}
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto lg:min-h-[460px] overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute inset-0"
          >
            <Image
              src={event.image}
              alt={event.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-transparent pointer-events-none" />
          {/* Top accent draws on hover */}
          <span
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
          />
          <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-background/80 backdrop-blur-md px-3 py-1.5 border border-foreground/15">
            <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/85">
              {event.type}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="lg:col-span-5 p-7 md:p-10 flex flex-col justify-between gap-8">
          <div>
            <div className="flex items-baseline gap-3 border-b border-foreground/15 pb-5">
              <span className="font-display text-6xl leading-none text-accent tabular-nums">
                {date.day}
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/55">
                  {date.month} · {date.year}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 mt-1">
                  {event.startTime}–{event.endTime}
                </span>
              </div>
            </div>

            <h3 className="mt-6 font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-wide group-hover:text-accent transition-colors duration-500">
              {event.title}
            </h3>
            <p className="mt-4 font-grotesk text-[15px] text-foreground/70 leading-relaxed">
              {event.excerpt}
            </p>

            <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                {event.city}, {event.state}
              </li>
              <li className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                {event.registered.toLocaleString()} /{" "}
                {event.capacity.toLocaleString()}
              </li>
            </ul>

            <CapacityBar pct={pct} className="mt-3" thin />
          </div>

          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              View Briefing
            </span>
            <ArrowUpRight
              className="w-5 h-5 text-foreground/40 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
              strokeWidth={2}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
