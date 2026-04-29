"use client";

import Select, {
  type StylesConfig,
  type Props as SelectProps,
} from "react-select";
import type { GroupBase } from "react-select";
import { useEffect, useState } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

/**
 * react-select styled to match the Vanguard brand:
 * - bg: surface (#0F0F0F)
 * - border: muted (#3A3A3A) → accent (#C8F400) on focus/hover
 * - sharp corners (no border radius)
 * - mono uppercase labels with wide letter-spacing
 * - acid-green caret + acid-green hover row in the menu
 */
const styles: StylesConfig<SelectOption, false, GroupBase<SelectOption>> = {
  control: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused
      ? "rgba(15, 15, 15, 0.85)"
      : "rgba(5, 5, 5, 0.5)",
    borderColor: state.isFocused ? "#C8F400" : "rgba(58, 58, 58, 0.6)",
    borderWidth: 1,
    borderRadius: 0,
    minHeight: 56,
    boxShadow: "none",
    outline: "none",
    cursor: "pointer",
    transition: "border-color 200ms, background-color 200ms",
    paddingLeft: 8,
    paddingRight: 8,
    "&:hover": { borderColor: "#C8F400" },
  }),
  valueContainer: (base) => ({ ...base, padding: "2px 12px" }),
  singleValue: (base) => ({
    ...base,
    color: "#F0EDE6",
    fontFamily: "var(--font-space-mono), monospace",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: 13,
  }),
  placeholder: (base) => ({
    ...base,
    color: "rgba(240, 237, 230, 0.3)",
    fontFamily: "var(--font-space-mono), monospace",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    fontSize: 13,
  }),
  input: (base) => ({
    ...base,
    color: "#F0EDE6",
    fontFamily: "var(--font-space-mono), monospace",
    fontSize: 13,
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#C8F400" : "rgba(200, 244, 0, 0.7)",
    paddingRight: 14,
    transition: "color 200ms",
    "&:hover": { color: "#C8F400" },
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#0F0F0F",
    border: "1px solid rgba(58, 58, 58, 0.6)",
    borderRadius: 0,
    marginTop: 4,
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    zIndex: 50,
  }),
  menuList: (base) => ({ ...base, padding: 0, maxHeight: 240 }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgba(200, 244, 0, 0.18)"
      : state.isFocused
        ? "rgba(200, 244, 0, 0.10)"
        : "transparent",
    color: state.isSelected
      ? "#C8F400"
      : state.isFocused
        ? "#F0EDE6"
        : "rgba(240, 237, 230, 0.8)",
    fontFamily: "var(--font-space-mono), monospace",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: 12,
    padding: "12px 16px",
    cursor: "pointer",
    borderLeft: state.isSelected
      ? "2px solid #C8F400"
      : state.isFocused
        ? "2px solid rgba(200, 244, 0, 0.5)"
        : "2px solid transparent",
    transition: "background-color 150ms, color 150ms, border-color 150ms",
    // Kills react-select's default light-blue `:active` flash on click-hold
    ":active": {
      backgroundColor: "rgba(200, 244, 0, 0.25)",
      color: "#C8F400",
    },
    // Override hover so :hover doesn't re-bleed the default
    "&:hover": {
      backgroundColor: state.isSelected
        ? "rgba(200, 244, 0, 0.22)"
        : "rgba(200, 244, 0, 0.10)",
      color: state.isSelected ? "#C8F400" : "#F0EDE6",
    },
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "rgba(240, 237, 230, 0.5)",
    fontFamily: "var(--font-space-mono), monospace",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
  }),
};

type Props = Omit<
  SelectProps<SelectOption, false, GroupBase<SelectOption>>,
  "styles"
> & {
  /** Use to opt into custom styles per-instance. */
  styleOverrides?: StylesConfig<SelectOption, false, GroupBase<SelectOption>>;
};

export function ThemedSelect({ styleOverrides, ...props }: Props) {
  // Avoid SSR hydration mismatch from react-select's auto-generated IDs
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="h-14 w-full border border-muted/60 bg-background/50" />
    );
  }
  return (
    <Select<SelectOption, false>
      styles={styleOverrides ?? styles}
      classNamePrefix="vanguard-select"
      isSearchable={false}
      {...props}
    />
  );
}
