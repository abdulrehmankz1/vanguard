"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "invert" | "accent";
type Size = "md" | "lg";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  variant?: Variant;
  size?: Size;
};

const variantClasses: Record<Variant, string> = {
  solid:
    "bg-foreground text-background border-foreground hover:bg-accent hover:text-background hover:border-accent",
  ghost:
    "bg-transparent text-foreground border-foreground/25 hover:border-foreground",
  invert:
    "bg-foreground text-background border-foreground hover:bg-accent hover:border-accent",
  accent:
    "bg-accent text-background border-accent hover:bg-foreground hover:text-background hover:border-foreground",
};

const sizeClasses: Record<Size, string> = {
  md: "px-4 py-2 text-[14px] gap-2.5",
  lg: "px-5 py-2.5 text-[15px] gap-3",
};

export function MagneticButton({
  href,
  children,
  className,
  external,
  variant = "solid",
  size = "lg",
}: Props) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const labelAltRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);

  useGSAP(
    () => {
      const el = rootRef.current;
      const label = labelRef.current;
      const labelAlt = labelAltRef.current;
      const icon = iconRef.current;
      const ring = ringRef.current;
      if (!el || !label || !labelAlt || !icon || !ring) return;

      gsap.set(labelAlt, { yPercent: 110 });
      gsap.set(ring, { strokeDashoffset: 90 });

      const onEnter = () => {
        gsap.to(label, { yPercent: -110, duration: 0.45, ease: "expo.out" });
        gsap.to(labelAlt, { yPercent: 0, duration: 0.45, ease: "expo.out" });
        gsap.to(icon, { rotate: 45, duration: 0.5, ease: "back.out(2)" });
        gsap.to(ring, {
          strokeDashoffset: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      };

      const onLeave = () => {
        gsap.to(label, { yPercent: 0, duration: 0.5, ease: "expo.out" });
        gsap.to(labelAlt, { yPercent: 110, duration: 0.5, ease: "expo.out" });
        gsap.to(icon, { rotate: 0, duration: 0.5, ease: "power3.out" });
        gsap.to(ring, {
          strokeDashoffset: 90,
          duration: 0.7,
          ease: "power3.out",
        });
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
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      data-cursor="hover"
      className={cn(
        "group relative inline-flex items-center rounded-full border font-grotesk font-medium tracking-tight transition-colors duration-500",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      <span
        aria-hidden
        className="relative inline-block overflow-hidden"
        style={{ height: "1.4em" }}
      >
        <span
          ref={labelRef}
          className="inline-flex h-[1.4em] items-center align-baseline leading-none will-change-transform"
        >
          {children}
        </span>
        <span
          ref={labelAltRef}
          className="absolute left-0 top-0 inline-flex h-[1.4em] items-center leading-none will-change-transform"
        >
          {children}
        </span>
      </span>

      <span className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 32 32"
          fill="none"
          aria-hidden
        >
          <circle
            cx="16"
            cy="16"
            r="14.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.2"
          />
          <circle
            ref={ringRef}
            cx="16"
            cy="16"
            r="14.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeDasharray="90"
            strokeDashoffset="90"
            strokeLinecap="round"
            className="will-change-[stroke-dashoffset]"
          />
        </svg>
        <span
          ref={iconRef}
          className="inline-flex h-3 w-3 items-center justify-center will-change-transform"
        >
          <ArrowUpRight className="h-full w-full" strokeWidth={2} />
        </span>
      </span>
    </Link>
  );
}
