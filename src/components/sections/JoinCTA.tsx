"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Users, Globe, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const HEADING = "JOIN THE MOVEMENT";

export default function JoinCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const magneticRef = useMagneticEffect<HTMLButtonElement>(0.25);

  return (
    <section
      id="join"
      className="relative overflow-hidden px-6 md:px-10 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 42px)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto">
        <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
          / Chapter Zero
        </span>

        <h2 className="mt-6 font-display uppercase leading-[0.82] text-[clamp(3rem,12vw,12rem)] tracking-brutal">
          <ChapterReveal text={HEADING} className="block overflow-hidden" />
        </h2>

        <p className="mt-10 max-w-xl font-mono text-sm md:text-base text-foreground/70 leading-relaxed">
          Enter your email to receive the Vanguard Dispatch — field reports,
          policy briefs, and the next action you can take. No spam. No noise.
          Just movement.
        </p>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSubmitted(true);
            }}
            className="mt-12 grid md:grid-cols-[1fr_auto] gap-4 md:gap-6 max-w-2xl"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@movement.org"
              aria-label="Email address"
            />
            <motion.button
              ref={magneticRef}
              type="submit"
              data-cursor="hover"
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              className="relative overflow-hidden bg-accent text-background font-label uppercase text-sm tracking-[0.25em] px-10 py-5 flex items-center justify-center min-w-[200px] hover:bg-foreground transition-colors duration-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={hovered ? "go" : "join"}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 28,
                  }}
                  className="flex items-center gap-3"
                >
                  {hovered ? "Let's Go" : "Join Now"}
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </form>
        ) : (
          <div className="mt-12 max-w-2xl border border-accent p-6 font-mono text-sm">
            <p className="text-accent uppercase tracking-[0.25em] mb-2">
              / Transmission Received
            </p>
            <p className="text-foreground/80">
              You are on the list. Check your inbox — Chapter Zero begins
              tomorrow.
            </p>
          </div>
        )}

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl border-t border-muted/40 pt-10">
          <Badge
            icon={Shield}
            title="End-to-End Encrypted"
            desc="Your data is never sold, shared, or brokered."
          />
          <Badge
            icon={Users}
            title="4.2M Organizers"
            desc="The largest independent coalition of its kind."
          />
          <Badge
            icon={Globe}
            title="Operating in 180 Cities"
            desc="From Lagos to Lima. From Detroit to Dhaka."
          />
        </div>
      </div>
    </section>
  );
}

function Badge({
  icon: Icon,
  title,
  desc,
}: {
  icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <Icon className="w-6 h-6 text-accent shrink-0 mt-1" strokeWidth={1.5} />
      <div>
        <h4 className="font-label uppercase text-sm tracking-[0.2em]">
          {title}
        </h4>
        <p className="font-mono text-xs text-foreground/60 mt-1 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
