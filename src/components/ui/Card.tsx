"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "elevated" | "outlined";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", hover = false, padding = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-abyss-elevated/50",
      glass: "glass",
      elevated: "bg-abyss-elevated shadow-depth-2",
      outlined: "bg-transparent border border-glass-border",
    };

    const paddings = {
      none: "",
      sm: "p-4",
      md: "p-6 md:p-8",
      lg: "p-8 md:p-10",
      xl: "p-10 md:p-12",
    };

    const hoverStyles = hover ? "card-hover" : "";

    return (
      <div
        ref={ref}
        className={cn("rounded-2xl", variants[variant], paddings[padding], hoverStyles, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-display-sm text-ghost-white", className)} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={cn("mt-1 text-body-sm text-ghost-muted", className)} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("mt-4 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";