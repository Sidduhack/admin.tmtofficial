"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  magnetic?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, magnetic = false, disabled, children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-display font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-abyss-black disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-neon-cyan text-abyss-black hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-neon-cyan",
      secondary: "bg-abyss-elevated text-ghost-white border border-glass-border hover:border-neon-violet/50 hover:bg-abyss-charcoal hover:shadow-glow-violet active:scale-[0.98] focus-visible:ring-neon-violet",
      ghost: "bg-transparent text-ghost-muted hover:text-neon-cyan hover:bg-glass-hover focus-visible:ring-neon-cyan",
      danger: "bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98] focus-visible:ring-red-500",
    };

    const sizes = {
      sm: "px-4 py-2 rounded-lg text-body-sm",
      md: "px-6 py-3 rounded-xl text-body-base",
      lg: "px-8 py-4 rounded-xl text-body-lg",
      xl: "px-10 py-5 rounded-2xl text-display-sm",
    };

    const magneticStyles = magnetic ? "magnetic will-change-transform" : "";

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], magneticStyles, className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";