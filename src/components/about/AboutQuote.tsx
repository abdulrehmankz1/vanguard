"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

const LINES = [
  "We did not start a political party.",
  "We started an institution that could",
  "outlast the people who started it.",
];
const LINE_SPEEDS = [0.85, 1, 1.15];

export function AboutQuote() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Per-line parallax — different speeds
      gsap.utils.toArray<HTMLElement>(".aq-line").forEach((line, i) => {
        gsap.to(line, {
          yPercent: (LINE_SPEEDS[i] - 1) * -45,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Word-by-word clip reveal scrubbed against scroll
      gsap.utils.toArray<HTMLElement>(".aq-word-inner").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 100 },
          {
            yPercent: 0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "top 55%",
              scrub: 1,
            },
          },
        );
      });

      // Floating dot particles
      gsap.utils.toArray<HTMLElement>(".aq-particle").forEach((el, i) => {
        gsap.to(el, {
          y: -30,
          x: i % 2 === 0 ? 22 : -22,
          duration: 4 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10 overflow-hidden"
    >
      {/* Animated mesh background */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(200,244,0,0.10), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,45,32,0.08), transparent 55%)",
            "radial-gradient(circle at 70% 20%, rgba(200,244,0,0.10), transparent 55%), radial-gradient(circle at 30% 80%, rgba(255,45,32,0.08), transparent 55%)",
            "radial-gradient(circle at 40% 60%, rgba(200,244,0,0.10), transparent 55%), radial-gradient(circle at 60% 40%, rgba(255,45,32,0.08), transparent 55%)",
            "radial-gradient(circle at 20% 30%, rgba(200,244,0,0.10), transparent 55%), radial-gradient(circle at 80% 70%, rgba(255,45,32,0.08), transparent 55%)",
          ],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />

      {/* Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="aq-particle absolute w-1.5 h-1.5 rounded-full bg-accent/70"
          style={{
            top: `${12 + ((i * 11) % 75)}%`,
            left: `${8 + ((i * 17) % 82)}%`,
          }}
        />
      ))}

      <div className="relative z-10 max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Quote */}
        <blockquote className="lg:col-span-8">
          <span
            aria-hidden
            className="font-display text-7xl md:text-9xl text-accent leading-none block"
          >
            &ldquo;
          </span>
          <div className="mt-2">
            {LINES.map((line, i) => (
              <div
                key={i}
                className={`aq-line font-display uppercase leading-[0.95] text-[clamp(2.5rem,6.5vw,5.5rem)] tracking-brutal ${
                  i === 2 ? "text-accent" : ""
                }`}
              >
                {line.split(" ").map((word, j) => (
                  <span
                    key={j}
                    className="inline-block overflow-hidden align-top mr-[0.2em]"
                  >
                    <span className="aq-word-inner inline-block">{word}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
          <footer className="mt-10 flex items-center gap-4 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-foreground/55">
            <span className="w-8 h-px bg-accent" />
            Amara Okonkwo · Founding Director
          </footer>
        </blockquote>

        {/* Portrait */}
        <motion.figure
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 relative aspect-[3/4] overflow-hidden border border-muted/30 group"
        >
          <Image
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=80"
            alt="Amara Okonkwo, founding director"
            fill
            sizes="(min-width: 1024px) 28vw, 100vw"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-[filter,transform] duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          <figcaption className="absolute bottom-5 left-5 right-5 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80">
            07 / Amara Okonkwo · 2024 Assembly
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}
