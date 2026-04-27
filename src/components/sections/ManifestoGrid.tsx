"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight, Globe2, Cpu, Scale, Leaf, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

type Pillar = {
  code: string;
  num: string;
  mark: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  span: string;
};

const PILLARS: Pillar[] = [
  {
    code: "ECN",
    num: "01",
    mark: "◆",
    title: "Economic Sovereignty",
    desc: "A national investment plan to rebuild the real economy — owned by the workers who build it and the towns that host it.",
    icon: Scale,
    span: "md:col-span-7",
  },
  {
    code: "DGT",
    num: "02",
    mark: "▲",
    title: "Digital Rights",
    desc: "End-to-end encryption, public-interest AI, and the right to be forgotten — codified into law, not terms of service.",
    icon: Cpu,
    span: "md:col-span-5",
  },
  {
    code: "CLM",
    num: "03",
    mark: "●",
    title: "Climate Realism",
    desc: "Full industrial mobilization toward a zero-carbon grid within the decade. No offsets. No excuses.",
    icon: Leaf,
    span: "md:col-span-5",
  },
  {
    code: "GLB",
    num: "04",
    mark: "■",
    title: "Global Solidarity",
    desc: "A foreign policy built on peace, trade, and shared prosperity — instead of a permanent war footing we cannot afford.",
    icon: Globe2,
    span: "md:col-span-7",
  },
  {
    code: "SAF",
    num: "05",
    mark: "▼",
    title: "Safety Without Surveillance",
    desc: "Community-led public safety, mental-health response, and due process — replacing extraction-era policing.",
    icon: Shield,
    span: "md:col-span-12",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function PillarCard({
  pillar,
  index,
  wide,
}: {
  pillar: Pillar;
  index: number;
  wide: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const Icon = pillar.icon;

  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${mx}% ${my}%, rgba(255,255,255,0.12), transparent 60%)`;

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 100);
    my.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHovered(true);
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHovered(false);
  };

  // GSAP: top accent line draws on enter
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card.querySelector(".card-top-line"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power3.out",
          duration: 0.9,
          scrollTrigger: { trigger: card, start: "top 88%" },
        },
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{
        duration: 0.85,
        delay: (index % 3) * 0.08,
        ease: EASE,
      }}
      whileHover={{ y: -6 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className={`pillar-card group relative bg-surface border border-muted/30 overflow-hidden ${pillar.span}`}
      style={{ willChange: "transform" }}
    >
      {/* Color bleed overlay */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-accent pointer-events-none"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{
          clipPath: hovered
            ? `circle(160% at ${origin.x}% ${origin.y}%)`
            : `circle(0% at ${origin.x}% ${origin.y}%)`,
        }}
        transition={{ duration: 0.75, ease: EASE }}
      />

      {/* Cursor-tracked spotlight */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlight, mixBlendMode: "overlay" }}
      />

      {/* Top accent rule */}
      <span
        aria-hidden
        className="card-top-line absolute top-0 left-0 right-0 h-[2px] bg-accent/40 origin-left group-hover:bg-background transition-colors duration-500"
      />

      {/* HUGE 3-letter code as background watermark — replaces giant number */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -bottom-8 -right-2 font-display text-[11rem] md:text-[16rem] leading-[0.8] tracking-tighter text-foreground/[0.06] group-hover:text-background/15 transition-colors duration-500"
      >
        {pillar.code}
      </span>

      {/* Diagonal hatch pattern overlay — adds texture so cards never feel empty */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04] group-hover:opacity-[0.10] transition-opacity duration-500"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, currentColor, currentColor 1px, transparent 1px, transparent 18px)",
        }}
      />

      {/* Vertical spine — small acid bar on the left edge that grows on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-12 bg-accent group-hover:h-3/4 group-hover:bg-background transition-all duration-500 ease-out"
      />

      <div
        className={`relative z-10 flex flex-col h-full justify-between ${
          wide ? "p-7 md:p-10 min-h-[280px] md:min-h-[300px]" : "p-7 md:p-9 min-h-[280px] md:min-h-[340px]"
        }`}
      >
        {/* Header strip — code/mark on left, icon on right */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl text-accent/80 group-hover:text-background transition-colors duration-500 leading-none">
              {pillar.mark}
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-foreground/45 group-hover:text-background/70 transition-colors duration-500">
              {pillar.code}&nbsp;·&nbsp;{pillar.num}
            </span>
          </div>
          <motion.div
            animate={{
              rotate: hovered ? -14 : 0,
              scale: hovered ? 1.12 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon
              className="w-9 h-9 text-accent group-hover:text-background transition-colors duration-500"
              strokeWidth={1.5}
            />
          </motion.div>
        </div>

        {/* Body content — title + description, lifts on hover */}
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="mt-8"
        >
          <h3
            className={`font-display ${
              wide
                ? "text-4xl md:text-6xl"
                : "text-3xl md:text-[2.5rem]"
            } tracking-wide uppercase leading-[0.95] text-foreground group-hover:text-background transition-colors duration-500`}
          >
            {pillar.title}
          </h3>
          <p
            className={`mt-4 font-grotesk ${
              wide ? "text-[15px] md:text-base max-w-2xl" : "text-[14px] max-w-md"
            } text-foreground/65 group-hover:text-background/85 transition-colors duration-500 leading-relaxed`}
          >
            {pillar.desc}
          </p>
        </motion.div>

        {/* Footer — divider, label, hover-arrow at bottom-left */}
        <div className="mt-8 flex items-center gap-3">
          <motion.span
            aria-hidden
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.3em] uppercase text-accent group-hover:text-background transition-colors duration-500"
            animate={{
              opacity: hovered ? 1 : 0,
              x: hovered ? 0 : -10,
            }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
            Read
          </motion.span>
          <span className="h-px flex-1 bg-foreground/10 group-hover:bg-background/30 transition-colors duration-500" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-foreground/40 group-hover:text-background/60 transition-colors duration-500">
            Pillar / {pillar.num}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

export default function ManifestoGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".manifesto-tag", {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".manifesto-tag", start: "top 90%" },
      });
      gsap.from(".manifesto-sub", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ".manifesto-sub", start: "top 90%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative py-28 md:py-40 px-6 md:px-10"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="manifesto-tag inline-block font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Manifesto
            </span>
            <h2 className="manifesto-heading font-display text-6xl md:text-9xl leading-[0.9] uppercase mt-4 max-w-4xl">
              <ChapterReveal text="Five Pillars." className="block overflow-hidden" />
              <ChapterReveal
                text="One Movement."
                delay={0.4}
                className="block overflow-hidden"
              />
            </h2>
          </div>
          <p className="manifesto-sub max-w-sm font-grotesk text-[15px] text-foreground/60 leading-relaxed">
            The blueprint is simple. The work is generational. Every pillar
            below is a binding commitment — not a slogan, not a talking point.
          </p>
        </div>

        {/* Dense bento — 12-col asymmetric: 7+5, 5+7, 12 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {PILLARS.map((p, i) => (
            <PillarCard
              key={p.code}
              pillar={p}
              index={i}
              wide={p.span === "md:col-span-12" || p.span === "md:col-span-7"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
