"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { Navigation } from "@/components/layout/Navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const MILESTONES = [
  { year: "2019", title: "CHANNEL LAUNCHED", description: "First video uploaded: \"Minecraft Survival Ep. 1\"", icon: "play" },
  { year: "2020", title: "100K SUBSCRIBERS", description: "Hit the first major milestone. Silver play button earned.", icon: "award" },
  { year: "2021", title: "HARDCORE SERIES DEBUT", description: "Launched \"100 Days Hardcore\" - viral hit with 15M views.", icon: "zap" },
  { year: "2022", title: "1M SUBSCRIBERS", description: "Gold play button. Expanded to variety gaming content.", icon: "crown" },
  { year: "2023", title: "2M SUBSCRIBERS", description: "Launched merchandise line. First community convention.", icon: "star" },
  { year: "2024", title: "2.4M & COUNTING", description: "New studio. New series. New challenges ahead.", icon: "target" },
];

const CONTENT_PILLARS = [
  { title: "HARDCORE SURVIVAL", description: "Permadeath challenges. One life. Maximum tension. From Minecraft to Elden Ring.", icon: "skull", color: "neon-cyan" },
  { title: "CINEMATIC LET'S PLAYS", description: "Story-driven gameplay with immersive commentary. Experience games like films.", icon: "film", color: "neon-violet" },
  { title: "EPIC CHALLENGES", description: "Self-imposed restrictions. Speedruns. No-hit runs. Community-voted challenges.", icon: "trophy", color: "neon-gold" },
  { title: "COMMUNITY EVENTS", description: "Multiplayer collaborations. Viewer games. Tournaments. You shape the content.", icon: "users", color: "pink-500" },
];

const VALUES = [
  { title: "AUTHENTICITY", description: "No scripts. No fake reactions. Real gameplay, real emotions, real moments." },
  { title: "QUALITY OVER QUANTITY", description: "Every video crafted with intention. Cinematic editing. Immersive storytelling." },
  { title: "COMMUNITY FIRST", description: "You decide what we play. Your clips, your art, your voice in every video." },
  { title: "CONTINUOUS EVOLUTION", description: "Always experimenting. New formats. New games. Never settling." },
];

export default function AboutPage() {
  const { playUIHover, playUIClick } = useSound();

  return (
    <div className="min-h-screen bg-abyss-black">
      <Navigation />

      <section className="relative pt-32 pb-20 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
              WHO IS TMT
            </span>
            <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tight text-ghost-white mb-6">
              <span className="text-gradient-cyan">ABOUT</span> <span className="text-gradient-violet">THE ABYSS</span>
            </h1>
            <p className="text-body-lg text-ghost-muted max-w-2xl mx-auto">
              Not just a gaming channel. A cinematic journey through virtual worlds.
              Built on authenticity. Driven by community. Crafted for the elite.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24"
          >
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-transparent to-neon-violet/10 rounded-3xl" />
              <div className="relative aspect-square rounded-3xl overflow-hidden glass border-glass-border">
                <img
                  src="https://picsum.photos/seed/tmt-about/800/800"
                  alt="TMT Creator"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-neon-cyan/50 overflow-hidden">
                      <img src="https://picsum.photos/seed/tmt-avatar/100/100" alt="TMT" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-display-sm text-ghost-white">TMT OFFICIAL</h3>
                      <p className="text-body-sm text-neon-cyan">Content Creator & Gamer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="font-display font-semibold text-display-md text-ghost-white mb-4">THE JOURNEY</h2>
                <p className="text-body-lg text-ghost-muted mb-6">
                  Started in a bedroom with a capture card and a dream.
                  Five years later, the abyss has grown into a home for millions.
                </p>
                <p className="text-body-base text-ghost-muted">
                  Every video is a story. Every challenge is a test of skill and will.
                  We don't just play games — we create experiences that linger
                  long after the screen goes dark.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {CONTENT_PILLARS.map((pillar, i) => (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <Card variant="glass" hover padding="lg" className="h-full">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", `bg-${pillar.color}/20`)}>
                        {pillar.icon === "skull" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 1.5S9.5 3 7.5 3A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>}
                        {pillar.icon === "film" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>}
                        {pillar.icon === "trophy" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>}
                        {pillar.icon === "users" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                      </div>
                      <h3 className="font-display font-semibold text-body-lg text-ghost-white mb-2">{pillar.title}</h3>
                      <p className="text-body-sm text-ghost-muted">{pillar.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-6 lg:px-8 bg-abyss-charcoal/50">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="MILESTONES"
            subtitle="The path from zero to legend"
            accent="gold"
          />

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-cyan to-neon-violet" />

            <div className="space-y-12">
              {MILESTONES.map((milestone, i) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-0 top-2 flex items-center justify-center w-14 h-14 rounded-full glass border-glass-border z-10">
                    <span className="font-display font-bold text-display-sm text-neon-cyan">{milestone.year}</span>
                  </div>
                  <Card variant="glass" hover padding="lg" className="ml-4">
                    <div className="flex items-start gap-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", `bg-${milestone.color || "neon-cyan"}/20`)}>
                        {milestone.icon === "play" && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>}
                        {milestone.icon === "award" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="8" r="7" /><path d="M8.21 13.89l3 3.87L23 15" /></svg>}
                        {milestone.icon === "zap" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                        {milestone.icon === "crown" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                        {milestone.icon === "star" && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>}
                        {milestone.icon === "target" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>}
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-display-sm text-ghost-white mb-1">{milestone.title}</h3>
                        <p className="text-body-base text-ghost-muted">{milestone.description}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="CORE VALUES"
            subtitle="The principles that guide every video"
            accent="violet"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group"
              >
                <Card variant="glass" hover padding="lg" className="h-full text-center">
                  <div className="w-16 h-16 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center mx-auto mb-6 group-hover:border-neon-cyan group-hover:bg-neon-cyan/20 transition-all">
                    <svg className="w-8 h-8 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      {value.title === "AUTHENTICITY" && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />}
                      {value.title === "QUALITY OVER QUANTITY" && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                      {value.title === "COMMUNITY FIRST" && <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
                      {value.title === "CONTINUOUS EVOLUTION" && <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />} }
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-body-lg text-ghost-white mb-2">{value.title}</h3>
                  <p className="text-body-sm text-ghost-muted">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 px-4 md:px-6 lg:px-8 bg-abyss-charcoal/50">
        <div className="max-w-7xl mx-auto text-center">
          <SectionHeader
            title="READY TO DIVE IN?"
            subtitle="The abyss awaits. New videos every week."
            accent="cyan"
          />
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button size="xl" variant="primary" className="min-w-[200px]">
              <span>WATCH LATEST</span>
            </Button>
            <Button size="xl" variant="secondary" className="min-w-[200px]">
              <span>JOIN COMMUNITY</span>
            </Button>
            <Button size="xl" variant="ghost" className="min-w-[200px]">
              <span>SUBSCRIBE</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}