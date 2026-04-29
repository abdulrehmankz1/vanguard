"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, AlertCircle } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { ThemedSelect, type SelectOption } from "@/components/ui/ThemedSelect";
import { ROLES } from "./VolunteerRoles";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function useBleed() {
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
    setHovered(true);
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
    setHovered(false);
  };
  return { hovered, origin, onEnter, onLeave };
}

const STATE_OPTIONS: SelectOption[] = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
].map((s) => ({ value: s, label: s }));

const AVAILABILITY_OPTIONS: SelectOption[] = [
  { value: "weekday-mornings", label: "Weekday Mornings" },
  { value: "weekday-evenings", label: "Weekday Evenings" },
  { value: "weekends", label: "Weekends" },
  { value: "evenings-weekends", label: "Evenings + Weekends" },
  { value: "flexible", label: "Flexible / On-call" },
];

const HOURS_OPTIONS: SelectOption[] = [
  { value: "1-3", label: "1–3 hours / week" },
  { value: "4-6", label: "4–6 hours / week" },
  { value: "7-10", label: "7–10 hours / week" },
  { value: "10+", label: "10+ hours / week" },
];

const EXPERIENCE_OPTIONS: SelectOption[] = [
  { value: "none", label: "None — and excited to learn" },
  { value: "some", label: "Some — a few campaigns or volunteer gigs" },
  { value: "lots", label: "Lots — I've organized" },
  { value: "professional", label: "Professional — paid organizer or staffer" },
];

const REFERRAL_OPTIONS: SelectOption[] = [
  { value: "friend", label: "A friend or member" },
  { value: "event", label: "Vanguard event" },
  { value: "social", label: "Social media" },
  { value: "press", label: "Press / podcast" },
  { value: "search", label: "Web search" },
  { value: "other", label: "Other" },
];

const ROLE_OPTIONS: SelectOption[] = ROLES.map((r) => ({
  value: r.id,
  label: r.title,
}));

type Field =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "city"
  | "zip"
  | "age"
  | "statement"
  | "emergencyName"
  | "emergencyPhone";

const FIELD_DELAYS: Record<Field, number> = {
  firstName: 0,
  lastName: 0.05,
  email: 0.1,
  phone: 0.15,
  city: 0.2,
  zip: 0.25,
  age: 0.3,
  statement: 0.35,
  emergencyName: 0.4,
  emergencyPhone: 0.45,
};

