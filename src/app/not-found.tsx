import { BleedButton } from "@/components/ui/BleedButton";

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 noise overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/3 -left-20 w-[28rem] h-[28rem] rounded-full bg-accent/10 blur-3xl pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-10 w-[32rem] h-[32rem] rounded-full bg-urgent/10 blur-3xl pointer-events-none"
      />

      <span className="font-label uppercase text-[11px] tracking-[0.35em] text-accent">
        / 404 — Off the Map
      </span>

      <h1 className="mt-6 font-display uppercase leading-[0.85] text-[clamp(5rem,18vw,18rem)] tracking-brutal text-foreground">
        Lost.
      </h1>

      <p className="mt-8 max-w-md font-grotesk text-[15px] text-foreground/60 leading-relaxed">
        That page is not part of the manifesto. The route you followed leads
        nowhere — but the work continues.
      </p>

      <div className="mt-12">
        <BleedButton href="/" variant="card" size="lg">
          Return Home
        </BleedButton>
      </div>
    </main>
  );
}
