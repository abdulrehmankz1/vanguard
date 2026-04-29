import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  EventHero,
  EventMetaStrip,
  EventBriefing,
  EventSpeakers,
  EventRegister,
  RelatedEvents,
} from "@/components/events";
import { EVENTS, getEvent } from "@/data/events";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return EVENTS.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const event = getEvent(params.slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.title,
    description: event.excerpt,
    openGraph: {
      title: event.title,
      description: event.excerpt,
      images: [{ url: event.image }],
    },
  };
}

export default function EventDetailsPage({ params }: Props) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  const related = EVENTS.filter(
    (e) => e.slug !== event.slug && e.status === event.status,
  ).slice(0, 3);

  return (
    <main className="relative">
      <EventHero event={event} />
      <EventMetaStrip event={event} />
      <EventBriefing event={event} />
      <EventSpeakers speakers={event.speakers} />
      <EventRegister event={event} />
      <RelatedEvents events={related} />
    </main>
  );
}
