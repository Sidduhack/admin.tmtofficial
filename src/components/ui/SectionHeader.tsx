"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  accent?: "cyan" | "violet" | "gold";
  className?: string;
}

export function SectionHeader({ title, subtitle, accent = "cyan", className }: SectionHeaderProps) {
  const accentColors = {
    cyan: "text-neon-cyan",
    violet: "text-neon-violet",
    gold: "text-neon-gold",
  };

  const accentGradients = {
    cyan: "from-neon-cyan to-neon-violet",
    violet: "from-neon-violet to-neon-cyan",
    gold: "from-neon-gold to-yellow-300",
  };

  return (
    <div className={cn("text-center mb-10", className)}>
      <span className={cn("inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption tracking-widest mb-4", accentColors[accent])}>
        {title}
      </span>
      {subtitle && (
        <p className="text-body-lg text-ghost-muted max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div className={cn("mt-6 w-24 mx-auto h-0.5 rounded-full", `bg-gradient-to-r ${accentGradients[accent]}`)} />
    </div>
  );
}