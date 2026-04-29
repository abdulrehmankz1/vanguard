import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import type { EventRecord } from "@/data/events";
import { EventCard } from "./EventCard";

export function RelatedEvents({ events }: { events: EventRecord[] }) {
  if (!events.length) return null;

  return (
    <section className="relative px-6 md:px-10 py-24 md:py-32 border-t border-foreground/10">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="font-display text-4xl md:text-5xl uppercase leading-[0.95] tracking-wide">
            <ChapterReveal text="More Events." className="block overflow-hidden" immediate />
          </h2>
          <Link
            href="/events"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-accent hover:underline"
          >
            View All
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {events.map((e) => (
            <EventCard key={e.slug} event={e} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}
