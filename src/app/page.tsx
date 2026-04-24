import Hero from "@/components/sections/Hero";
import MarqueeTicker from "@/components/sections/MarqueeTicker";
import ManifestoGrid from "@/components/sections/ManifestoGrid";
import HorizontalCarousel from "@/components/sections/HorizontalCarousel";
import StatsCounter from "@/components/sections/StatsCounter";
import Leadership from "@/components/sections/Leadership";
import ParallaxQuote from "@/components/sections/ParallaxQuote";
import JoinCTA from "@/components/sections/JoinCTA";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <MarqueeTicker />
      <ManifestoGrid />
      <HorizontalCarousel />
      <StatsCounter />
      <Leadership />
      <ParallaxQuote />
      <JoinCTA />
    </main>
  );
}