export function VolunteerForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Controlled values for select fields
  const [stateVal, setStateVal] = useState<SelectOption | null>(null);
  const [primaryRole, setPrimaryRole] = useState<SelectOption | null>(null);
  const [secondaryRole, setSecondaryRole] = useState<SelectOption | null>(null);
  const [availability, setAvailability] = useState<SelectOption | null>(null);
  const [hours, setHours] = useState<SelectOption | null>(null);
  const [experience, setExperience] = useState<SelectOption | null>(null);
  const [referral, setReferral] = useState<SelectOption | null>(null);

  // Skill chips
  const SKILL_TAGS = [
    "Public Speaking",
    "Writing",
    "Driving",
    "Bilingual",
    "Data / Spreadsheets",
    "Photography",
    "Video",
    "Design",
    "Web / Code",
    "Childcare",
    "Cooking",
    "Medical",
    "Legal",
  ];
  const [skills, setSkills] = useState<string[]>([]);
  const toggleSkill = (s: string) =>
    setSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  // Agreement checkboxes
  const [agreeCode, setAgreeCode] = useState(false);
  const [agreeContact, setAgreeContact] = useState(false);
  const [agreePhoto, setAgreePhoto] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const next: Partial<Record<string, string>> = {};
    if (!data.get("firstName")) next.firstName = "Required";
    if (!data.get("lastName")) next.lastName = "Required";
    if (!data.get("email")) next.email = "Required";
    if (!data.get("city")) next.city = "Required";
    if (!stateVal) next.state = "Required";
    if (!primaryRole) next.primaryRole = "Required";
    if (!availability) next.availability = "Required";
    if (!hours) next.hours = "Required";
    if (!agreeCode) next.agreeCode = "You must accept the code of conduct";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    // Simulate submit — real wiring would POST to an API route.
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <section
      id="sign-up"
      className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10 scroll-mt-24"
    >
      {/* Diagonal pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #C8F400, #C8F400 1px, transparent 1px, transparent 38px)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left rail */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
                / Sign Up · Form 01
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
                <ChapterReveal text="Roster." className="block overflow-hidden" immediate />
              </h2>
              <p className="mt-6 font-grotesk text-[14px] text-foreground/65 leading-relaxed">
                Five minutes, then you&apos;re on the field. Your data stays
                with Vanguard — never sold, never rented. Read the privacy
                policy.
              </p>

              <div className="mt-8 border border-foreground/15 bg-surface/40 backdrop-blur-md p-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  / What happens next
                </span>
                <ul className="mt-3 space-y-2 font-grotesk text-[13px] text-foreground/70">
                  <li className="flex gap-2">
                    <span className="text-accent shrink-0">→</span>
                    Confirmation email within 5 minutes.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent shrink-0">→</span>
                    Coordinator outreach within 48 hours.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-accent shrink-0">→</span>
                    First shift inside a week.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="border border-accent/50 bg-surface/60 backdrop-blur-md p-10 md:p-14"
                >
                  <span className="inline-flex items-center justify-center w-14 h-14 border border-accent bg-accent/10">
                    <Check className="w-6 h-6 text-accent" strokeWidth={2.5} />
                  </span>
                  <h3 className="mt-8 font-display text-4xl md:text-5xl uppercase leading-[1] tracking-wide">
                    You&apos;re On The Roster.
                  </h3>
                  <p className="mt-5 font-grotesk text-[15px] text-foreground/75 leading-relaxed max-w-xl">
                    Check your inbox for a confirmation email. Your chapter
                    coordinator will be in touch inside 48 hours with role
                    matches and onboarding details.
                  </p>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    / Welcome aboard.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                  className="space-y-10"
                  noValidate
                >
                  {/* Section: Identity */}
                  <FormSection number="01" title="Identity">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <FieldShell
                        label="First Name"
                        required
                        delay={FIELD_DELAYS.firstName}
                        error={errors.firstName}
                      >
                        <FieldInput
                          name="firstName"
                          autoComplete="given-name"
                          placeholder="Amara"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Last Name"
                        required
                        delay={FIELD_DELAYS.lastName}
                        error={errors.lastName}
                      >
                        <FieldInput
                          name="lastName"
                          autoComplete="family-name"
                          placeholder="Okonkwo"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Email"
                        required
                        delay={FIELD_DELAYS.email}
                        error={errors.email}
                      >
                        <FieldInput
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="amara@vanguard.org"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Phone"
                        delay={FIELD_DELAYS.phone}
                        error={errors.phone}
                      >
                        <FieldInput
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(555) 555-1234"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Age (Optional)"
                        delay={FIELD_DELAYS.age}
                      >
                        <FieldInput
                          name="age"
                          type="number"
                          min={13}
                          max={120}
                          placeholder="28"
                        />
                      </FieldShell>
                      <FieldShell label="Pronouns (Optional)" delay={0.32}>
                        <FieldInput
                          name="pronouns"
                          placeholder="she/her, he/him, they/them"
                        />
                      </FieldShell>
                    </div>
                  </FormSection>

                  {/* Section: Location */}
                  <FormSection number="02" title="Location">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
                      <div className="md:col-span-6">
                        <FieldShell
                          label="City"
                          required
                          delay={FIELD_DELAYS.city}
                          error={errors.city}
                        >
                          <FieldInput
                            name="city"
                            autoComplete="address-level2"
                            placeholder="Detroit"
                          />
                        </FieldShell>
                      </div>
                      <div className="md:col-span-3">
                        <FieldShell label="State" required delay={0.05} error={errors.state}>
                          <ThemedSelect
                            instanceId="vol-state"
                            options={STATE_OPTIONS}
                            value={stateVal}
                            onChange={(v) => setStateVal(v as SelectOption | null)}
                            placeholder="Select"
                          />
                        </FieldShell>
                      </div>
                      <div className="md:col-span-3">
                        <FieldShell
                          label="ZIP"
                          delay={FIELD_DELAYS.zip}
                        >
                          <FieldInput
                            name="zip"
                            inputMode="numeric"
                            pattern="[0-9]{5}"
                            autoComplete="postal-code"
                            placeholder="48226"
                          />
                        </FieldShell>
                      </div>
                    </div>
                  </FormSection>

                  {/* Section: Roles + availability */}
                  <FormSection number="03" title="The Work">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <FieldShell
                        label="Primary Role"
                        required
                        delay={0}
                        error={errors.primaryRole}
                      >
                        <ThemedSelect
                          instanceId="vol-primary-role"
                          options={ROLE_OPTIONS}
                          value={primaryRole}
                          onChange={(v) => setPrimaryRole(v as SelectOption | null)}
                          placeholder="Pick a track"
                        />
                      </FieldShell>
                      <FieldShell label="Secondary Role (Optional)" delay={0.05}>
                        <ThemedSelect
                          instanceId="vol-secondary-role"
                          options={ROLE_OPTIONS.filter(
                            (o) => o.value !== primaryRole?.value,
                          )}
                          value={secondaryRole}
                          onChange={(v) => setSecondaryRole(v as SelectOption | null)}
                          placeholder="Optional second pick"
                          isClearable
                        />
                      </FieldShell>
                      <FieldShell
                        label="Availability"
                        required
                        delay={0.1}
                        error={errors.availability}
                      >
                        <ThemedSelect
                          instanceId="vol-availability"
                          options={AVAILABILITY_OPTIONS}
                          value={availability}
                          onChange={(v) => setAvailability(v as SelectOption | null)}
                          placeholder="When are you free?"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Weekly Hours"
                        required
                        delay={0.15}
                        error={errors.hours}
                      >
                        <ThemedSelect
                          instanceId="vol-hours"
                          options={HOURS_OPTIONS}
                          value={hours}
                          onChange={(v) => setHours(v as SelectOption | null)}
                          placeholder="Realistic commitment"
                        />
                      </FieldShell>
                      <FieldShell label="Organizing Experience" delay={0.2}>
                        <ThemedSelect
                          instanceId="vol-experience"
                          options={EXPERIENCE_OPTIONS}
                          value={experience}
                          onChange={(v) => setExperience(v as SelectOption | null)}
                          placeholder="Honest take"
                        />
                      </FieldShell>
                      <FieldShell label="How Did You Hear?" delay={0.25}>
                        <ThemedSelect
                          instanceId="vol-referral"
                          options={REFERRAL_OPTIONS}
                          value={referral}
                          onChange={(v) => setReferral(v as SelectOption | null)}
                          placeholder="Channel"
                        />
                      </FieldShell>
                    </div>

                    {/* Skill chips */}
                    <motion.div
                      variants={fieldFade(0.3)}
                      className="mt-8"
                    >
                      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-3">
                        Skills You Bring (select any)
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {SKILL_TAGS.map((s) => (
                          <SkillChip
                            key={s}
                            label={s}
                            on={skills.includes(s)}
                            onToggle={() => toggleSkill(s)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </FormSection>

                  {/* Section: Statement */}
                  <FormSection number="04" title="Your Pitch">
                    <FieldShell
                      label="Why Vanguard? (Optional, 500 chars)"
                      delay={FIELD_DELAYS.statement}
                    >
                      <textarea
                        name="statement"
                        maxLength={500}
                        rows={4}
                        placeholder="Tell us what brought you here. The campaign that lit a fire. The local issue that won't quit. Anything."
                        className="w-full bg-transparent border-b-2 border-muted/60 px-0 py-3 font-mono text-[14px] text-foreground placeholder:text-foreground/30 transition-colors outline-none focus:border-accent resize-none leading-relaxed"
                      />
                    </FieldShell>
                  </FormSection>

                  {/* Section: Emergency contact */}
                  <FormSection number="05" title="Emergency Contact">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <FieldShell
                        label="Contact Name"
                        delay={FIELD_DELAYS.emergencyName}
                      >
                        <FieldInput
                          name="emergencyName"
                          placeholder="Jamie Rivera"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Contact Phone"
                        delay={FIELD_DELAYS.emergencyPhone}
                      >
                        <FieldInput
                          name="emergencyPhone"
                          type="tel"
                          placeholder="(555) 555-9821"
                        />
                      </FieldShell>
                    </div>
                  </FormSection>

                  {/* Section: Agreements */}
                  <FormSection number="06" title="Agreements">
                    <div className="space-y-4">
                      <Checkbox
                        checked={agreeCode}
                        onChange={setAgreeCode}
                        label="I have read and accept the Vanguard Code of Conduct."
                        required
                        error={errors.agreeCode}
                      />
                      <Checkbox
                        checked={agreeContact}
                        onChange={setAgreeContact}
                        label="It's OK to text me action alerts and shift reminders."
                      />
                      <Checkbox
                        checked={agreePhoto}
                        onChange={setAgreePhoto}
                        label="It's OK for Vanguard to use photos taken at events I attend."
                      />
                    </div>
                  </FormSection>

                  {/* Submit */}
                  <motion.div variants={fieldFade(0.05)} className="pt-6">
                    <SubmitButton
                      submitting={submitting}
                      label={submitting ? "Filing..." : "Submit Application"}
                    />
                  </motion.div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function fieldFade(delay = 0) {
  return {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: EASE } },
  };
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.fieldset variants={fieldFade()} className="border-t border-foreground/15 pt-8">
      <legend className="flex items-center gap-3 mb-7">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          / {number}
        </span>
        <span className="font-display text-2xl uppercase tracking-wide leading-none">
          {title}
        </span>
      </legend>
      {children}
    </motion.fieldset>
  );
}

function FieldShell({
  label,
  required,
  delay = 0,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  delay?: number;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.label variants={fieldFade(delay)} className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-2">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-urgent"
          >
            <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.label>
  );
}

function FieldInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...props}
      className="w-full h-12 bg-transparent border-b-2 border-muted/60 px-0 py-2 font-mono text-[14px] text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-accent"
    />
  );
}

