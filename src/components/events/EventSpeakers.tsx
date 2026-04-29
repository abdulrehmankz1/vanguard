"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import type { EventSpeaker } from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EventSpeakers({ speakers }: { speakers: EventSpeaker[] }) {
  if (!speakers.length) return null;

  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="font-label uppercase text-[11px] tracking-[0.3em] text-accent inline-block"
            >
              / On Stage
            </motion.span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
              <ChapterReveal text="Speakers." className="block overflow-hidden" immediate />
            </h2>
          </div>
          <p className="md:max-w-xs font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/55">
            {speakers.length} confirmed
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {speakers.map((s) => (
            <motion.div
              key={s.name}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
              }}
            >
              <SpeakerCard speaker={s} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function SpeakerCard({ speaker }: { speaker: EventSpeaker }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
      className="group relative bg-surface border border-muted/30 overflow-hidden hover:border-accent/40 transition-colors duration-500"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={speaker.photo}
          alt={speaker.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.05] transition-[filter,transform] duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent pointer-events-none" />
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out"
        />
        <div className="absolute bottom-5 left-5 right-5">
          <h3 className="font-display text-2xl md:text-3xl uppercase leading-none tracking-wide group-hover:text-accent transition-colors duration-500">
            {speaker.name}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {speaker.title}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
