"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FAQS = [
  {
    q: "Is my donation tax-deductible?",
    a: "Vanguard is a 501(c)(4) social-welfare organization. Contributions are NOT tax-deductible as charitable gifts under IRC §170. They support political advocacy. Contributions to our affiliated 501(c)(3), the Vanguard Education Fund, are deductible — that page is at vanguard.org/educate.",
  },
  {
    q: "Where exactly does my money go?",
    a: "We publish the books quarterly. Every vendor, every line item — open at vanguard.org/ledger. The breakdown above is the rolling four-quarter average. Restricted gifts (tagged to a specific drive) can never be reallocated without your consent.",
  },
  {
    q: "Can I cancel my monthly gift?",
    a: "Yes, in one click. Log in, hit Cancel, done. No email gauntlet, no retention call, no dark patterns. We keep the unsubscribe path the same width as the donation path.",
  },
  {
    q: "Do you accept corporate or PAC money?",
    a: "No. Zero corporate contributions. Zero PAC contributions. Zero dark money. The names of every donor over $200 are in our FEC filings — and posted on our site.",
  },
  {
    q: "What's the contribution limit?",
    a: "$5,000 per individual per year for federal political advocacy under FEC rules for 501(c)(4)s. We hard-cap at $1,000 per gift on this form to keep the donor base broad — call (313) 555-0182 if you'd like to give more.",
  },
  {
    q: "Why do you collect employer + occupation?",
    a: "Federal law requires it for any contribution above $200 aggregate. We collect it for every donor to keep the records clean. It's published in our FEC reports and on the site.",
  },
  {
    q: "How do you handle my data?",
    a: "Encrypted in transit. Card details processed by Stripe — we never store the PAN. Your name, address, and email are stored on US servers, never sold, never rented. Delete your record anytime by emailing privacy@vanguard.org.",
  },
];

export function DonateFAQ() {
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
                href="mailto:donate@vanguard.org"
                className="text-accent hover:underline underline-offset-4"
                data-cursor="hover"
              >
                donate@vanguard.org
              </a>
              .
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
