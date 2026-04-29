"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FAQS = [
  {
    q: "Is volunteering paid?",
    a: "No. Vanguard is volunteer-run from the chapter level up. We reimburse out-of-pocket expenses (transit, materials) and provide childcare and meals at events. Paid roles, when they exist, are listed publicly on the Jobs page.",
  },
  {
    q: "Do I have to be a member to volunteer?",
    a: "No. Members and non-members can volunteer in any role. Most folks volunteer for a few months before deciding to join — that's normal and encouraged.",
  },
  {
    q: "What's the time commitment?",
    a: "Pick what's realistic. Most volunteers contribute 4–6 hours a week. Some do an hour, some do thirty. The form asks for honest hours so your coordinator matches you to a role that fits.",
  },
  {
    q: "Can I volunteer remotely?",
    a: "Yes. Phone banking, translation, writing, tech, and research all run remotely. Door canvassing, rallies, and mutual aid are on-site.",
  },
  {
    q: "I'm under 18 — can I sign up?",
    a: "Yes. Volunteers 13+ are welcome with parental consent for in-person work. Phone banks and remote roles are open to all ages.",
  },
  {
    q: "What if my chapter is far away?",
    a: "We have 180 chapters across the US. If there isn't one in your city, the coordinator will plug you into a regional remote team — and you can apply to start a new chapter once you've put in 60 hours.",
  },
  {
    q: "How do you protect my data?",
    a: "Encrypted in transit. Stored on US servers. Never sold, never rented, never handed to a vendor outside our movement. You can delete your record at any time by emailing privacy@vanguard.org.",
  },
];

export function VolunteerFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
              / Questions · 07 Common
            </span>
            <h2 className="mt-4 font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
              <ChapterReveal text="Asked &" className="block overflow-hidden" immediate />
              <ChapterReveal
                text="Answered."
                delay={0.3}
                className="block overflow-hidden text-accent"
                immediate
              />
            </h2>
            <p className="mt-6 font-grotesk text-[14px] text-foreground/60 leading-relaxed max-w-xs">
              Anything we missed? Email{" "}
              <a
                href="mailto:volunteer@vanguard.org"
                className="text-accent hover:underline underline-offset-4"
                data-cursor="hover"
              >
                volunteer@vanguard.org
              </a>{" "}
              and we&apos;ll add it.
            </p>
          </div>

          <div className="lg:col-span-8 border-t border-foreground/15">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                  className="border-b border-foreground/15"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    data-cursor="hover"
                    className="w-full flex items-center justify-between gap-6 py-5 md:py-7 text-left group"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40 tabular-nums shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-xl md:text-2xl uppercase tracking-wide leading-tight group-hover:text-accent transition-colors duration-300">
                        {faq.q}
                      </span>
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className={`shrink-0 w-9 h-9 border flex items-center justify-center ${
                        isOpen
                          ? "border-accent text-accent"
                          : "border-foreground/30 text-foreground/60 group-hover:border-accent group-hover:text-accent"
                      } transition-colors duration-300`}
                    >
                      <Plus className="w-4 h-4" strokeWidth={2} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pl-12 pr-12 md:pr-20 font-grotesk text-[14.5px] text-foreground/75 leading-relaxed max-w-3xl">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
