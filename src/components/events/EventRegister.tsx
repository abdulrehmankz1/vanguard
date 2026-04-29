"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import type { EventRecord } from "@/data/events";
import { CapacityBar } from "./CapacityBar";
import { EventRSVPForm } from "./EventRSVPForm";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EventRegister({ event }: { event: EventRecord }) {
  if (event.status !== "upcoming") return null;
  const pct = Math.round((event.registered / event.capacity) * 100);

  return (
    <section
      id="register"
      className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 42px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, ease: EASE }}
        className="relative max-w-[1400px] mx-auto bg-surface border border-muted/30 overflow-hidden"
      >
        {/* Header strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-8 md:p-10 border-b border-foreground/15">
          <div>
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Register
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-wide">
              Hold Your Seat.
            </h2>
            <p className="mt-3 font-grotesk text-[14px] md:text-[15px] text-foreground/65 leading-relaxed max-w-md">
              Free for members. $10 suggested for non-members (waivable).
              Childcare and transit stipends available — flag below.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end justify-end">
            <div className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
              <Users className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
              <span>Capacity</span>
              <span className="text-accent">
                {event.registered.toLocaleString()} /{" "}
                {event.capacity.toLocaleString()} ({pct}%)
              </span>
            </div>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
              style={{ transformOrigin: "left" }}
              className="w-full max-w-sm"
            >
              <CapacityBar pct={pct} />
            </motion.div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-foreground/45">
              {(event.capacity - event.registered).toLocaleString()} seats
              remaining
            </span>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-10">
          <EventRSVPForm event={event} />
        </div>
      </motion.div>
    </section>
  );
}
