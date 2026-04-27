"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "accent" | "invert" | "ghost";
type Size = "md" | "lg";

type Props = {
  children: ReactNode;
  /** Renders as an anchor (Link) when provided; otherwise a `<button>`. */
  href?: string;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Hide the trailing arrow if false. */
  showArrow?: boolean;
  external?: boolean;
};

const VARIANT: Record<
  Variant,
  { base: string; fill: string; restText: string; hoverText: string }
> = {
  // Default acid-green button → fills to warm-white
  accent: {
    base: "bg-accent",
    fill: "bg-foreground",
    restText: "text-background",
    hoverText: "text-background",
  },
  // Warm-white button → fills to acid-green
  invert: {
    base: "bg-foreground",
    fill: "bg-accent",
    restText: "text-background",
    hoverText: "text-background",
  },
  // Transparent / outlined dark button → fills to warm-white. Text flips
  // from foreground (light) to background (dark) so it stays readable
  // against either state. Designed for use on dark surfaces (e.g. navbar).
  ghost: {
    base: "bg-transparent border border-foreground/25",
    fill: "bg-foreground",
    restText: "text-foreground",
    hoverText: "text-background",
  },
};

const SIZE: Record<Size, string> = {
  md: "h-11 px-5 text-[13px] min-w-[140px] gap-2",
  lg: "h-14 px-7 text-[15px] min-w-[200px] gap-2.5",
};

export function BleedButton({
  children,
  href,
  type = "button",
  variant = "accent",
  size = "lg",
  className,
  showArrow = true,
  external,
}: Props) {
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });

  const handleEnter = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHovered(true);
  };

  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setHovered(false);
  };

  const v = VARIANT[variant];

  const baseClass = cn(
    "relative overflow-hidden font-grotesk font-medium tracking-tight flex items-center justify-center",
    v.base,
    SIZE[size],
    className,
  );

  const inner = (
    <>
      <motion.span
        aria-hidden
        className={cn("absolute inset-0", v.fill)}
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{
          clipPath: hovered
            ? `circle(160% at ${origin.x}% ${origin.y}%)`
            : `circle(0% at ${origin.x}% ${origin.y}%)`,
        }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      />
      <span
        className={cn(
          "relative z-10 flex items-center gap-2.5 transition-colors duration-300",
          hovered ? v.hoverText : v.restText,
        )}
      >
        {children}
        {showArrow && <ArrowRight className="w-4 h-4" strokeWidth={2} />}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        data-cursor="hover"
        className={baseClass}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      data-cursor="hover"
      className={baseClass}
    >
      {inner}
    </button>
  );
}
