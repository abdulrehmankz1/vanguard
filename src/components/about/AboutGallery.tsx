"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

type Frame = {
  src: string;
  caption: string;
  span: string;
  parallax: number; // px to translate; positive = moves down faster, negative = lags
  alt: string;
};

const FRAMES: Frame[] = [
  {
    src: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=1200&auto=format&fit=crop&q=85",
    alt: "Protesters carrying signs at a US march",
    caption: "03 / National March · Washington D.C.",
    span: "md:col-span-7 md:row-span-2 aspect-[4/3] md:aspect-auto",
    parallax: -40,
  },
  {
    src: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=900&auto=format&fit=crop&q=85",
    alt: "American flag waving against the sky",
    caption: "04 / Flag Day · Philadelphia",
    span: "md:col-span-5 aspect-[4/3]",
    parallax: 60,
  },
  {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&auto=format&fit=crop&q=85",
    alt: "Crowd at a US political rally",
    caption: "05 / Chapter Rally · Detroit",
    span: "md:col-span-5 aspect-[4/3]",
    parallax: -20,
  },
  {
    src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=1800&auto=format&fit=crop&q=85",
    alt: "Voters in line at a US polling station",
    caption: "06 / Voting Day · Atlanta",
    span: "md:col-span-12 aspect-[16/7]",
    parallax: 30,
  },
];

export function AboutGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Per-image parallax — each image translates a different distance
      gsap.utils
        .toArray<HTMLElement>(".gallery-frame")
        .forEach((frame) => {
          const img = frame.querySelector(".gallery-img") as HTMLElement | null;
          if (!img) return;
          const distance = Number(frame.dataset.parallax || 0);
          gsap.fromTo(
            img,
            { y: -distance },
            {
              y: distance,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });

      // Frame reveal — clip-path inset opens as it enters viewport
      gsap.utils
        .toArray<HTMLElement>(".gallery-frame")
        .forEach((frame, i) => {
          gsap.fromTo(
            frame,
            { clipPath: "inset(8% 8% 8% 8%)", opacity: 0 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
              duration: 1.1,
              delay: i * 0.06,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10 overflow-hidden"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / In The Field
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-7xl uppercase leading-[0.95] tracking-wide max-w-3xl">
              <ChapterReveal text="Pictures Of" className="block overflow-hidden" immediate />
              <ChapterReveal
                text="The Work."
                delay={0.3}
                className="block overflow-hidden text-accent"
                immediate
              />
            </h2>
          </div>
          <p className="md:max-w-sm font-grotesk text-[15px] text-foreground/60 leading-relaxed">
            Most of what we do is unglamorous and slow. A few frames from the
            week the photographer was around.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
          {FRAMES.map((f, i) => (
            <figure
              key={i}
              data-parallax={f.parallax}
              className={`gallery-frame group relative overflow-hidden border border-muted/30 bg-surface ${f.span}`}
            >
              <div className="gallery-img absolute -inset-y-12 inset-x-0">
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-[filter,transform] duration-700 ease-out"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background/65 via-transparent to-transparent pointer-events-none" />
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[2px] bg-accent/0 group-hover:bg-accent/80 transition-colors duration-500"
              />
              <figcaption className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
                <span>{f.caption}</span>
                <span className="opacity-60 group-hover:opacity-100 group-hover:text-accent transition-colors duration-300">
                  ↗
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
