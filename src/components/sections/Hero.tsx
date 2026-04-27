"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BleedButton } from "@/components/ui/BleedButton";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".hero-fade-in", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        delay: 1.3,
        ease: "power2.out",
      });

      // Scroll-out: translate only, NO opacity fade on the subcopy/button so they
      // stay readable until they naturally leave the viewport.
      const st = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      } as const;
      gsap.to(".hero-tag", { y: -30, ease: "none", scrollTrigger: st });
      gsap.to(".hero-headline", { y: -60, ease: "none", scrollTrigger: st });
      gsap.to(".hero-subcopy", { y: -30, ease: "none", scrollTrigger: st });

      gsap.to(".hero-bg-layer", {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Full-bleed particle field across the whole hero (2× density)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const PARTICLE_COUNT = 208;
    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
    }[] = [];

    const seed = () => {
      particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: (Math.random() * 1.6 + 0.8) * dpr,
      }));
    };

    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      seed();
    };
    resize();

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * dpr;
      mouse.y = (e.clientY - rect.top) * dpr;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);

    const connectDist = 150 * dpr;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        const dxM = p.x - mouse.x;
        const dyM = p.y - mouse.y;
        const dM = Math.hypot(dxM, dyM);
        if (dM < 180 * dpr && dM > 0) {
          p.x += (dxM / dM) * 0.6;
          p.y += (dyM / dM) * 0.6;
        }

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < connectDist) {
            const a = 0.16 - (d / connectDist) * 0.16;
            ctx.strokeStyle = `rgba(200,244,0,${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = "rgba(200,244,0,0.9)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden noise"
    >
      {/* Full-bleed particle canvas (background) */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="absolute inset-0 w-full h-full -z-0"
      />

      {/* Soft colour blobs + dim grid behind the canvas */}
      <div className="hero-bg-layer absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[30rem] h-[30rem] rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 w-[36rem] h-[36rem] rounded-full bg-urgent/10 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#f0ede6 1px, transparent 1px), linear-gradient(90deg, #f0ede6 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Radial vignette keeps centre type legible against the particle field */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.25) 45%, rgba(5,5,5,0) 80%)",
        }}
      />

      {/* HUD corner labels pinned to the section */}
      <div className="pointer-events-none absolute top-28 left-6 md:left-10 font-mono text-[10px] tracking-[0.3em] text-accent/70 uppercase z-10">
        {"// Network_Signal_01"}
      </div>
      <div className="pointer-events-none absolute top-28 right-6 md:right-10 font-mono text-[10px] text-accent flex items-center gap-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        LIVE
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 md:left-10 font-mono text-[10px] text-foreground/50 z-10">
        {"// VANGUARD_ASSEMBLY_2026"}
      </div>
      <div className="pointer-events-none absolute bottom-6 right-6 md:right-10 font-mono text-[10px] text-foreground/50 text-right z-10">
        LAT 40.7128
        <br />
        LON -74.0060
      </div>

      {/* Centered content stack */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-10 max-w-[1760px] mx-auto gap-10 pt-24 pb-20">
        <div className="hero-tag hero-fade-in flex items-center gap-4 font-label uppercase text-[11px] tracking-[0.35em] text-accent">
          <span className="w-10 h-px bg-accent" />
          <span>Political Movement / Est. 2012</span>
          <span className="w-10 h-px bg-accent" />
        </div>

        <h1 className="hero-headline w-full max-w-[1700px] font-display leading-[0.82] uppercase text-[clamp(4rem,14vw,15rem)] tracking-brutal">
          <ChapterReveal text="The Future" className="block overflow-hidden" />
          <ChapterReveal
            text="Is Not Given."
            delay={0.35}
            className="block overflow-hidden text-foreground/25"
          />
          <ChapterReveal
            text="It Is Taken."
            delay={0.75}
            className="block overflow-hidden text-accent"
          />
        </h1>

        <div className="hero-subcopy hero-fade-in flex flex-col items-center gap-8 max-w-2xl">
          <p className="font-grotesk text-[15px] md:text-[16px] text-foreground/70 leading-relaxed">
            We are organizing the first generation unwilling to inherit broken
            institutions — a coalition of workers, technologists, and neighbors
            building the political infrastructure of the next century.
          </p>
          <BleedButton href="#join" variant="accent" size="lg">
            Join The Movement
          </BleedButton>
        </div>
      </div>
    </section>
  );
}
