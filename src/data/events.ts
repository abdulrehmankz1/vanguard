import type { LucideIcon } from "lucide-react";
import {
  Users,
  Mic,
  Phone,
  BookOpen,
  Megaphone,
  Heart,
} from "lucide-react";

export type EventType =
  | "Assembly"
  | "Town Hall"
  | "Phone Bank"
  | "Training"
  | "Rally"
  | "Mutual Aid";

export type EventStatus = "upcoming" | "past";

export type EventAgendaItem = {
  time: string;
  title: string;
  speaker?: string;
};

export type EventSpeaker = {
  name: string;
  title: string;
  photo: string;
};

export type EventRecord = {
  slug: string;
  title: string;
  /** ISO date — YYYY-MM-DD */
  date: string;
  startTime: string;
  endTime: string;
  city: string;
  state: string;
  venue: string;
  address: string;
  type: EventType;
  status: EventStatus;
  capacity: number;
  registered: number;
  image: string;
  excerpt: string;
  description: string[];
  agenda: EventAgendaItem[];
  speakers: EventSpeaker[];
};

export const EVENT_TYPE_ICONS: Record<EventType, LucideIcon> = {
  Assembly: Users,
  "Town Hall": Mic,
  "Phone Bank": Phone,
  Training: BookOpen,
  Rally: Megaphone,
  "Mutual Aid": Heart,
};

