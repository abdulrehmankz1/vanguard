"use client";

import { motion } from "framer-motion";
import type { EventAgendaItem } from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EventAgenda({ agenda }: { agenda: EventAgendaItem[] }) {
  if (!agenda.length) return null;

  return (
    <div>
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="font-label uppercase text-[11px] tracking-[0.3em] text-accent inline-block"
      >
        / Agenda
      </motion.span>
      <h2 className="mt-4 font-display text-3xl md:text-4xl uppercase leading-[0.95] tracking-wide">
        Schedule
      </h2>

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
        }}
        className="mt-8 border-t border-foreground/15"
      >
        {agenda.map((a, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            className="grid grid-cols-12 gap-4 py-5 border-b border-foreground/15 group hover:bg-surface/30 transition-colors duration-300 px-2"
          >
            <span className="col-span-3 font-mono text-[12px] uppercase tracking-[0.2em] text-accent tabular-nums">
              {a.time}
            </span>
            <div className="col-span-9">
              <h3 className="font-display text-lg md:text-xl uppercase leading-tight tracking-wide group-hover:text-accent transition-colors duration-300">
                {a.title}
              </h3>
              {a.speaker && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                  With · {a.speaker}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </div>
  );
}
