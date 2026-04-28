"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

export function AboutOrigin() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Each paragraph fades + rises, scrubbed against scroll
      gsap.utils.toArray<HTMLElement>(".origin-p").forEach((p, i) => {
        gsap.from(p, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: p,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.05,
        });
      });

      // Image parallax — rises slower than the surrounding column
      gsap.to(".origin-image", {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10"
    >
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Sticky aside heading */}
        <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start">
          <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
            / Founding Principle
          </span>
          <h2 className="mt-4 font-display text-5xl md:text-7xl uppercase leading-[0.95] tracking-wide">
            <ChapterReveal text="Built To" className="block overflow-hidden" immediate />
            <ChapterReveal
              text="Outlast Us."
              delay={0.3}
              className="block overflow-hidden text-accent"
              immediate
            />
          </h2>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/45">
            {"// Detroit Public Library · 2012"}
          </p>
        </aside>

        {/* Body + parallax image */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          <div className="origin-image-wrap md:col-span-5 relative aspect-[3/4] overflow-hidden border border-muted/30 self-start">
            <div className="origin-image relative w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1000&auto=format&fit=crop&q=80"
                alt="Organizers at a public library meeting"
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover grayscale hover:grayscale-0 transition-[filter] duration-700 ease-out"
              />
            </div>
            <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/70">
              02 / Reference Room · Floor 3
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 font-grotesk text-[16px] md:text-[17px] text-foreground/75 leading-[1.7]">
            <p className="origin-p">
              Vanguard was founded in a Detroit public library in 2012, by
              forty-seven people who had spent the previous decade watching the
              same political consultants sell the same stale playbook back to
              the same exhausted electorate.
            </p>
            <p className="origin-p">
              We started with a single conviction: the institutions we
              inherited are not the institutions we deserve, and the work of
              building better ones cannot wait for permission. So we wrote our
              own playbook in three days and printed a thousand copies on a
              cooperative press in Hamtramck.
            </p>
            <p className="origin-p">
              We are not a party. We are infrastructure. We train organizers,
              fund local candidates, run mutual-aid networks, and publish the
              Vanguard Dispatch — a weekly field report read by four million
              people. Every dollar we spend is published the week it&apos;s
              spent. Every internal vote is open to members.
            </p>
            <p className="origin-p">
              The work is generational. We measure success in decades, not
              cycles. The five pillars of our manifesto — economic sovereignty,
              digital rights, climate realism, global solidarity, and safety
              without surveillance — are not slogans. They are commitments
              enforced by the people who pay for them: our members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
