import type { Metadata } from "next";
import { BleedButton } from "@/components/ui/BleedButton";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { Mail, Calendar, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Welcome to the Movement",
  description:
    "Your transmission was received. Chapter Zero of the Vanguard Dispatch is on its way.",
  robots: { index: false, follow: false },
};

const NEXT_STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Mail,
    title: "Check Your Inbox",
    desc: "Chapter Zero of the Dispatch arrives within the next 24 hours. Whitelist us so it doesn't end up in promotions.",
  },
  {
    icon: Calendar,
    title: "Save The Assembly",
    desc: "Our next national assembly is the first Saturday of every month — calendar invite included in the welcome email.",
  },
  {
    icon: Share2,
    title: "Bring Someone In",
    desc: "Movements grow at the speed of word-of-mouth. Forward the dispatch to one person who needs it.",
  },
];

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen flex flex-col px-6 md:px-10 pt-32 md:pt-40 pb-20 noise overflow-hidden">
      {/* Soft palette blurs in the background */}
      <div
        aria-hidden
        className="absolute top-1/4 -left-20 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-10 w-[32rem] h-[32rem] rounded-full bg-urgent/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#f0ede6 1px, transparent 1px), linear-gradient(90deg, #f0ede6 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto w-full flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-4 font-label uppercase text-[11px] tracking-[0.35em] text-accent">
          <span className="w-10 h-px bg-accent" />
          <span>/ Transmission Received · 200 OK</span>
        </div>

        {/* Big headline */}
        <h1 className="mt-8 font-display uppercase leading-[0.85] text-[clamp(3.5rem,13vw,13rem)] tracking-brutal">
          <ChapterReveal text="Welcome To" className="block overflow-hidden" />
          <ChapterReveal
            text="The Movement."
            delay={0.4}
            className="block overflow-hidden text-accent"
          />
        </h1>

        {/* Sub-paragraph */}
        <p className="mt-10 max-w-xl font-grotesk text-[15px] md:text-[16px] text-foreground/70 leading-relaxed">
          Your email is on the list. Chapter Zero of the Vanguard Dispatch — a
          short, weekly field report — is being prepared and will land in your
          inbox shortly. Below is what happens next.
        </p>

        {/* Next steps grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {NEXT_STEPS.map((step) => (
            <Step key={step.title} {...step} />
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <BleedButton href="/" variant="card" size="lg">
            Back To Home
          </BleedButton>
          <BleedButton href="/#manifesto" variant="ghost" size="lg">
            Read The Manifesto
          </BleedButton>
        </div>

        {/* Footer meta */}
        <div className="mt-auto pt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/40">
          <span>{"// REF · CHAPTER_ZERO_DISPATCH"}</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Connection Live
          </span>
        </div>
      </div>
    </main>
  );
}

function Step({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <article className="relative bg-surface border border-muted/30 p-7 md:p-8 overflow-hidden">
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[2px] bg-accent/40"
      />
      <Icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
      <h3 className="mt-5 font-display text-2xl md:text-3xl uppercase leading-[0.95] tracking-wide">
        {title}
      </h3>
      <p className="mt-3 font-grotesk text-[14px] text-foreground/65 leading-relaxed">
        {desc}
      </p>
    </article>
  );
}
