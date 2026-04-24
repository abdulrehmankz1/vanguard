"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ArrowUpRight, Globe2, Cpu, Scale, Leaf, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useScrambleHover } from "@/hooks/useScrambleHover";

type Pillar = {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  span: string;
};

const PILLARS: Pillar[] = [
  {
    num: "01",
    title: "Economic Sovereignty",
    desc: "A national investment plan to rebuild the real economy — owned by the workers who build it and the towns that host it.",
    icon: Scale,
    span: "md:col-span-2",
  },
  {
    num: "02",
    title: "Digital Rights",
    desc: "End-to-end encryption, public-interest AI, and the right to be forgotten — codified into law, not terms of service.",
    icon: Cpu,
    span: "md:col-span-1",
  },
  {
    num: "03",
    title: "Climate Realism",
    desc: "Full industrial mobilization toward a zero-carbon grid within the decade. No offsets. No excuses.",
    icon: Leaf,
    span: "md:col-span-1",
  },
  {
    num: "04",
    title: "Global Solidarity",
    desc: "A foreign policy built on peace, trade, and shared prosperity — instead of a permanent war footing we cannot afford.",
    icon: Globe2,
    span: "md:col-span-2",
  },
  {
    num: "05",
    title: "Safety Without Surveillance",
    desc: "Community-led public safety, mental-health response, and due process — replacing extraction-era policing.",
    icon: Shield,
    span: "md:col-span-3",
  },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function PillarCard({ pillar, index }: { pillar: Pillar; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const Icon = pillar.icon;

  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  // Cursor-tracked ambient spotlight
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

  // GSAP: scrub parallax on the ghost number + top accent line draw-in
  useEffect(() => {
    const card = cardRef.current;
    const num = numberRef.current;
    if (!card || !num) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to(num, {
        y: -18,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.fromTo(
        card.querySelector(".card-top-line"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power3.out",
          duration: 0.9,
          scrollTrigger: { trigger: card, start: "top 85%" },
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
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: (index % 3) * 0.1,
        ease: EASE,
      }}
      whileHover={{ y: -6 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      className={`pillar-card group relative bg-surface border border-muted/30 p-8 md:p-10 overflow-hidden ${pillar.span}`}
      style={{ willChange: "transform" }}
    >
      {/* 1 · Color-bleed reveal — acid-green pane clipped to a circle that expands from the cursor entry point */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-accent pointer-events-none"
        animate={{
          clipPath: hovered
            ? `circle(160% at ${origin.x}% ${origin.y}%)`
            : `circle(0% at ${origin.x}% ${origin.y}%)`,
        }}
        transition={{ duration: 0.75, ease: EASE }}
      />

      {/* 2 · Cursor-tracked ambient light */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: spotlight, mixBlendMode: "overlay" }}
      />

      {/* Giant ghost number — scrub parallax + color-swap under hover */}
      <span
        ref={numberRef}
        aria-hidden
        className="pointer-events-none select-none absolute top-2 -right-4 font-display text-[9rem] md:text-[14rem] leading-[0.85] tracking-tighter text-foreground/[0.05] group-hover:text-background/20 transition-colors duration-500"
      >
        {pillar.num}
      </span>

      {/* Top accent rule — draws on enter, colour-swaps on hover */}
      <span
        aria-hidden
        className="card-top-line absolute top-0 left-0 right-0 h-[2px] bg-accent/40 origin-left group-hover:bg-background transition-colors duration-500"
      />

      {/* 3 · Corner arrow — signals interactivity, slides in diagonally */}
      <motion.div
        aria-hidden
        className="absolute top-6 right-6 z-20 pointer-events-none"
        animate={{
          opacity: hovered ? 1 : 0,
          x: hovered ? 0 : 14,
          y: hovered ? 0 : -14,
          rotate: hovered ? 0 : -12,
        }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="w-11 h-11 rounded-full bg-background flex items-center justify-center">
          <ArrowUpRight className="w-4 h-4 text-accent" strokeWidth={2} />
        </div>
      </motion.div>

      <div className="relative z-10 flex flex-col h-full min-h-[260px] justify-between gap-10">
        <div className="flex items-center justify-between">
          {/* 4 · Icon — spring rotate + scale on hover */}
          <motion.div
            animate={{
              rotate: hovered ? -14 : 0,
              scale: hovered ? 1.12 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon
              className="w-8 h-8 text-accent group-hover:text-background transition-colors duration-500"
              strokeWidth={1.25}
            />
          </motion.div>
          <span className="font-mono text-xs text-foreground/40 group-hover:text-background/60 transition-colors duration-500">
            / Pillar {pillar.num}
          </span>
        </div>

        {/* 5 · Content block nudges up slightly on hover */}
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
        >
          <h3 className="font-display text-4xl md:text-5xl tracking-wide uppercase leading-none text-foreground group-hover:text-background transition-colors duration-500">
            {pillar.title}
          </h3>
          <p className="mt-4 font-grotesk text-[15px] text-foreground/70 group-hover:text-background/85 transition-colors duration-500 max-w-xl leading-relaxed">
            {pillar.desc}
          </p>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function ManifestoGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrambleRef = useScrambleHover<HTMLHeadingElement>({
    radius: 130,
    effect: "lift",
    maxLift: 10,
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".mh-word", {
        y: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".manifesto-heading",
          start: "top 82%",
        },
      });

      gsap.from(".manifesto-tag", {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".manifesto-tag",
          start: "top 90%",
        },
      });

      gsap.from(".manifesto-sub", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".manifesto-sub",
          start: "top 90%",
        },
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
            <h2
              ref={scrambleRef}
              className="manifesto-heading font-display text-6xl md:text-9xl leading-[0.9] uppercase mt-4 max-w-4xl"
            >
              <span className="block overflow-hidden">
                <span className="mh-word inline-block mr-[0.15em]" data-cursor-scramble>Five</span>
                <span className="mh-word inline-block" data-cursor-scramble>Pillars.</span>
              </span>
              <span className="block overflow-hidden">
                <span className="mh-word inline-block mr-[0.15em]" data-cursor-scramble>One</span>
                <span className="mh-word inline-block" data-cursor-scramble>Movement.</span>
              </span>
            </h2>
          </div>
          <p className="manifesto-sub max-w-sm font-grotesk text-[15px] text-foreground/60 leading-relaxed">
            The blueprint is simple. The work is generational. Every pillar
            below is a binding commitment — not a slogan, not a talking point.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.num} pillar={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
