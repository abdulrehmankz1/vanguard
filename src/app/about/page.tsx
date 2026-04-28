import type { Metadata } from "next";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutOrigin } from "@/components/about/AboutOrigin";
import { AboutValues } from "@/components/about/AboutValues";
import { AboutGallery } from "@/components/about/AboutGallery";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutQuote } from "@/components/about/AboutQuote";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vanguard is a coalition of workers, technologists, and neighbors building the political infrastructure of the next century.",
};

export default function AboutPage() {
  return (
    <main className="relative">
      <AboutHero />
      <AboutOrigin />
      <AboutValues />
      <AboutGallery />
      <AboutTimeline />
      <AboutQuote />
      <AboutCTA />
    </main>
  );
}
