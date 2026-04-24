"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Manifesto", href: "#manifesto" },
  { label: "Campaigns", href: "#campaigns" },
  { label: "Leadership", href: "#leadership" },
  { label: "Dispatch", href: "#join" },
];

type NavLinkProps = {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
};

function NavLink({ href, label, active, onClick }: NavLinkProps) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const topRef = useRef<HTMLSpanElement | null>(null);
  const bottomRef = useRef<HTMLSpanElement | null>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      const top = topRef.current;
      const bot = bottomRef.current;
      if (!el || !top || !bot) return;

      gsap.set(bot, { yPercent: 110 });

      const onEnter = () => {
        gsap.to(top, { yPercent: -110, duration: 0.7, ease: "expo.out" });
        gsap.to(bot, { yPercent: 0, duration: 0.7, ease: "expo.out" });
      };
      const onLeave = () => {
        gsap.to(top, { yPercent: 0, duration: 0.75, ease: "expo.out" });
        gsap.to(bot, { yPercent: 110, duration: 0.75, ease: "expo.out" });
      };

      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: rootRef },
  );

  return (
    <Link
      ref={rootRef}
      href={href}
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "relative inline-flex items-center gap-2.5 px-3 py-2 font-grotesk text-[14.5px] font-medium tracking-tight transition-colors",
        active
          ? "text-foreground"
          : "text-foreground/60 hover:text-foreground",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1 w-1 rounded-full bg-urgent transition-all duration-300",
          active ? "opacity-100 scale-100" : "opacity-0 scale-75",
        )}
      />
      <span
        aria-hidden
        className="relative inline-block overflow-hidden"
        style={{ height: "1.2em" }}
      >
        <span
          ref={topRef}
          className="inline-flex h-[1.2em] items-center will-change-transform"
        >
          {label}
        </span>
        <span
          ref={bottomRef}
          className="absolute left-0 top-0 inline-flex h-[1.2em] items-center will-change-transform"
        >
          {label}
        </span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  // Track any scroll past the very top — that drives the hairline + blur.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Mark the currently-in-view section as active
  useEffect(() => {
    const ids = Array.from(
      new Set(NAV_ITEMS.map((i) => i.href.replace("#", ""))),
    );
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full transition-all duration-300",
          scrolled ? "backdrop-blur-xl bg-background/70" : "bg-transparent",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 bottom-0 h-px bg-foreground/15 transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0",
          )}
        />

        <div
          className={cn(
            "max-w-[1600px] mx-auto px-6 md:px-10 flex items-center justify-between gap-8 transition-[height] duration-300",
            scrolled ? "h-[76px]" : "h-[108px]",
          )}
        >
          <Link
            href="#"
            aria-label="Vanguard home"
            data-cursor="hover"
            className="flex items-baseline gap-[3px] leading-none"
          >
            <span className="font-display text-[2rem] md:text-[2.4rem] leading-none tracking-wider text-foreground">
              VANGUARD
            </span>
            <span className="font-display text-[2rem] md:text-[2.4rem] leading-none text-urgent">
              .
            </span>
          </Link>

          <div className="flex items-center gap-5 lg:gap-7">
            <nav
              aria-label="Primary"
              className="hidden items-center lg:flex"
            >
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  active={active === item.href.replace("#", "")}
                />
              ))}
            </nav>

            <span
              aria-hidden
              className="hidden h-6 w-px bg-foreground/15 lg:block"
            />

            <MagneticButton
              href="#join"
              variant="invert"
              size="md"
              className="hidden sm:inline-flex"
            >
              Get Involved
            </MagneticButton>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 text-foreground"
              data-cursor="hover"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background noise"
          >
            <div className="relative z-10 flex justify-between items-center px-6 h-24">
              <span className="font-display text-3xl tracking-wider">
                VANGUARD<span className="text-urgent">.</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                data-cursor="hover"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <ul className="relative z-10 flex flex-col px-6 mt-8 gap-4">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-6xl tracking-wide block border-b border-muted/30 pb-4"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
