import type { Metadata } from "next";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import {
  EventsListingHero,
  FeaturedEventCard,
  EventCard,
  PastEventRow,
  EventsCTA,
  AnimatedGrid,
} from "@/components/events";
import { upcomingEvents, pastEvents, EVENTS } from "@/data/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Assemblies, town halls, phone banks, trainings, and mutual-aid drives. Where the work happens — and where you can join in.",
};

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  const featured = upcoming[0];
  const rest = upcoming.slice(1);

  // Aggregated stats for the hero strip
  const cities = new Set(EVENTS.map((e) => `${e.city}, ${e.state}`)).size;
  const totalRegistered = EVENTS.reduce((sum, e) => sum + e.registered, 0);

  return (
    <main className="relative">
      <EventsListingHero
        upcomingCount={upcoming.length}
        pastCount={past.length}
        citiesCount={cities}
        totalRegistered={totalRegistered}
        nextEvent={featured ?? null}
        upcoming={upcoming}
      />

      {featured && (
        <section className="relative px-6 md:px-10 pb-16 md:pb-24">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-8 flex items-baseline justify-between">
              <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
                / Featured · Next Up
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                01 / {String(upcoming.length).padStart(2, "0")}
              </span>
            </div>
            <FeaturedEventCard event={featured} />
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section
          id="also-coming-up"
          className="relative px-6 md:px-10 py-16 md:py-24 border-t border-foreground/10 scroll-mt-24"
        >
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
                <ChapterReveal text="Also Coming Up." className="block overflow-hidden" immediate />
              </h2>
              <p className="md:max-w-xs font-grotesk text-[14px] text-foreground/60 leading-relaxed">
                Filterable by chapter and type. Click any card for the full
                briefing and registration.
              </p>
            </div>
            <AnimatedGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {rest.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </AnimatedGrid>
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section className="relative px-6 md:px-10 py-16 md:py-24 border-t border-foreground/10">
          <div className="max-w-[1600px] mx-auto">
            <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
                <ChapterReveal text="Past Reports." className="block overflow-hidden" immediate />
              </h2>
              <p className="md:max-w-xs font-grotesk text-[14px] text-foreground/60 leading-relaxed">
                What we did, who showed up, and what came of it. Recordings &
                slides in the dispatch archive.
              </p>
            </div>
            <ol className="border-t border-foreground/15">
              {past.map((e, i) => (
                <PastEventRow key={e.slug} event={e} index={i} />
              ))}
            </ol>
          </div>
        </section>
      )}

      <EventsCTA />
    </main>
  );
}
