"use client";
import { useEffect, useRef } from "react";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#%&+=█▓▒░";

export type ScrambleEffect =
  | "scramble" // swap glyph + lift + accent (current default)
  | "lift"     // no glyph swap — just lift + accent tint
  | "magnet"   // letters are pulled toward the cursor
  | "blur";    // letters within radius blur + fade to accent

type Options = {
  /** How close (px) the cursor must be for a character to fully warp. */
  radius?: number;
  /** CSS selector matched inside the scoped ref. */
  selector?: string;
  /** Colour used for characters near the cursor. */
  accent?: string;
  /** Maximum vertical lift (px) applied to the closest character. */
  maxLift?: number;
  /** Visual style of the hover distortion. */
  effect?: ScrambleEffect;
};

/**
 * Cursor-proximity character warp for headings.
 *
 * Wraps every character of each matched element in a span. A rAF loop running
 * while the hook is alive measures each character's distance to the window
 * mouse position and applies a distance-graded distortion — the specific
 * distortion is chosen by `effect`:
 *
 *   scramble  — junk glyph + lift + accent (tactical glitch)
 *   lift      — just lift + accent, no glyph swap (clean, subtle)
 *   magnet    — letters pull toward the cursor
 *   blur      — letters blur + fade to accent
 */
export function useScrambleHover<T extends HTMLElement = HTMLElement>(
  options: Options = {},
) {
  const ref = useRef<T>(null);
  const radius = options.radius ?? 140;
  const selector = options.selector ?? "[data-cursor-scramble]";
  const accent = options.accent ?? "#C8F400";
  const maxLift = options.maxLift ?? 8;
  const effect: ScrambleEffect = options.effect ?? "scramble";

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!targets.length) return;

    type Cell = {
      el: HTMLSpanElement;
      original: string;
      lastSwap: number;
    };
    const cells: Cell[] = [];

    targets.forEach((target) => {
      if (target.querySelector("[data-cursor-cell]")) return;
      const text = target.textContent ?? "";
      if (!text) return;
      target.textContent = "";
      for (const ch of text) {
        const span = document.createElement("span");
        span.dataset.cursorCell = "";
        span.textContent = ch;
        span.style.display = "inline-block";
        span.style.transition =
          "color 120ms linear, transform 120ms ease-out, filter 120ms ease-out, opacity 120ms ease-out";
        span.style.willChange = "transform, color, filter";
        if (ch === " ") span.style.whiteSpace = "pre";
        target.appendChild(span);
        cells.push({ el: span, original: ch, lastSwap: 0 });
      }
    });

    if (!cells.length) return;

    const mouse = { x: -9999, y: -9999, alive: false };
    let rafId = 0;

    const resetCell = (cell: Cell) => {
      const { el, original } = cell;
      if (el.textContent !== original) el.textContent = original;
      if (el.style.color) el.style.color = "";
      if (el.style.transform) el.style.transform = "";
      if (el.style.filter) el.style.filter = "";
      if (el.style.opacity) el.style.opacity = "";
    };

    const tick = (now: number) => {
      for (const cell of cells) {
        const { el, original } = cell;
        if (!original.trim()) {
          rafId = requestAnimationFrame(tick);
          continue;
        }

        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouse.x - cx;
        const dy = mouse.y - cy;
        const d = Math.hypot(dx, dy);

        if (d < radius && mouse.alive) {
          const intensity = 1 - d / radius; // 0 → 1

          if (effect === "scramble") {
            const lift = -intensity * maxLift;
            const scale = 1 + intensity * 0.15;
            const shouldSwap = intensity > 0.15 && now - cell.lastSwap > 50;
            if (shouldSwap) {
              el.textContent =
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
              cell.lastSwap = now;
            } else if (intensity <= 0.15 && el.textContent !== original) {
              el.textContent = original;
            }
            el.style.color = accent;
            el.style.transform = `translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(3)})`;
          } else if (effect === "lift") {
            const lift = -intensity * maxLift;
            const scale = 1 + intensity * 0.08;
            if (el.textContent !== original) el.textContent = original;
            el.style.color = accent;
            el.style.transform = `translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(3)})`;
          } else if (effect === "magnet") {
            // Pull letters toward the cursor (capped)
            const pullCap = maxLift * 1.4;
            const px =
              d > 0 ? (dx / d) * intensity * pullCap : 0;
            const py =
              d > 0 ? (dy / d) * intensity * pullCap : 0;
            if (el.textContent !== original) el.textContent = original;
            el.style.color = accent;
            el.style.transform = `translate(${px.toFixed(2)}px, ${py.toFixed(2)}px)`;
          } else if (effect === "blur") {
            const blur = intensity * 4;
            const fade = 1 - intensity * 0.4;
            if (el.textContent !== original) el.textContent = original;
            el.style.color = accent;
            el.style.filter = `blur(${blur.toFixed(2)}px)`;
            el.style.opacity = fade.toFixed(3);
          }
        } else {
          resetCell(cell);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.alive = true;
    };
    const onLeaveDoc = () => {
      mouse.alive = false;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeaveDoc);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeaveDoc);
      cancelAnimationFrame(rafId);
      for (const cell of cells) resetCell(cell);
    };
  }, [radius, selector, accent, maxLift, effect]);

  return ref;
}
