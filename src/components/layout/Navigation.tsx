"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/sound";

const NAV_ITEMS = [
  { href: "/", label: "HOME", icon: "home" },
  { href: "/videos", label: "VIDEOS", icon: "play" },
  { href: "/gallery", label: "GALLERY", icon: "image" },
  { href: "/community", label: "COMMUNITY", icon: "users" },
  { href: "/about", label: "ABOUT", icon: "info" },
  { href: "/contact", label: "CONTACT", icon: "mail" },
  { href: "/join", label: "JOIN", icon: "user-plus" },
];

export function DesktopNavigation() {
  const pathname = usePathname();
  const { playUIHover, playUIClick, resumeContext } = useSound();
  const [expanded, setExpanded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    resumeContext();
  }, [resumeContext]);

  const handleItemClick = useCallback((_index: number) => {
    playUIClick();
    setExpanded(false);
  }, [playUIClick]);

  const handleItemHover = useCallback((_index: number | null) => {
    if (_index !== null) playUIHover();
    setHoveredIndex(_index);
  }, [playUIHover]);

  const activeIndex = NAV_ITEMS.findIndex((item) => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)));

  return (
    <>
      <motion.button
        ref={orbRef}
        className={cn(
          "fixed bottom-8 left-1/2 -translate-x-1/2 z-[layer-4] w-16 h-16 rounded-full",
          "glass border-glass-border/50",
          "flex items-center justify-center",
          "transition-all duration-500 ease-cinematic",
          "hover:scale-110 hover:border-neon-cyan/50 hover:shadow-glow-cyan",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
          expanded && "scale-125 border-neon-cyan shadow-glow-cyan"
        )}
        onClick={() => {
          playUIClick();
          setExpanded(!expanded);
        }}
        onMouseEnter={() => playUIHover()}
        aria-label={expanded ? "Close navigation" : "Open navigation"}
        aria-expanded={expanded}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-8 h-8 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polygon points="12 2 19 8.5 19 15.5 12 22 5 15.5 5 8.5 12 2" />
          <circle cx="12" cy="12" r={3} />
        </svg>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg className="w-10 h-10 text-neon-violet" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
            }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[layer-3] pointer-events-none"
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.button
                key={item.href}
                ref={(el) => (itemsRef.current[index] = el)}
                variants={{
                  visible: (i: number) => ({
                    opacity: 1,
                    scale: 1,
                    x: 0,
                    transition: { delay: i * 0.05, type: "spring", stiffness: 300, damping: 30 },
                  }),
                  hidden: { opacity: 0, scale: 0.8, x: index < NAV_ITEMS.length / 2 ? -50 : 50 },
                }}
                custom={index}
                className={cn(
                  "relative pointer-events-auto",
                  "glass px-5 py-3 rounded-xl font-display font-medium text-body-sm",
                  "border border-glass-border",
                  "transition-all duration-300",
                  "hover:scale-105 hover:border-neon-cyan hover:bg-glass-hover hover:shadow-glow-cyan",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan",
                  activeIndex === index && "bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-glow-cyan"
                )}
                onClick={() => handleItemClick(index)}
                onMouseEnter={() => handleItemHover(index)}
                onMouseLeave={() => handleItemHover(null)}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{item.label}</span>
                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-violet rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(100px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
        }
      `}</style>
    </>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  const { playUIHover, playUIClick, resumeContext } = useSound();
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resumeContext();
  }, [resumeContext]);

  const handleClose = useCallback(() => {
    playUIClick();
    setOpen(false);
  }, [playUIClick]);

  const handleItemClick = useCallback(() => {
    playUIClick();
    setOpen(false);
  }, [playUIClick]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, handleClose]);

  return (
    <>
      <button
        className={cn(
          "fixed bottom-6 right-6 z-[layer-4] w-14 h-14 rounded-full",
          "glass border-glass-border/50",
          "flex items-center justify-center",
          "transition-all duration-300",
          "hover:scale-110 hover:border-neon-cyan/50 hover:shadow-glow-cyan",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
        )}
        onClick={() => {
          playUIClick();
          setOpen(true);
        }}
        onMouseEnter={() => playUIHover()}
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <svg className="w-7 h-7 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polygon points="12 2 19 8.5 19 15.5 12 22 5 15.5 5 8.5 12 2" />
          <circle cx="12" cy="12" r={3} />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[layer-3] bg-abyss-black/80 backdrop-blur-sm"
              onClick={handleClose}
              aria-hidden="true"
            />
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-[layer-4] w-full max-w-sm"
            >
              <div className="flex flex-col h-full bg-abyss-charcoal border-l border-glass-border p-6 md:p-8">
                <div className="flex items-center justify-between mb-10">
                  <Link href="/" className="flex items-center gap-3" onClick={handleClose}>
                    <svg className="w-10 h-10 text-neon-cyan" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <polygon points="12 2 19 8.5 19 15.5 12 22 5 15.5 5 8.5 12 2" />
                      <circle cx="12" cy="12" r={3} />
                    </svg>
                    <span className="font-display font-bold text-display-sm text-gradient-cyan">TMT OFFICIAL</span>
                  </Link>
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all"
                    aria-label="Close navigation"
                  >
                    <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <nav className="flex-1" aria-label="Main navigation">
                  <ul className="space-y-2" role="list">
{NAV_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => handleItemClick(item.href)}
                          className={cn(
                            "flex items-center gap-4 px-4 py-4 rounded-xl",
                            "font-display font-medium text-body-base",
                            "transition-all duration-300",
                            "hover:bg-glass-hover hover:text-neon-cyan",
                            pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                              ? "bg-neon-cyan/10 text-neon-cyan border-l-4 border-neon-cyan"
                              : "text-ghost-muted"
                          )}
                        >
                          <span className="w-6 h-6 text-neon-cyan/50" aria-hidden="true">
                            {item.icon === "home" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                            {item.icon === "play" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polygon points="5 3 19 12 5 21 5 3" /></svg>}
                            {item.icon === "image" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
                            {item.icon === "users" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                            {item.icon === "info" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
                            {item.icon === "mail" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                            {item.icon === "user-plus" && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" /></svg>}
                          </span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-8 pt-8 border-t border-glass-border space-y-3">
                  <p className="text-caption text-ghost-muted">FOLLOW TMT</p>
                  <div className="flex items-center gap-3">
                    <a href="https://youtube.com/@TMT_OFFICIAL-y2x" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl glass hover:border-neon-cyan hover:bg-glass-hover transition-all" aria-label="YouTube">
                      <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.166 3.166 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.166 3.166 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.166 3.166 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                    <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl glass hover:border-neon-violet hover:bg-glass-hover transition-all" aria-label="Discord">
                      <svg className="w-6 h-6 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.454 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 4.885 1.515.074.074 0 0 0 .079-.037c.21-.375.443-.864.607-1.25a18.28 18.28 0 0 0 5.454 0c.174.386.4.875.607 1.25a.074.074 0 0 0 .079.037 19.736 19.736 0 0 0 4.853-1.515.07.07 0 0 0 .032-.027c.862-8.378 0-13.006-3.548-13.66a.061.061 0 0 0-.031-.057zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-12 h-12 rounded-xl glass hover:border-pink-500 hover:bg-glass-hover transition-all" aria-label="Instagram">
                      <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function Navigation() {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  return isMobile ? <MobileNavigation /> : <DesktopNavigation />;
}