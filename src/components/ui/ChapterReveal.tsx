"use client";
import { motion } from "framer-motion";

type Props = {
  /** The string to reveal one character at a time. */
  text: string;
  /** Seconds to wait before the first character animates. */
  delay?: number;
  /** Seconds added per character index. */
  staggerStep?: number;
  /** Optional className applied to the wrapping span. */
  className?: string;
  /** Viewport margin string passed through to Framer's `viewport.margin`. */
  margin?: string;
  /** Per-character animation duration in seconds. */
  duration?: number;
  /** Initial Y offset (px) each character rises from. */
  rise?: number;
  /**
   * Skip in-view detection and animate on mount. Useful inside pinned /
   * transformed sections where IntersectionObserver doesn't fire reliably.
   */
  immediate?: boolean;
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * The "Chapter Zero" character reveal: each character of `text` rises from
 * `rise` px below at `opacity: 0` and animates back to its natural position
 * with a `staggerStep` delay per character. Triggered once when the wrapper
 * enters the viewport — or on mount if `immediate` is set.
 *
 * For multi-line headings, render one `<ChapterReveal>` per line and pass
 * an increasing `delay` so the lines reveal sequentially.
 */
export function ChapterReveal({
  text,
  delay = 0,
  staggerStep = 0.03,
  className,
  margin = "0px",
  duration = 0.7,
  rise = 80,
  immediate = false,
}: Props) {
  const motionProps = immediate
    ? {
        initial: { y: rise, opacity: 0 },
        animate: { y: 0, opacity: 1 },
      }
    : {
        initial: { y: rise, opacity: 0 },
        whileInView: { y: 0, opacity: 1 },
        viewport: { once: true, margin },
      };

  return (
    <span className={className}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          {...motionProps}
          transition={{
            delay: delay + i * staggerStep,
            duration,
            ease: EASE,
          }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
