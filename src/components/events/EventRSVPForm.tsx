"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { BleedButton } from "@/components/ui/BleedButton";
import { ThemedSelect, type SelectOption } from "@/components/ui/ThemedSelect";
import type { EventRecord } from "@/data/events";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fieldClass =
  "w-full bg-background/50 border border-muted/40 px-4 py-3.5 font-mono text-[14px] text-foreground placeholder:text-foreground/30 focus:border-accent focus:outline-none focus:bg-background transition-colors duration-300";
const labelClass =
  "block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-2";

export function EventRSVPForm({ event }: { event: EventRecord }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const ATTENDEE_OPTIONS: SelectOption[] = [1, 2, 3, 4, 5].map((n) => ({
    value: String(n),
    label: `${n} ${n === 1 ? "person" : "people"}`,
  }));
  const [attendees, setAttendees] = useState<SelectOption>(ATTENDEE_OPTIONS[0]);
  const [accommodations, setAccommodations] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleAccommodation = (a: string) => {
    setAccommodations((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    setError(null);
    setSubmitting(true);

    // Simulated submit. Replace with your real API call:
    //   await fetch("/api/events/rsvp", { method: "POST", body: JSON.stringify({ slug: event.slug, name, email, phone, attendees, accommodations, notes }) });
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="border border-accent/40 bg-accent/5 p-8 md:p-12 text-center"
        >
          <CheckCircle2
            className="w-12 h-12 text-accent mx-auto mb-6"
            strokeWidth={1.5}
          />
          <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
            / Transmission Received
          </span>
          <h3 className="mt-4 font-display text-3xl md:text-4xl uppercase leading-[0.95] tracking-wide">
            You&apos;re On The List, {name.split(" ")[0]}.
          </h3>
          <p className="mt-4 max-w-md mx-auto font-grotesk text-[14px] text-foreground/70 leading-relaxed">
            A confirmation email is on its way to <strong>{email}</strong> with
            venue access details for {event.title}. See you on{" "}
            {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
          }}
          onSubmit={handleSubmit}
          className="space-y-6"
          noValidate
        >
          <Field label="Full Name" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aliyah Carter"
              required
              className={fieldClass}
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Field label="Email" required>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aliyah@movement.org"
                required
                className={fieldClass}
              />
            </Field>
            <Field label="Phone (optional)">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 010-2026"
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Number of Attendees">
            <ThemedSelect
              options={ATTENDEE_OPTIONS}
              value={attendees}
              onChange={(v) => v && setAttendees(v)}
              instanceId="attendees"
            />
          </Field>

          <Field label="Accommodations Needed">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Childcare", "Transit Stipend", "ASL Interpreter", "Wheelchair Access", "Dietary"].map((a) => (
                <Checkbox
                  key={a}
                  label={a}
                  checked={accommodations.includes(a)}
                  onToggle={() => toggleAccommodation(a)}
                />
              ))}
            </div>
          </Field>

          <Field label="Notes (optional)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else we should know"
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </Field>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-urgent font-mono text-[11px] uppercase tracking-[0.25em]"
            >
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
              {error}
            </motion.div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-foreground/15">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45">
              Free for members · $10 suggested for guests · waivable
            </p>
            <BleedButton type="submit" variant="card" size="lg">
              {submitting ? "Sending…" : "RSVP Now"}
            </BleedButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ─────────────── form helpers ─────────────── */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
      }}
    >
      <label className={labelClass}>
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
    </motion.div>
  );
}

function Checkbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative flex items-center gap-2.5 px-3 py-2.5 border text-left transition-colors duration-300 ${
        checked
          ? "border-accent bg-accent/10"
          : "border-muted/40 hover:border-accent/50 bg-background/30"
      }`}
    >
      <span
        aria-hidden
        className={`shrink-0 w-3.5 h-3.5 border ${
          checked ? "border-accent bg-accent" : "border-muted/60"
        } transition-colors duration-200 flex items-center justify-center`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-background">
            <path
              d="M2 6l3 3 5-7"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
          checked ? "text-accent" : "text-foreground/65"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
