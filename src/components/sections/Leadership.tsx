"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Select, { type StylesConfig } from "react-select";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

type Leader = {
  name: string;
  title: string;
  dept: "Economic" | "Tech" | "Environment";
  photo: string;
};

const LEADERS: Leader[] = [
  {
    name: "Amara Okonkwo",
    title: "Executive Director",
    dept: "Economic",
    photo:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Ilya Vargas",
    title: "Head of Technology",
    dept: "Tech",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Jun Nakamura",
    title: "Director of Climate",
    dept: "Environment",
    photo:
      "https://images.unsplash.com/photo-1618835962148-cf177563c6c0?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Rosa Lindqvist",
    title: "Economic Policy Lead",
    dept: "Economic",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Kenji Abara",
    title: "Field Organizing, Tech",
    dept: "Tech",
    photo:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1000&auto=format&fit=crop&q=80",
  },
  {
    name: "Dara Elkind",
    title: "Environmental Counsel",
    dept: "Environment",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&auto=format&fit=crop&q=80",
  },
];

type Opt = { value: "all" | Leader["dept"]; label: string };

const OPTIONS: Opt[] = [
  { value: "all", label: "All Departments" },
  { value: "Economic", label: "Economic" },
  { value: "Tech", label: "Tech" },
  { value: "Environment", label: "Environment" },
];

const selectStyles: StylesConfig<Opt, false> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#0F0F0F",
    borderColor: state.isFocused ? "#C8F400" : "#3A3A3A",
    borderWidth: 1,
    borderRadius: 0,
    minHeight: 52,
    boxShadow: "none",
    cursor: "none",
    "&:hover": { borderColor: "#C8F400" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#0F0F0F",
    border: "1px solid #3A3A3A",
    borderRadius: 0,
    marginTop: 0,
    overflow: "hidden",
  }),
  menuList: (base) => ({ ...base, padding: 0 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#C8F400" : "#0F0F0F",
    color: state.isFocused ? "#050505" : "#F0EDE6",
    fontFamily: "var(--font-barlow), sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: 13,
    padding: "14px 16px",
    cursor: "none",
    borderTop: state.isFocused ? "1px solid #C8F400" : "1px solid transparent",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#F0EDE6",
    fontFamily: "var(--font-barlow), sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: 13,
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 16px" }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#C8F400",
    paddingRight: 14,
  }),
  placeholder: (base) => ({ ...base, color: "#3A3A3A" }),
};

export default function Leadership() {
  const sectionRef = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Opt>(OPTIONS[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(
    () =>
      filter.value === "all"
        ? LEADERS
        : LEADERS.filter((l) => l.dept === filter.value),
    [filter],
  );

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".leadership-tag", {
        opacity: 0,
        x: -20,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: ".leadership-tag", start: "top 90%" },
      });

      gsap.from(".leadership-sub", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: ".leadership-sub", start: "top 90%" },
      });

      gsap.fromTo(
        ".leadership-line",
        { strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".leader-card").forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          delay: i * 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [filtered]);

  return (
    <section
      ref={sectionRef}
      id="leadership"
      className="relative py-28 md:py-40 px-6 md:px-10"
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex flex-col">
            <div className="leadership-tag font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Leadership
            </div>

            <div className="relative mt-4">
              <h2 className="leadership-heading font-display text-6xl md:text-9xl leading-[0.9] uppercase max-w-4xl">
                <ChapterReveal
                  text="Leadership"
                  className="block overflow-hidden"
                />
              </h2>
            </div>

            <p className="leadership-sub max-w-md font-grotesk text-[15px] text-foreground/60 leading-relaxed mt-8">
              Organizers, economists, and engineers — elected internally by the
              membership. No consultants. No donors pulling strings.
            </p>
          </div>

          <div className="w-full md:w-72">
            <label className="font-label uppercase text-[11px] tracking-[0.3em] text-foreground/60">
              Filter by Department
            </label>
            <div className="mt-3">
              {mounted ? (
                <Select
                  classNamePrefix="react-select"
                  options={OPTIONS}
                  value={filter}
                  onChange={(v) => v && setFilter(v)}
                  styles={selectStyles}
                  isSearchable={false}
                />
              ) : (
                <div className="h-[52px] border border-muted bg-surface" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 grid-flow-dense gap-6 md:gap-8 auto-rows-[320px]">
          {filtered.map((leader, i) => (
            <LeaderCard
              key={leader.name}
              leader={leader}
              className={i === 0 ? "md:row-span-2 md:h-auto" : ""}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function LeaderCard({
  leader,
  className = "",
}: {
  leader: Leader;
  className?: string;
}) {
  return (
    <article
      className={`leader-card group relative overflow-hidden bg-surface border border-muted/30 ${className}`}
      data-cursor="explore"
    >
      <div
        className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-[1.06] transition-all duration-700 ease-out"
        style={{ backgroundImage: `url(${leader.photo})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <span className="absolute bottom-0 left-0 h-1 w-0 bg-accent group-hover:w-full transition-[width] duration-500 ease-out" />

      <div className="relative z-10 flex flex-col justify-end h-full p-6 md:p-8">
        <span className="font-label uppercase text-[10px] tracking-[0.3em] text-accent mb-2">
          {"// "}
          {leader.dept}
        </span>
        <h3 className="font-display text-4xl md:text-5xl uppercase leading-none">
          {leader.name}
        </h3>
        <p className="font-mono text-xs md:text-sm text-foreground/70 mt-2">
          {leader.title}
        </p>
      </div>
    </article>
  );
}
