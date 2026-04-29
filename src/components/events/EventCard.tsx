"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import {
  EVENT_TYPE_ICONS,
  formatEventDate,
  formatShortDate,
  type EventRecord,
} from "@/data/events";

type Variant = "default" | "compact";

type Props = {
  event: EventRecord;
  variant?: Variant;
  className?: string;
};

export function EventCard({ event, variant = "default", className = "" }: Props) {
  const Icon = EVENT_TYPE_ICONS[event.type];
  const date = formatShortDate(event.date);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="h-full"
    >
      <Link
        href={`/events/${event.slug}`}
        className={`group relative bg-surface border border-muted/30 overflow-hidden hover:border-accent/40 transition-colors duration-500 flex flex-col h-full ${className}`}
      >
        <div className="relative aspect-[5/3] overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-[filter,transform] duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

          {/* Top accent bar that wipes across on hover */}
          <span
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[2px] bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
          />

          {variant === "default" && (
            <>
              <div className="absolute top-4 left-4 bg-background/85 backdrop-blur-md border border-foreground/15 px-3 py-2 flex flex-col items-center min-w-[64px]">
                <span className="font-display text-3xl leading-none text-accent tabular-nums">
                  {date.day}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/70 mt-0.5">
                  {date.month}
                </span>
              </div>
              <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-background/85 backdrop-blur-md px-2.5 py-1 border border-foreground/15">
                <Icon className="w-3 h-3 text-accent" strokeWidth={2} />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/85">
                  {event.type}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex-1 p-5 md:p-6 flex flex-col">
          {variant === "compact" && (
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 mb-3">
              <Icon className="w-3 h-3 text-accent" strokeWidth={2} />
              {event.type}
              <span className="text-foreground/30">·</span>
              <span>{formatEventDate(event.date)}</span>
            </div>
          )}

          <h3 className="font-display text-xl md:text-2xl uppercase leading-[1] tracking-wide group-hover:text-accent transition-colors duration-500">
            {event.title}
          </h3>

          {variant === "default" && (
            <p className="mt-3 font-grotesk text-[14px] text-foreground/65 leading-relaxed line-clamp-2">
              {event.excerpt}
            </p>
          )}

          <div
            className={`mt-auto flex items-center justify-between border-t border-foreground/10 ${
              variant === "compact" ? "pt-3" : "pt-5"
            }`}
          >
            <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
              <MapPin className="w-3 h-3 text-accent" strokeWidth={2} />
              {event.city}, {event.state}
            </div>
            <ArrowUpRight
              className="w-4 h-4 text-foreground/40 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-500"
              strokeWidth={2}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
