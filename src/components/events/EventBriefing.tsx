"use client";

import { motion } from "framer-motion";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { BleedButton } from "@/components/ui/BleedButton";
import type { EventRecord } from "@/data/events";
import { EventAgenda } from "./EventAgenda";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EventBriefing({ event }: { event: EventRecord }) {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-label uppercase text-[11px] tracking-[0.3em] text-accent inline-block"
          >
            / Briefing
          </motion.span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
            <ChapterReveal text="What To Expect." className="block overflow-hidden" immediate />
          </h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
            }}
            className="mt-8 space-y-6 font-grotesk text-[16px] md:text-[17px] text-foreground/75 leading-[1.7]"
          >
            {event.description.map((p, i) => (
              <motion.p
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                }}
              >
                {p}
              </motion.p>
            ))}
          </motion.div>

          {event.status === "upcoming" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <BleedButton href="#register" variant="card" size="lg">
                Register Now
              </BleedButton>
              <BleedButton href="/#join" variant="ghost" size="lg">
                Join the Movement
              </BleedButton>
            </motion.div>
          )}
        </div>

        {event.agenda.length > 0 && (
          <div className="lg:col-span-5">
            <EventAgenda agenda={event.agenda} />
          </div>
        )}
      </div>
    </section>
  );
}
