import type { Metadata } from "next";
import {
  VolunteerHero,
  VolunteerRoles,
  VolunteerProcess,
  VolunteerForm,
  VolunteerFAQ,
} from "@/components/volunteer";

export const metadata: Metadata = {
  title: "Volunteer",
  description:
    "Join 12,000+ volunteers building Vanguard from the ground up. Phone banks, canvasses, mutual aid, tech, translation. Five minutes to sign up — first shift inside a week.",
};

export default function VolunteerPage() {
  return (
    <main className="relative">
      <VolunteerHero />
      <VolunteerRoles />
      <VolunteerProcess />
      <VolunteerForm />
      <VolunteerFAQ />
    </main>
  );
}
