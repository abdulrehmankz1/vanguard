"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

const LINES = [
  "They built a century",
  "on our silence.",
  "We are done being quiet.",
];
const LINE_SPEEDS = [0.8, 1, 1.2];

export default function ParallaxQuote() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Per-line parallax
      gsap.utils.toArray<HTMLElement>(".quote-line").forEach((line, i) => {
        gsap.to(line, {
          yPercent: (LINE_SPEEDS[i] - 1) * -50,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Word-by-word clip reveal
      gsap.utils.toArray<HTMLElement>(".quote-word-inner").forEach((el) => {
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
      gsap.utils.toArray<HTMLElement>(".quote-particle").forEach((el, i) => {
        gsap.to(el, {
          y: -35,
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
      className="relative min-h-[120vh] flex items-center justify-center overflow-hidden px-6 md:px-10 py-32"
    >
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

      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className="quote-particle absolute w-1.5 h-1.5 rounded-full bg-accent/70"
          style={{
            top: `${12 + ((i * 11) % 75)}%`,
            left: `${8 + ((i * 17) % 82)}%`,
          }}
        />
      ))}

      <blockquote className="relative z-10 max-w-[1400px] mx-auto">
        {LINES.map((line, i) => (
          <div
            key={i}
            className="quote-line font-display uppercase leading-[0.9] text-[clamp(3rem,10vw,11rem)] tracking-brutal"
          >
            {line.split(" ").map((word, j) => (
              <span
                key={j}
                className={`inline-block overflow-hidden align-top mr-[0.2em] ${
                  i === 2 ? "text-accent" : ""
                }`}
              >
                <span className="quote-word-inner inline-block">{word}</span>
              </span>
            ))}
          </div>
        ))}
        <footer className="mt-14 flex items-center gap-4 font-mono text-xs md:text-sm text-foreground/60 uppercase tracking-[0.25em]">
          <span className="w-8 h-px bg-accent" />
          From the founding address, Vanguard Assembly — 2012
        </footer>
      </blockquote>
    </section>
  );
}
