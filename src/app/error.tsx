"use client";

import { useEffect } from "react";
import { BleedButton } from "@/components/ui/BleedButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Send to your error reporting service (Sentry, LogRocket, etc.) here.
    // Console for now so failures are still visible during local dev.
    console.error("[VANGUARD] Unhandled route error:", error);
  }, [error]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      <span className="font-label uppercase text-[11px] tracking-[0.35em] text-urgent">
        / System Fault
      </span>

      <h1 className="mt-6 font-display uppercase leading-[0.85] text-[clamp(4rem,14vw,14rem)] tracking-brutal text-foreground">
        Something
        <br />
        Broke.
      </h1>

      <p className="mt-8 max-w-md font-grotesk text-[15px] text-foreground/60 leading-relaxed">
        An unexpected error stopped the page from rendering. The team has been
        notified. You can try again below.
      </p>

      {error.digest && (
        <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-foreground/35 uppercase">
          Ref · {error.digest}
        </p>
      )}

      <div className="mt-12">
        <BleedButton onClick={reset} variant="card" size="lg">
          Try Again
        </BleedButton>
      </div>
    </main>
  );
}