function SkillChip({
  label,
  on,
  onToggle,
}: {
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  const b = useBleed();
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={b.onEnter}
      onMouseLeave={b.onLeave}
      data-cursor="hover"
      data-cursor-theme={on || b.hovered ? "light" : undefined}
      className={`relative overflow-hidden px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] border transition-colors duration-300 ${
        on ? "border-accent bg-accent" : "border-foreground/25"
      }`}
    >
      {!on && (
        <motion.span
          aria-hidden
          className="absolute inset-0 bg-accent"
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{
            clipPath: b.hovered
              ? `circle(160% at ${b.origin.x}% ${b.origin.y}%)`
              : `circle(0% at ${b.origin.x}% ${b.origin.y}%)`,
          }}
          transition={{ duration: 0.55, ease: EASE }}
        />
      )}
      <span
        className={`relative z-10 inline-flex items-center gap-1.5 transition-colors duration-300 ${
          on || b.hovered ? "text-background" : "text-foreground/65"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            on || b.hovered ? "bg-background" : "bg-foreground/30"
          }`}
        />
        {label}
      </span>
    </button>
  );
}

function SubmitButton({
  submitting,
  label,
}: {
  submitting: boolean;
  label: string;
}) {
  const b = useBleed();
  return (
    <button
      type="submit"
      disabled={submitting}
      onMouseEnter={b.onEnter}
      onMouseLeave={b.onLeave}
      data-cursor="hover"
      data-cursor-theme="light"
      className="relative w-full md:w-auto inline-flex items-center justify-center gap-3 h-14 min-w-[260px] px-8 bg-accent overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed font-grotesk font-medium tracking-tight text-[15px]"
    >
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-foreground"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{
          clipPath: b.hovered
            ? `circle(160% at ${b.origin.x}% ${b.origin.y}%)`
            : `circle(0% at ${b.origin.x}% ${b.origin.y}%)`,
        }}
        transition={{ duration: 0.55, ease: EASE }}
      />
      <span className="relative z-10 flex items-center gap-3 text-background">
        {label}
        <ArrowRight
          className={`w-4 h-4 transition-transform duration-300 ${
            b.hovered ? "translate-x-1" : ""
          }`}
          strokeWidth={2}
        />
      </span>
    </button>
  );
}

function Checkbox({
  checked,
  onChange,
  label,
  required,
  error,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label
      className="group flex items-start gap-3 cursor-pointer"
      data-cursor="hover"
    >
      <span
        className={`relative shrink-0 w-5 h-5 mt-0.5 border-2 transition-colors duration-200 ${
          checked
            ? "border-accent bg-accent/15"
            : "border-muted/60 group-hover:border-accent/70"
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="font-grotesk text-[14px] text-foreground/75 leading-relaxed">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
        {error && (
          <span className="block mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-urgent">
            {error}
          </span>
        )}
      </span>
    </label>
  );
}
