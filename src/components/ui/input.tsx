"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-14 w-full border-b-2 border-muted bg-transparent px-0 py-2 font-mono text-base text-foreground placeholder:text-muted/80 transition-colors outline-none",
        "focus:border-accent focus-visible:ring-0",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";
