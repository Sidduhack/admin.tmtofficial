"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/Button";
import { Navigation } from "@/components/layout/Navigation";

const ADMIN_NAV = [
  { href: "/admin/dashboard", label: "DASHBOARD", icon: "layout" },
  { href: "/admin/content", label: "CONTENT", icon: "file" },
  { href: "/admin/feedback", label: "FEEDBACK", icon: "message" },
  { href: "/admin/users", label: "USERS", icon: "users" },
  { href: "/admin/notifications", label: "NOTIFICATIONS", icon: "bell" },
  { href: "/admin/analytics", label: "ANALYTICS", icon: "chart" },
  { href: "/admin/security", label: "SECURITY", icon: "shield" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { playUIHover, playUIClick } = useSound();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/join?redirect=/admin/dashboard";
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-abyss-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ghost-muted">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-abyss-black">
      <Navigation />

      <div className="flex">
        <aside className={cn(
          "fixed lg:static inset-y-0 left-0 z-[layer-3] w-64 bg-abyss-charcoal border-r border-glass-border",
          "flex flex-col transition-transform duration-300 ease-cinematic",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-glass-border">
            <Link href="/admin/dashboard" className="flex items-center gap-3" onClick={() => playUIClick()}>
              <svg className="w-8 h-8 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polygon points="12 2 19 8.5 19 15.5 12 22 5 15.5 5 8.5 12 2" />
                <circle cx="12" cy="12" r={3} />
              </svg>
              <span className="font-display font-bold text-display-sm text-gradient-cyan">TMT ADMIN</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg glass hover:bg-glass-hover"
              onClick={() => { playUIClick(); setSidebarOpen(false); }}
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-display font-medium text-body-sm",
                  "transition-all duration-300",
                  pathname === item.href
                    ? "bg-neon-cyan/10 text-neon-cyan border-l-4 border-neon-cyan"
                    : "text-ghost-muted hover:text-ghost-white hover:bg-glass-hover"
                )}
                onClick={() => { playUINav(); setSidebarOpen(false); }}
              >
                <span className="w-5 h-5 text-neon-cyan/50" aria-hidden="true">
                  {item.icon === "layout" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>}
                  {item.icon === "file" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
                  {item.icon === "message" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
                  {item.icon === "users" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                  {item.icon === "bell" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>}
                  {item.icon === "chart" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
                  {item.icon === "shield" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-glass-border">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-ghost-muted hover:text-neon-cyan hover:bg-glass-hover transition-all" onClick={() => playUIClick()}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
              <span className="font-display font-medium text-body-sm">VIEW SITE</span>
            </Link>
          </div>
        </aside>

        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[layer-2] bg-abyss-black/80 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-glass-border">
            <button
              onClick={() => { playUIClick(); setSidebarOpen(true); }}
              className="p-2 rounded-lg glass hover:bg-glass-hover"
              aria-label="Open sidebar"
            >
              <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <span className="font-display font-bold text-display-sm text-gradient-cyan">ADMIN</span>
            <div className="w-10" />
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}