import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { formatEventDate, type EventRecord } from "@/data/events";

export function EventMetaStrip({ event }: { event: EventRecord }) {
  const pct = Math.round((event.registered / event.capacity) * 100);

  return (
    <section className="relative px-6 md:px-10 border-t border-foreground/10">
      <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4">
        <MetaCell icon={Calendar} label="Date" value={formatEventDate(event.date)} />
        <MetaCell
          icon={Clock}
          label="Hours"
          value={`${event.startTime} – ${event.endTime}`}
          className="border-l border-foreground/10"
        />
        <MetaCell
          icon={MapPin}
          label="Location"
          value={`${event.venue} · ${event.city}, ${event.state}`}
          className="md:border-l border-foreground/10 border-t md:border-t-0"
        />
        <MetaCell
          icon={Users}
          label="Capacity"
          value={`${event.registered.toLocaleString()} / ${event.capacity.toLocaleString()} (${pct}%)`}
          className="border-l border-foreground/10 border-t md:border-t-0"
        />
      </div>
    </section>
  );
}

function MetaCell({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`py-6 px-4 md:px-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
          {label}
        </span>
      </div>
      <p className="font-grotesk text-[14px] md:text-[15px] text-foreground/85 leading-tight">
        {value}
      </p>
    </div>
  );
}