export const EVENTS: EventRecord[] = [
  {
    slug: "national-assembly-2026",
    title: "National Assembly 2026",
    date: "2026-06-15",
    startTime: "09:00",
    endTime: "18:00",
    city: "Detroit",
    state: "MI",
    venue: "Cobo Hall West",
    address: "1 Washington Blvd, Detroit, MI 48226",
    type: "Assembly",
    status: "upcoming",
    capacity: 4500,
    registered: 3120,
    image: "/images/events/featured.jpg",
    excerpt:
      "The biennial national assembly. Members elect leadership, ratify the next manifesto, and set campaign priorities for 2026–2028.",
    description: [
      "Every two years, every member of every chapter is invited to gather for three days of votes, panels, and workshops. The assembly is where Vanguard makes the decisions that bind everyone — endorsement criteria, dues structure, the next two-year campaign slate.",
      "This year's assembly will ratify the revised five-pillar manifesto, elect three new directors, and vote on the 2026–2028 organizing budget. Childcare, transit stipends, and accessibility accommodations are provided. No member is excluded for cost.",
    ],
    agenda: [
      { time: "09:00", title: "Doors open · Coffee + check-in" },
      { time: "10:00", title: "Opening address", speaker: "Amara Okonkwo" },
      { time: "11:30", title: "Manifesto ratification vote" },
      { time: "13:00", title: "Lunch · Chapter caucus rooms open" },
      { time: "14:30", title: "Director elections — round one" },
      { time: "16:00", title: "Campaign priority breakouts" },
      { time: "17:30", title: "Closing remarks", speaker: "Ilya Vargas" },
    ],
    speakers: [
      {
        name: "Amara Okonkwo",
        title: "Founding Director",
        photo:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Ilya Vargas",
        title: "Head of Technology",
        photo:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Jun Nakamura",
        title: "Director of Climate",
        photo:
          "https://images.unsplash.com/photo-1618835962148-cf177563c6c0?w=600&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    slug: "phone-bank-training-chicago",
    title: "Phone Bank Training",
    date: "2026-05-08",
    startTime: "18:30",
    endTime: "21:00",
    city: "Chicago",
    state: "IL",
    venue: "Logan Square Auditorium",
    address: "2539 N Kedzie Blvd, Chicago, IL 60647",
    type: "Training",
    status: "upcoming",
    capacity: 120,
    registered: 88,
    image: "/images/events/phone-bank.jpg",
    excerpt:
      "Two and a half hours of practice + scripts to prepare you for the spring canvass. New volunteers welcome — no experience required.",
    description: [
      "Phone banks are the most efficient way to reach voters who don't open their door. We'll cover script delivery, objection handling, the digital tools we use to log calls, and the logistics of running a bank from a chapter office.",
      "Bring your laptop or phone. We'll provide pizza, coffee, and the call list. Come away ready to run a bank for your own chapter the following week.",
    ],
    agenda: [
      { time: "18:30", title: "Doors open · Pizza + intros" },
      { time: "19:00", title: "Script walkthrough", speaker: "Kenji Abara" },
      { time: "19:30", title: "Live practice calls" },
      { time: "20:30", title: "Objection-handling roleplay" },
      { time: "20:50", title: "Q&A + chapter sign-up" },
    ],
    speakers: [
      {
        name: "Kenji Abara",
        title: "Field Organizing, Tech",
        photo:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    slug: "climate-town-hall-pittsburgh",
    title: "Climate Realism Town Hall",
    date: "2026-05-22",
    startTime: "19:00",
    endTime: "21:00",
    city: "Pittsburgh",
    state: "PA",
    venue: "August Wilson Center",
    address: "980 Liberty Ave, Pittsburgh, PA 15222",
    type: "Town Hall",
    status: "upcoming",
    capacity: 600,
    registered: 412,
    image: "/images/events/town-hall.jpg",
    excerpt:
      "An open-mic conversation with the Climate desk on the next decade of grid policy. Members + non-members welcome.",
    description: [
      "The transition isn't a slogan — it's a contracting question, a labor question, and a public-finance question. Come hear what the Climate desk has been working on, and bring the questions you can't get answered at any other town hall in town.",
    ],
    agenda: [
      { time: "19:00", title: "Doors + ASL interpreter check-in" },
      { time: "19:15", title: "Climate desk briefing", speaker: "Jun Nakamura" },
      { time: "20:00", title: "Open-floor questions" },
      { time: "20:50", title: "Closing + next steps" },
    ],
    speakers: [
      {
        name: "Jun Nakamura",
        title: "Director of Climate",
        photo:
          "https://images.unsplash.com/photo-1618835962148-cf177563c6c0?w=600&auto=format&fit=crop&q=80",
      },
      {
        name: "Dara Elkind",
        title: "Environmental Counsel",
        photo:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      },
    ],
  },
  {
    slug: "voter-registration-drive-atlanta",
    title: "Voter Registration Drive",
    date: "2026-04-12",
    startTime: "10:00",
    endTime: "16:00",
    city: "Atlanta",
    state: "GA",
    venue: "Centennial Olympic Park",
    address: "265 Park Ave W NW, Atlanta, GA 30313",
    type: "Rally",
    status: "past",
    capacity: 800,
    registered: 612,
    image: "/images/events/voter-drive.jpg",
    excerpt:
      "Six hours, four boroughs, six hundred new voter registrations. Thanks to everyone who showed up.",
    description: [
      "We registered 612 new voters in a single Saturday. Volunteers from 14 chapters drove in from across the South. The next drive is in October — sign up for the dispatch to hear about it first.",
    ],
    agenda: [],
    speakers: [],
  },
  {
    slug: "policy-workshop-brooklyn",
    title: "Housing Policy Workshop",
    date: "2026-03-29",
    startTime: "13:00",
    endTime: "17:00",
    city: "Brooklyn",
    state: "NY",
    venue: "BAM Fisher",
    address: "321 Ashland Pl, Brooklyn, NY 11217",
    type: "Training",
    status: "past",
    capacity: 200,
    registered: 178,
    image: "/images/events/policy-workshop.jpg",
    excerpt:
      "Four hours on tenant-organizing law, social housing models, and the policy levers your chapter can actually pull.",
    description: [
      "Recordings of the workshop are available to members in the dispatch archive. Slides and the full Q&A transcript are in the policy library.",
    ],
    agenda: [],
    speakers: [],
  },
  {
    slug: "mutual-aid-cleveland",
    title: "Mutual Aid Distribution",
    date: "2026-03-08",
    startTime: "08:00",
    endTime: "14:00",
    city: "Cleveland",
    state: "OH",
    venue: "Tremont Pointe",
    address: "2200 W 14th St, Cleveland, OH 44113",
    type: "Mutual Aid",
    status: "past",
    capacity: 300,
    registered: 267,
    image: "/images/events/mutual-aid.jpg",
    excerpt:
      "Groceries, diapers, winter coats. Distributed 12,000 lbs of supplies in six hours.",
    description: [
      "The Cleveland chapter ran a clean operation. Special thanks to the volunteers who unloaded trucks at 6am and the families who let us know where the gaps were.",
    ],
    agenda: [],
    speakers: [],
  },
];

export const getEvent = (slug: string) =>
  EVENTS.find((e) => e.slug === slug);

export const upcomingEvents = () =>
  EVENTS.filter((e) => e.status === "upcoming").sort((a, b) =>
    a.date.localeCompare(b.date),
  );

export const pastEvents = () =>
  EVENTS.filter((e) => e.status === "past").sort((a, b) =>
    b.date.localeCompare(a.date),
  );

export function formatEventDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatShortDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    year: d.getFullYear().toString(),
  };
}
