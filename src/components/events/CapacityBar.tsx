/**
 * Reusable capacity / progress bar — used by FeaturedEventCard and the
 * Register section on the detail page.
 */
export function CapacityBar({
  pct,
  className = "",
  thin = false,
}: {
  pct: number;
  className?: string;
  thin?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-foreground/10 ${
        thin ? "h-px" : "h-1"
      } ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 bg-accent"
        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
      />
    </div>
  );
}
