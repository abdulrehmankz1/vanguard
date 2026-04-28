"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flag, Eye, Users, Compass, ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

type Value = { icon: LucideIcon; code: string; title: string; desc: string };

const VALUES: Value[] = [
  {
    icon: Flag,
    code: "V01",
    title: "Independence",
    desc: "Member-funded. No corporate donors, no PAC backchannels, no transactional party allegiances. Decisions answer to the people who showed up.",
  },
  {
    icon: Eye,
    code: "V02",
    title: "Transparency",
    desc: "Every budget line, every internal vote, every endorsement criterion published openly. Trust is built on receipts, not slogans.",
  },
  {
    icon: Users,
    code: "V03",
    title: "Collective Action",
    desc: "Power is built block by block — phone banks, neighbor canvasses, mutual aid networks. Political infrastructure that exists between elections.",
  },
  {
    icon: Compass,
    code: "V04",
    title: "Long-View Politics",
    desc: "We measure progress in decades, not news cycles. The institutions worth building outlast the people who start them.",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function AboutValues() {
  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / How We Operate
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl uppercase leading-[0.95] tracking-wide max-w-3xl">
              <ChapterReveal text="Four Values." className="block overflow-hidden" immediate />
              <ChapterReveal
                text="No Exceptions."
                delay={0.3}
                className="block overflow-hidden"
                immediate
              />
            </h2>
          </div>
          <p className="md:max-w-sm font-grotesk text-[15px] text-foreground/60 leading-relaxed">
            Internal practice that doesn&apos;t bend regardless of who&apos;s
            running, what cycle it is, or what the consultants advise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {VALUES.map((v, i) => (
            <ValueCard key={v.code} value={v} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ValueCard({ value, index }: { value: Value; index: number }) {
  const Icon = value.icon;
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHovered(true);
  };

  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHovered(false);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: (index % 2) * 0.08, ease: EASE }}
      whileHover={{ y: -6 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor-theme={hovered ? "light" : undefined}
      className="value-card group relative bg-surface border border-muted/30 p-8 md:p-10 overflow-hidden"
    >
      {/* Color bleed */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-accent pointer-events-none"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{
          clipPath: hovered
            ? `circle(160% at ${origin.x}% ${origin.y}%)`
            : `circle(0% at ${origin.x}% ${origin.y}%)`,
        }}
        transition={{ duration: 0.7, ease: EASE }}
      />
      {/* Top accent */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] bg-accent/40 group-hover:bg-background transition-colors duration-500"
      />
      {/* Hatch pattern */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] group-hover:opacity-[0.10] transition-opacity duration-500"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor, currentColor 1px, transparent 1px, transparent 18px)",
        }}
      />

      <div className="relative flex items-start justify-between gap-6">
        <div>
          <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/45 group-hover:text-background/70 transition-colors duration-500">
            {value.code}
          </span>
          <motion.h3
            animate={{ y: hovered ? -4 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="mt-4 font-display text-3xl md:text-4xl uppercase leading-[0.95] tracking-wide text-foreground group-hover:text-background transition-colors duration-500"
          >
            {value.title}
          </motion.h3>
          <p className="mt-4 max-w-md font-grotesk text-[15px] text-foreground/65 group-hover:text-background/85 transition-colors duration-500 leading-relaxed">
            {value.desc}
          </p>
        </div>
        <motion.div
          animate={{ rotate: hovered ? -14 : 0, scale: hovered ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Icon
            className="w-8 h-8 text-accent group-hover:text-background transition-colors duration-500"
            strokeWidth={1.5}
          />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute bottom-6 right-6 z-10"
        animate={{
          opacity: hovered ? 1 : 0,
          x: hovered ? 0 : 12,
          y: hovered ? 0 : 12,
        }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <ArrowUpRight
          className="w-5 h-5 text-background"
          strokeWidth={2}
        />
      </motion.div>
    </motion.article>
  );
}
