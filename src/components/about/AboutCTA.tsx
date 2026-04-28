"use client";

import { motion } from "framer-motion";
import { BleedButton } from "@/components/ui/BleedButton";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

export function AboutCTA() {
  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 border-t border-foreground/10 overflow-hidden">
      {/* Diagonal acid line pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 42px)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="font-label uppercase text-[11px] tracking-[0.3em] text-accent"
        >
          / Next Step
        </motion.span>

        <h2 className="mt-6 font-display uppercase leading-[0.85] text-[clamp(3rem,11vw,11rem)] tracking-brutal max-w-5xl">
          <ChapterReveal text="The Work" className="block overflow-hidden" immediate />
          <ChapterReveal
            text="Continues."
            delay={0.35}
            className="block overflow-hidden text-accent"
            immediate
          />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mt-10 max-w-xl font-grotesk text-[15px] md:text-[16px] text-foreground/70 leading-relaxed"
        >
          Read the manifesto, follow the field reports, and — when you&apos;re
          ready — show up. The fastest way to learn what we do is to do it
          with us.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <BleedButton href="/#join" variant="card" size="lg">
            Join The Movement
          </BleedButton>
          <BleedButton href="/#manifesto" variant="ghost" size="lg">
            Read The Manifesto
          </BleedButton>
        </motion.div>
      </div>
    </section>
  );
}
