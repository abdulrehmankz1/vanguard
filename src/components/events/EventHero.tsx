"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { EVENT_TYPE_ICONS, type EventRecord } from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function EventHero({ event }: { event: EventRecord }) {
  const Icon = EVENT_TYPE_ICONS[event.type];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] overflow-hidden bg-background pt-32 md:pt-40 pb-20 md:pb-24 px-6 md:px-10 flex items-end"
    >
      {/* Full-bleed parallax bg image */}
      <div className="absolute inset-x-0 bottom-0 top-24 md:top-32 overflow-hidden">
        <motion.div
          aria-hidden
          style={{ y: bgY, scale: bgScale }}
          className="relative w-full h-full"
        >
          <Image
            src={event.image}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
        </motion.div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 max-w-[1600px] w-full mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/55 hover:text-accent transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          className="mt-8 inline-flex items-center gap-3 bg-background/80 backdrop-blur-md px-3 py-2 border border-foreground/15"
        >
          <Icon className="w-4 h-4 text-accent" strokeWidth={2} />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/85">
            {event.type} ·{" "}
            {event.status === "upcoming" ? "Upcoming" : "Concluded"}
          </span>
        </motion.div>

        <h1 className="mt-6 font-display uppercase leading-[0.85] text-[clamp(3rem,10vw,10rem)] tracking-brutal max-w-5xl">
          <ChapterReveal text={event.title} className="block overflow-hidden" immediate />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
          className="mt-8 max-w-2xl font-grotesk text-[15px] md:text-[17px] text-foreground/85 leading-relaxed"
        >
          {event.excerpt}
        </motion.p>
      </motion.div>
    </section>
  );
}
