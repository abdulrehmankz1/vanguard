"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, AlertCircle, Heart, Lock, Repeat, Calendar } from "lucide-react";
import { ChapterReveal } from "@/components/ui/ChapterReveal";
import { ThemedSelect, type SelectOption } from "@/components/ui/ThemedSelect";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Cursor-tracking circle clipPath bleed — same effect used by BleedButton in the hero. */
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

function BleedFill({
  hovered,
  origin,
  className,
}: {
  hovered: boolean;
  origin: { x: number; y: number };
  className: string;
}) {
  return (
    <motion.span
      aria-hidden
      className={`absolute inset-0 ${className}`}
      initial={{ clipPath: "circle(0% at 50% 50%)" }}
      animate={{
        clipPath: hovered
          ? `circle(160% at ${origin.x}% ${origin.y}%)`
          : `circle(0% at ${origin.x}% ${origin.y}%)`,
      }}
      transition={{ duration: 0.55, ease: EASE }}
    />
  );
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500, 1000, 2500];

const STATE_OPTIONS: SelectOption[] = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
].map((s) => ({ value: s, label: s }));

const OCCUPATION_OPTIONS: SelectOption[] = [
  { value: "employed", label: "Employed" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Not Employed" },
];

type Frequency = "once" | "monthly";

export function DonateForm() {
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [amount, setAmount] = useState<number>(50);
  const [customMode, setCustomMode] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [coverFees, setCoverFees] = useState(true);

  const [stateVal, setStateVal] = useState<SelectOption | null>(null);
  const [occupation, setOccupation] = useState<SelectOption | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  // Effective amount and processing-fee math
  const baseAmount = customMode ? Number(customAmount) || 0 : amount;
  const fee = coverFees ? +(baseAmount * 0.025 + 0.3).toFixed(2) : 0;
  const total = +(baseAmount + fee).toFixed(2);
  const annual = baseAmount * 12;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const next: Partial<Record<string, string>> = {};
    if (!baseAmount || baseAmount < 1) next.amount = "Enter $1 or more";
    if (!data.get("firstName")) next.firstName = "Required";
    if (!data.get("lastName")) next.lastName = "Required";
    if (!data.get("email")) next.email = "Required";
    if (!data.get("address")) next.address = "Required";
    if (!data.get("city")) next.city = "Required";
    if (!stateVal) next.state = "Required";
    if (!data.get("zip")) next.zip = "Required";
    if (!data.get("employer")) next.employer = "Required by FEC";
    if (!occupation) next.occupation = "Required by FEC";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1100);
  };

  return (
    <section
      id="give"
      className="relative px-6 md:px-10 py-20 md:py-28 border-t border-foreground/10 scroll-mt-24"
    >
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
          {/* Left rail — sticky summary */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <span className="font-label uppercase text-[11px] tracking-[0.3em] text-accent">
                / Give · Form 01
              </span>
              <h2 className="mt-4 font-display text-4xl md:text-6xl uppercase leading-[0.95] tracking-wide">
                <ChapterReveal text="Receipt." className="block overflow-hidden" immediate />
              </h2>

              {/* Live receipt summary */}
              <DonationReceipt
                frequency={frequency}
                amount={baseAmount}
                fee={fee}
                total={total}
                annual={annual}
                coverFees={coverFees}
              />

              <div className="mt-6 space-y-2 font-grotesk text-[12.5px] text-foreground/60 leading-relaxed">
                <p className="flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                  Encrypted with 256-bit TLS. We never store your card.
                </p>
                <p className="flex items-start gap-2">
                  <Heart className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" strokeWidth={2} />
                  Cancel monthly anytime — one click, no email gauntlet.
                </p>
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
                    Thank You.
                  </h3>
                  <p className="mt-5 font-grotesk text-[15px] text-foreground/75 leading-relaxed max-w-xl">
                    Your {frequency === "monthly" ? "monthly" : "one-time"} gift
                    of <span className="text-accent">${baseAmount}</span> is on
                    its way to the field. A receipt has been sent to your inbox
                    — keep it for your records.
                  </p>
                  <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                    / The work continues.
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
                  {/* 01: Frequency */}
                  <FormSection number="01" title="Frequency">
                    <FrequencyToggle value={frequency} onChange={setFrequency} />
                  </FormSection>

                  {/* 02: Amount */}
                  <FormSection number="02" title="Amount">
                    <AmountPicker
                      amount={amount}
                      onPick={(v) => {
                        setAmount(v);
                        setCustomMode(false);
                      }}
                      customMode={customMode}
                      customAmount={customAmount}
                      onCustomToggle={() => setCustomMode((v) => !v)}
                      onCustomChange={setCustomAmount}
                      error={errors.amount}
                    />

                    <motion.label
                      variants={fieldFade(0.1)}
                      className="mt-6 group flex items-start gap-3 cursor-pointer"
                      data-cursor="hover"
                    >
                      <span
                        className={`relative shrink-0 w-5 h-5 mt-0.5 border-2 transition-colors duration-200 ${
                          coverFees
                            ? "border-accent bg-accent/15"
                            : "border-muted/60 group-hover:border-accent/70"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={coverFees}
                          onChange={(e) => setCoverFees(e.target.checked)}
                          className="sr-only"
                        />
                        <AnimatePresence>
                          {coverFees && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <Check className="w-3.5 h-3.5 text-accent" strokeWidth={3} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      <span className="font-grotesk text-[13.5px] text-foreground/75 leading-relaxed">
                        Cover the processing fee (
                        <span className="text-accent">${fee.toFixed(2)}</span>) so
                        100¢ of every dollar reaches the work.
                      </span>
                    </motion.label>
                  </FormSection>

                  {/* 03: Donor info */}
                  <FormSection number="03" title="Donor Info">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <FieldShell
                        label="First Name"
                        required
                        delay={0}
                        error={errors.firstName}
                      >
                        <FieldInput
                          name="firstName"
                          autoComplete="given-name"
                          placeholder="Maya"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Last Name"
                        required
                        delay={0.05}
                        error={errors.lastName}
                      >
                        <FieldInput
                          name="lastName"
                          autoComplete="family-name"
                          placeholder="Reyes"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Email"
                        required
                        delay={0.1}
                        error={errors.email}
                      >
                        <FieldInput
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="maya@vanguard.org"
                        />
                      </FieldShell>
                      <FieldShell label="Phone (Optional)" delay={0.15}>
                        <FieldInput
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="(555) 555-1234"
                        />
                      </FieldShell>
                    </div>
                  </FormSection>

                  {/* 04: Address */}
                  <FormSection number="04" title="Billing Address">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-6">
                      <div className="md:col-span-12">
                        <FieldShell
                          label="Street Address"
                          required
                          delay={0}
                          error={errors.address}
                        >
                          <FieldInput
                            name="address"
                            autoComplete="street-address"
                            placeholder="2200 W 14th St"
                          />
                        </FieldShell>
                      </div>
                      <div className="md:col-span-6">
                        <FieldShell
                          label="City"
                          required
                          delay={0.05}
                          error={errors.city}
                        >
                          <FieldInput
                            name="city"
                            autoComplete="address-level2"
                            placeholder="Cleveland"
                          />
                        </FieldShell>
                      </div>
                      <div className="md:col-span-3">
                        <FieldShell label="State" required delay={0.1} error={errors.state}>
                          <ThemedSelect
                            instanceId="don-state"
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
                          required
                          delay={0.15}
                          error={errors.zip}
                        >
                          <FieldInput
                            name="zip"
                            inputMode="numeric"
                            pattern="[0-9]{5}"
                            autoComplete="postal-code"
                            placeholder="44113"
                          />
                        </FieldShell>
                      </div>
                    </div>
                  </FormSection>

                  {/* 05: FEC compliance */}
                  <FormSection number="05" title="FEC Compliance">
                    <p className="font-grotesk text-[13px] text-foreground/60 leading-relaxed mb-5 max-w-xl">
                      Federal law requires us to collect employer + occupation
                      for every contributor. Posted publicly with your
                      contribution.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      <FieldShell
                        label="Employer"
                        required
                        delay={0}
                        error={errors.employer}
                      >
                        <FieldInput
                          name="employer"
                          placeholder="Vanguard Auto Workers"
                        />
                      </FieldShell>
                      <FieldShell
                        label="Occupation"
                        required
                        delay={0.05}
                        error={errors.occupation}
                      >
                        <ThemedSelect
                          instanceId="don-occupation"
                          options={OCCUPATION_OPTIONS}
                          value={occupation}
                          onChange={(v) => setOccupation(v as SelectOption | null)}
                          placeholder="Select"
                        />
                      </FieldShell>
                    </div>
                  </FormSection>

                  {/* 06: Payment placeholder */}
                  <FormSection number="06" title="Payment">
                    <div className="border border-muted/40 bg-surface/40 backdrop-blur-md p-5 md:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 inline-flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5 text-accent" strokeWidth={2} />
                          Encrypted Card Field
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/45">
                          Stripe
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-5">
                        <div className="md:col-span-12">
                          <FieldShell label="Card Number" required delay={0}>
                            <FieldInput
                              name="cardNumber"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              placeholder="1234 1234 1234 1234"
                            />
                          </FieldShell>
                        </div>
                        <div className="md:col-span-4">
                          <FieldShell label="Expiry" required delay={0.05}>
                            <FieldInput
                              name="cardExp"
                              autoComplete="cc-exp"
                              placeholder="MM / YY"
                            />
                          </FieldShell>
                        </div>
                        <div className="md:col-span-4">
                          <FieldShell label="CVC" required delay={0.1}>
                            <FieldInput
                              name="cardCvc"
                              inputMode="numeric"
                              autoComplete="cc-csc"
                              placeholder="123"
                            />
                          </FieldShell>
                        </div>
                        <div className="md:col-span-4">
                          <FieldShell label="ZIP" required delay={0.15}>
                            <FieldInput
                              name="cardZip"
                              inputMode="numeric"
                              autoComplete="cc-postal-code"
                              placeholder="44113"
                            />
                          </FieldShell>
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  {/* Submit */}
                  <motion.div variants={fieldFade(0.05)} className="pt-6">
                    <SubmitButton
                      submitting={submitting}
                      label={
                        submitting
                          ? "Processing..."
                          : `Donate $${total.toFixed(2)} ${frequency === "monthly" ? "/ month" : ""}`
                      }
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

/* ── Frequency toggle (one-time / monthly) ───────────────────────── */

function FrequencyToggle({
  value,
  onChange,
}: {
  value: Frequency;
  onChange: (f: Frequency) => void;
}) {
  const opts: { id: Frequency; label: string; sub: string; icon: typeof Calendar }[] = [
    { id: "once", label: "One-Time", sub: "Single gift today", icon: Calendar },
    { id: "monthly", label: "Monthly", sub: "Recurring · most impact", icon: Repeat },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {opts.map((o) => (
        <FrequencyCard
          key={o.id}
          option={o}
          active={value === o.id}
          onClick={() => onChange(o.id)}
        />
      ))}
    </div>
  );
}

function FrequencyCard({
  option,
  active,
  onClick,
}: {
  option: { id: Frequency; label: string; sub: string; icon: typeof Calendar };
  active: boolean;
  onClick: () => void;
}) {
  const b = useBleed();
  const Icon = option.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={b.onEnter}
      onMouseLeave={b.onLeave}
      data-cursor="hover"
      data-cursor-theme={active || b.hovered ? "light" : undefined}
      className={`relative overflow-hidden p-5 text-left border transition-colors duration-300 ${
        active ? "border-accent bg-accent" : "border-muted/40"
      }`}
    >
      {!active && <BleedFill hovered={b.hovered} origin={b.origin} className="bg-accent" />}
      <span
        aria-hidden
        className={`absolute top-0 left-0 right-0 h-[2px] bg-foreground origin-left transition-transform duration-500 ease-out ${
          active ? "scale-x-100" : "scale-x-0"
        }`}
      />
      <div className="relative z-10 flex items-center justify-between mb-3">
        <Icon
          className={`w-4 h-4 transition-colors duration-300 ${
            active || b.hovered ? "text-background" : "text-foreground/60"
          }`}
          strokeWidth={2}
        />
        {option.id === "monthly" && (
          <span
            className={`font-mono text-[9px] uppercase tracking-[0.25em] px-2 py-0.5 border transition-colors duration-300 ${
              active || b.hovered
                ? "border-background text-background bg-background/10"
                : "border-foreground/20 text-foreground/55"
            }`}
          >
            Recommended
          </span>
        )}
      </div>
      <span
        className={`relative z-10 block font-display text-2xl uppercase leading-[1] tracking-wide transition-colors duration-300 ${
          active || b.hovered ? "text-background" : "text-foreground"
        }`}
      >
        {option.label}
      </span>
      <span
        className={`relative z-10 mt-1 block font-mono text-[10px] uppercase tracking-[0.25em] transition-colors duration-300 ${
          active || b.hovered ? "text-background/80" : "text-foreground/55"
        }`}
      >
        {option.sub}
      </span>
    </button>
  );
}

/* ── Amount picker (8 presets + custom) ──────────────────────────── */

function AmountPicker({
  amount,
  onPick,
  customMode,
  customAmount,
  onCustomToggle,
  onCustomChange,
  error,
}: {
  amount: number;
  onPick: (v: number) => void;
  customMode: boolean;
  customAmount: string;
  onCustomToggle: () => void;
  onCustomChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
        {PRESET_AMOUNTS.map((v) => (
          <AmountTile
            key={v}
            value={v}
            active={!customMode && amount === v}
            onPick={() => onPick(v)}
          />
        ))}
      </div>

      {/* Custom amount */}
      <div className="mt-4">
        <button
          type="button"
          onClick={onCustomToggle}
          data-cursor="hover"
          className={`font-mono text-[10px] uppercase tracking-[0.3em] transition-colors duration-300 ${
            customMode
              ? "text-accent"
              : "text-foreground/55 hover:text-foreground"
          }`}
        >
          {customMode ? "← Use Preset" : "+ Custom Amount"}
        </button>

        <AnimatePresence>
          {customMode && (
            <motion.div
              key="custom"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-4 relative">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 font-display text-3xl text-accent">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="any"
                  value={customAmount}
                  onChange={(e) => onCustomChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-16 bg-transparent border-b-2 border-muted/60 pl-8 pr-0 py-2 font-display text-3xl text-foreground placeholder:text-foreground/25 outline-none transition-colors focus:border-accent tabular-nums"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-urgent"
          >
            <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Sticky live receipt ─────────────────────────────────────────── */

function DonationReceipt({
  frequency,
  amount,
  fee,
  total,
  annual,
  coverFees,
}: {
  frequency: Frequency;
  amount: number;
  fee: number;
  total: number;
  annual: number;
  coverFees: boolean;
}) {
  return (
    <div className="mt-6 relative bg-surface/60 backdrop-blur-md border border-muted/40 overflow-hidden">
      <span aria-hidden className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />
      <div className="px-5 py-4 border-b border-foreground/15 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
          / Live Receipt
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/55">
          {frequency === "monthly" ? "Monthly · Recurring" : "One-Time"}
        </span>
      </div>

      <div className="px-5 py-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">
          Total Today
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={total}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="mt-2 block font-display text-5xl leading-none tracking-tight tabular-nums text-accent"
          >
            ${total.toFixed(2)}
          </motion.span>
        </AnimatePresence>
        {frequency === "monthly" && amount > 0 && (
          <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
            ≈ ${annual.toLocaleString()} this year
          </span>
        )}
      </div>

      <ul className="px-5 py-4 border-t border-foreground/15 space-y-2 font-mono text-[11px]">
        <li className="flex justify-between text-foreground/65">
          <span className="uppercase tracking-[0.2em]">Gift</span>
          <span className="tabular-nums">${amount.toFixed(2)}</span>
        </li>
        {coverFees && (
          <li className="flex justify-between text-foreground/65">
            <span className="uppercase tracking-[0.2em]">Processing</span>
            <span className="tabular-nums">${fee.toFixed(2)}</span>
          </li>
        )}
      </ul>
    </div>
  );
}

/* ── Shared field primitives ─────────────────────────────────────── */

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

function FieldInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-12 bg-transparent border-b-2 border-muted/60 px-0 py-2 font-mono text-[14px] text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-accent"
    />
  );
}

/* ── Amount tile (preset $ button) — same bleed hover as hero CTAs ─ */

function AmountTile({
  value,
  active,
  onPick,
}: {
  value: number;
  active: boolean;
  onPick: () => void;
}) {
  const b = useBleed();
  return (
    <motion.button
      type="button"
      onClick={onPick}
      onMouseEnter={b.onEnter}
      onMouseLeave={b.onLeave}
      data-cursor="hover"
      data-cursor-theme={active || b.hovered ? "light" : undefined}
      whileTap={{ scale: 0.96 }}
      className={`relative h-16 overflow-hidden border font-display text-2xl md:text-3xl tracking-tight tabular-nums transition-colors duration-300 ${
        active ? "border-accent bg-accent" : "border-muted/50"
      }`}
    >
      {!active && <BleedFill hovered={b.hovered} origin={b.origin} className="bg-accent" />}
      <span
        className={`relative z-10 transition-colors duration-300 ${
          active || b.hovered ? "text-background" : "text-foreground"
        }`}
      >
        ${value}
      </span>
    </motion.button>
  );
}

/* ── Submit button — same bleed hover as hero CTAs ───────────────── */

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
      className="relative w-full md:w-auto inline-flex items-center justify-center gap-3 h-14 min-w-[300px] px-8 bg-accent overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed font-grotesk font-medium tracking-tight text-[15px]"
    >
      <BleedFill hovered={b.hovered} origin={b.origin} className="bg-foreground" />
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
