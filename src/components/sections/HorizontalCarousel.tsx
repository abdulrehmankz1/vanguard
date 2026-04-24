"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Vote,
  GraduationCap,
  HardHat,
  Stethoscope,
  HousePlus,
  TreePine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StatFormat = "M" | "K" | "%" | "int";

type Campaign = {
  title: string;
  value: number;
  format: StatFormat;
  label: string;
  bg: string;
  text: string;
  accent: string;
  icon: LucideIcon;
};

const CAMPAIGNS: Campaign[] = [
  {
    title: "Right To Vote",
    value: 2_400_000,
    format: "M",
    label: "Signatures Collected",
    bg: "#C8F400",
    text: "#050505",
    accent: "#050505",
    icon: Vote,
  },
  {
    title: "Free College",
    value: 87,
    format: "int",
    label: "Campuses Organizing",
    bg: "#0F0F0F",
    text: "#F0EDE6",
    accent: "#C8F400",
    icon: GraduationCap,
  },
  {
    title: "Union Everywhere",
    value: 412,
    format: "int",
    label: "Shops Unionized",
    bg: "#FF2D20",
    text: "#F0EDE6",
    accent: "#050505",
    icon: HardHat,
  },
  {
    title: "Medicare For All",
    value: 63,
    format: "%",
    label: "National Support",
    bg: "#050505",
    text: "#F0EDE6",
    accent: "#C8F400",
    icon: Stethoscope,
  },
  {
    title: "Housing Is A Right",
    value: 140_000,
    format: "K",
    label: "Units Pledged",
    bg: "#F0EDE6",
    text: "#050505",
    accent: "#FF2D20",
    icon: HousePlus,
  },
  {
    title: "Public Power",
    value: 31,
    format: "int",
    label: "Cities Committed",
    bg: "#1A1A1A",
    text: "#C8F400",
    accent: "#C8F400",
    icon: TreePine,
  },
];

function formatStat(n: number, format: StatFormat) {
  if (format === "M") return `${(n / 1_000_000).toFixed(1)}M`;
  if (format === "K") return `${Math.round(n / 1000)}K`;
  if (format === "%") return `${Math.round(n)}%`;
  return `${Math.round(n)}`;
}

export default function HorizontalCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.round(self.progress * (CAMPAIGNS.length - 1));
            setActive(idx);
          },
        },
      });

      // Parallax icon inside each card
      gsap.utils.toArray<HTMLElement>(".campaign-icon").forEach((el) => {
        gsap.to(el, {
          x: -80,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: 1,
          },
        });
      });

      // Inner element reveals — once-only, so the last card's animations
      // cannot be left stuck by edge-of-pin ScrollTrigger evaluation.
      gsap.utils.toArray<HTMLElement>(".campaign-card").forEach((card) => {
        const title = card.querySelector(".campaign-title");
        if (title) {
          gsap.from(title, {
            y: 60,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 95%",
              once: true,
            },
          });
        }

        const statWrap = card.querySelector(".campaign-stat-wrap");
        if (statWrap) {
          gsap.from(statWrap, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left 95%",
              once: true,
            },
          });
        }
      });

      // Per-card count-up
      gsap.utils.toArray<HTMLElement>(".campaign-stat-num").forEach((el) => {
        const target = Number(el.dataset.target || "0");
        const format = (el.dataset.format || "int") as StatFormat;
        const counter = { v: 0 };
        gsap.to(counter, {
          v: target,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            containerAnimation: tween,
            start: "left 95%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = formatStat(counter.v, format);
          },
        });
      });

      // Section header entrance (plays before the pin engages)
      gsap.from(".hc-word", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".hc-heading",
          start: "top 85%",
        },
      });
      gsap.from(".hc-tag", {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hc-tag",
          start: "top 90%",
        },
      });
      gsap.from(".hc-counter", {
        opacity: 0,
        y: -12,
        duration: 0.7,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".hc-counter",
          start: "top 90%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="campaigns"
      className="relative h-screen overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none px-6 md:px-10 pt-8 flex justify-between items-start gap-6">
        <div>
          <span className="hc-tag inline-block font-label uppercase text-[11px] tracking-[0.3em] text-accent">
            / Our Campaigns
          </span>
          <h2 className="hc-heading font-display text-4xl md:text-6xl leading-[0.9] uppercase mt-3">
            <span className="block overflow-hidden">
              <span className="hc-word inline-block mr-[0.12em]">Six</span>
              <span className="hc-word inline-block mr-[0.12em]">Fights.</span>
              <span className="hc-word inline-block mr-[0.12em]">All</span>
              <span className="hc-word inline-block mr-[0.12em]">At</span>
              <span className="hc-word inline-block">Once.</span>
            </span>
          </h2>
        </div>
        <span className="hc-counter font-mono text-xs text-foreground/60 tabular-nums mt-2">
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(CAMPAIGNS.length).padStart(2, "0")}
        </span>
      </div>

      <div
        ref={trackRef}
        className="flex h-screen items-center gap-8 pl-6 md:pl-10 pr-6 md:pr-10 pt-40"
      >
        {CAMPAIGNS.map((c, i) => {
          const Icon = c.icon;
          return (
            <article
              key={c.title}
              className="campaign-card shrink-0 w-[82vw] md:w-[46vw] xl:w-[42vw] h-[72vh] relative overflow-hidden border border-foreground/10"
              style={{ background: c.bg, color: c.text }}
              data-cursor="explore"
            >
              <Icon
                className="campaign-icon absolute -right-10 -bottom-20 w-[30rem] h-[30rem] opacity-20 pointer-events-none"
                strokeWidth={0.8}
                style={{ color: c.accent }}
              />
              <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12">
                <div className="flex items-center justify-between">
                  <span
                    className="font-label uppercase text-[11px] tracking-[0.3em] opacity-70"
                    style={{ color: c.text }}
                  >
                    Campaign {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-mono text-[11px] opacity-70 flex items-center gap-2"
                    style={{ color: c.text }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: c.accent }}
                    />
                    Active
                  </span>
                </div>
                <div>
                  <h3 className="campaign-title font-display text-6xl md:text-8xl leading-[0.9] uppercase">
                    {c.title}
                  </h3>
                  <div
                    className="campaign-stat-wrap mt-10 flex items-baseline gap-4 border-t pt-6"
                    style={{ borderColor: `${c.text}33` }}
                  >
                    <span
                      className="campaign-stat-num font-display text-5xl md:text-7xl leading-none tabular-nums"
                      data-target={c.value}
                      data-format={c.format}
                    >
                      {formatStat(0, c.format)}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-70">
                      {c.label}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {/* Trailing spacer — gives the last card breathing room past the pin
            boundary so its inner animations can complete cleanly. */}
        <div className="shrink-0 w-[6vw] md:w-[10vw]" aria-hidden />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {CAMPAIGNS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "bg-accent w-10" : "bg-foreground/30 w-1.5"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
