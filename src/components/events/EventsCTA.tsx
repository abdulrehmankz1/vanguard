import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { BleedButton } from "@/components/ui/BleedButton";

/**
 * Outro CTA used at the bottom of the events listing — encourages dispatch
 * subscription so users hear about new events first.
 */
export function EventsCTA() {
  return (
    <section className="relative px-6 md:px-10 py-28 md:py-40 border-t border-foreground/10 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 42px)",
        }}
      />
      <div className="relative max-w-[1400px] mx-auto text-center flex flex-col items-center">
        <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
          / Stay In The Loop
        </span>
        <h2 className="mt-6 font-display uppercase leading-[0.85] text-[clamp(3rem,10vw,9rem)] tracking-brutal max-w-4xl">
          <ChapterReveal text="The Dispatch" className="block overflow-hidden" immediate />
          <ChapterReveal
            text="Knows First."
            delay={0.3}
            className="block overflow-hidden text-accent"
            immediate
          />
        </h2>
        <p className="mt-8 max-w-xl font-grotesk text-[15px] md:text-[16px] text-foreground/70 leading-relaxed">
          Subscribe to the weekly dispatch and you&apos;ll hear about new
          events 48 hours before the public list updates.
        </p>
        <div className="mt-10">
          <BleedButton href="/#join" variant="card" size="lg">
            Join The Dispatch
          </BleedButton>
        </div>
      </div>
    </section>
  );
}
