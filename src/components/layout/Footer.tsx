"use client";
import Link from "next/link";
import { Twitter, Github, Youtube, Instagram } from "lucide-react";

type FooterLink = { label: string; href: string };
type Column = { title: string; links: FooterLink[] };

const columns: Column[] = [
  {
    title: "Movement",
    links: [
      { label: "About", href: "/about" },
      { label: "Manifesto", href: "/#manifesto" },
      { label: "Campaigns", href: "/#campaigns" },
      { label: "Leadership", href: "/#leadership" },
    ],
  },
  {
    title: "Network",
    links: [
      { label: "Events", href: "/events" },
      { label: "Volunteer", href: "/volunteer" },
      { label: "Donate", href: "/donate" },
      { label: "Chapters", href: "/#chapters" },
    ],
  },
  {
    title: "Press",
    links: [
      { label: "Newsroom", href: "#" },
      { label: "Media Kit", href: "#" },
      { label: "Statements", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-muted/40 bg-background pt-20 pb-8 px-6 md:px-10">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid md:grid-cols-5 gap-10 pb-16">
          <div className="md:col-span-2">
            <Link
              href="/"
              aria-label="Vanguard home"
              data-cursor="hover"
              className="inline-flex items-baseline gap-[3px] leading-none"
            >
              <h3 className="font-display text-6xl md:text-8xl leading-none tracking-wider">
                VANGUARD
              </h3>
              <span className="font-display text-6xl md:text-8xl leading-none text-urgent">
                .
              </span>
            </Link>
            <p className="mt-6 font-mono text-sm text-foreground/60 max-w-sm leading-relaxed">
              A political movement for the decade institutions are afraid to
              imagine. Paid for by the movement, authorized by no one.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-label uppercase text-[11px] tracking-[0.3em] text-accent mb-5">
                / {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      data-cursor="hover"
                      className="relative inline-block font-label uppercase text-sm tracking-[0.15em] text-foreground/70 hover:text-foreground group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-muted/40 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="font-mono text-[11px] text-foreground/50">
            © 2026 Vanguard Political Organization. All rights, none reserved.
          </p>
          <div className="flex gap-5 text-foreground/60">
            <a href="#" aria-label="Twitter">
              <Twitter className="w-5 h-5 hover:text-accent transition-colors" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-accent transition-colors" />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube className="w-5 h-5 hover:text-accent transition-colors" />
            </a>
            <a href="#" aria-label="Github">
              <Github className="w-5 h-5 hover:text-accent transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
