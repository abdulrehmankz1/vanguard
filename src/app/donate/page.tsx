import type { Metadata } from "next";
import {
  DonateHero,
  DonateImpact,
  DonateGoals,
  DonateForm,
  DonateFAQ,
} from "@/components/donate";

export const metadata: Metadata = {
  title: "Donate",
  description:
    "Vanguard takes zero corporate money and zero super-PAC money. Every dollar comes from members like you — and every dollar is spent in public, on the work. Average gift: $38.",
};

export default function DonatePage() {
  return (
    <main className="relative">
      <DonateHero />
      <DonateGoals />
      <DonateImpact />
      <DonateForm />
      <DonateFAQ />
    </main>
  );
}
