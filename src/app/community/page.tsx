"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { Navigation } from "@/components/layout/Navigation";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const ANNOUNCEMENTS = [
  { id: 1, title: "NEW SERIES ANNOUNCED", content: "Starting next week: \"Hardcore Minecraft Survival\" - 100 days, one life, no cheats. Are you ready?", type: "series", date: "2024-01-15", link: "/videos" },
  { id: 2, title: "COMMUNITY EVENT: BOSS RUSH", content: "Join us this Saturday for a community boss rush in Elden Ring. Winners get custom roles in Discord!", type: "event", date: "2024-01-12", link: "https://discord.gg" },
  { id: 3, title: "MERCH DROP #3", content: "Limited edition \"Abyss Walker\" hoodies now available. Only 500 pieces worldwide.", type: "merch", date: "2024-01-10", link: "/shop" },
  { id: 4, title: "MILESTONE: 2.5M SUBSCRIBERS", content: "Thank you to every single one of you. Special celebration stream this Friday at 8 PM EST.", type: "milestone", date: "2024-01-08", link: "/videos" },
];

const SOCIAL_STATS = [
  { platform: "YouTube", handle: "@TMT_OFFICIAL-y2x", followers: "2.4M", color: "red-500", icon: "youtube" },
  { platform: "Discord", handle: "discord.gg/tmt", followers: "187K", color: "#5865F2", icon: "discord" },
  { platform: "Instagram", handle: "@tmt_official", followers: "342K", color: "pink-500", icon: "instagram" },
  { platform: "Twitter/X", handle: "@TMT_OFFICIAL", followers: "156K", color: "sky-400", icon: "twitter" },
];

export default function CommunityPage() {
  const { playUIHover, playUIClick } = useSound();
  const [activeTab, setActiveTab] = useState<"announcements" | "social" | "highlights">("announcements");

  return (
    <div className="min-h-screen bg-abyss-black">
      <Navigation />

      <section className="relative pt-32 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
              COMMUNITY HUB
            </span>
            <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tight text-ghost-white mb-4">
              <span className="text-gradient-cyan">JOIN THE</span> <span className="text-gradient-violet">ABYSS</span>
            </h1>
            <p className="text-body-lg text-ghost-muted">
              Connect with fellow travelers. Share moments. Build legends together.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist">
            {[
              { id: "announcements", label: "ANNOUNCEMENTS" },
              { id: "social", label: "SOCIAL ECOSYSTEM" },
              { id: "highlights", label: "COMMUNITY HIGHLIGHTS" },
            ].map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => { playUIHover(); setActiveTab(tab.id as typeof activeTab); }}
                className={cn(
                  "px-6 py-3 rounded-lg font-display font-medium text-body-sm transition-all duration-300",
                  "glass border border-glass-border",
                  activeTab === tab.id
                    ? "bg-neon-cyan text-abyss-black shadow-glow-cyan border-neon-cyan/50"
                    : "text-ghost-muted hover:text-ghost-white hover:bg-glass-hover hover:border-neon-cyan/30"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "announcements" && <AnnouncementsTab />}
              {activeTab === "social" && <SocialTab />}
              {activeTab === "highlights" && <HighlightsTab />}
            </motion.div>
          </AnimatePresence>

          <div className="mt-20">
            <SectionHeader
              title="CONNECT WITH TMT"
              subtitle="Choose your platform. Join the conversation."
              accent="gold"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              {SOCIAL_STATS.map((social, i) => (
                <motion.div
                  key={social.platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                  className="group"
                >
                  <Card variant="glass" hover padding="lg" className="h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", `bg-${social.color}/20`)}>
                        {social.icon === "youtube" && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.166 3.166 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.166 3.166 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.166 3.166 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                        {social.icon === "discord" && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.454 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 4.885 1.515.074.074 0 0 0 .079-.037c.21-.375.443-.864.607-1.25a18.28 18.28 0 0 0 5.454 0c.174.386.4.875.607 1.25a.074.074 0 0 0 .079.037 19.736 19.736 0 0 0 4.853-1.515.07.07 0 0 0 .032-.027c.862-8.378 0-13.006-3.548-13.66a.061.061 0 0 0-.031-.057zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>}
                        {social.icon === "instagram" && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>}
                        {social.icon === "twitter" && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-9.49L1.68 2.25h3.55l4.963 6.412 5.102-6.653H18.244z"/></svg>}
                      </div>
                      <div>
                        <p className="font-display font-semibold text-body-base text-ghost-white">{social.platform}</p>
                        <p className="text-body-sm text-ghost-muted">{social.handle}</p>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-ghost-muted mb-4">Connect with the community and never miss an update.</p>
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-neon-cyan font-display font-medium">{social.followers}</span>
                        <span className="text-ghost-muted">FOLLOWERS</span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full mt-4 group-hover:variant-primary transition-all"
                      onClick={() => playUIClick()}
                    >
                      FOLLOW
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function AnnouncementsTab() {
  return (
    <div className="space-y-4">
      {ANNOUNCEMENTS.map((announcement, i) => (
        <motion.article
          key={announcement.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group"
        >
          <Card variant="glass" hover padding="lg" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={cn(
                  "px-3 py-1 text-xs font-display font-semibold rounded-full",
                  announcement.type === "series" && "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30",
                  announcement.type === "event" && "bg-neon-violet/20 text-neon-violet border border-neon-violet/30",
                  announcement.type === "merch" && "bg-neon-gold/20 text-neon-gold border border-neon-gold/30",
                  announcement.type === "milestone" && "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                )}>
                  {announcement.type.toUpperCase()}
                </span>
                <time className="text-body-sm text-ghost-muted">{new Date(announcement.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              </div>
              <h3 className="font-display font-semibold text-display-sm text-ghost-white mb-1">{announcement.title}</h3>
              <p className="text-body-base text-ghost-muted max-w-2xl">{announcement.content}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => {}}>
              READ MORE
            </Button>
          </Card>
        </motion.article>
      ))}
    </div>
  );
}

function SocialTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "LATEST YOUTUBE COMMUNITY POSTS", icon: "youtube", color: "red-500", posts: [
            "Just hit 2.4M subs! Thank you all 🎉",
            "Poll: What game should I play next? 1) Elden Ring DLC 2) Minecraft Hardcore 3) Horror Games",
            "Behind the scenes from the 100 Days video coming tomorrow!",
          ]},
          { title: "DISCORD ACTIVITY", icon: "discord", color: "#5865F2", posts: [
            "🎮 #general: Anyone playing the new Elden Ring DLC?",
            "🎨 #fan-art: Amazing artwork by @user123!",
            "📢 #announcements: Community event this Saturday!",
          ]},
        ].map((section, i) => (
          <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card variant="glass" padding="lg">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", `bg-${section.color}/20`)}>
                  {section.icon === "youtube" && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.166 3.166 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.166 3.166 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.166 3.166 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.166 3.166 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>}
                  {section.icon === "discord" && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.454 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.083.083 0 0 0 .031.057 19.9 19.9 0 0 0 4.885 1.515.074.074 0 0 0 .079-.037c.21-.375.443-.864.607-1.25a18.28 18.28 0 0 0 5.454 0c.174.386.4.875.607 1.25a.074.074 0 0 0 .079.037 19.736 19.736 0 0 0 4.853-1.515.07.07 0 0 0 .032-.027c.862-8.378 0-13.006-3.548-13.66a.061.061 0 0 0-.031-.057zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>}
                </div>
                <h3 className="font-display font-semibold text-body-lg text-ghost-white">{section.title}</h3>
              </div>
              <div className="space-y-4">
                {section.posts.map((post, j) => (
                  <div key={j} className="p-4 glass rounded-xl border-glass-border/50 text-body-sm text-ghost-muted">
                    {post}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function HighlightsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { title: "FAN ART OF THE WEEK", author: "@artist_pro", image: "https://picsum.photos/seed/fanart1/400/300" },
        { title: "BEST CLIP: BOSS DEFEAT", author: "@clipmaster", image: "https://picsum.photos/seed/clip1/400/300" },
        { title: "COMMUNITY MONTAGE", author: "@editor_x", image: "https://picsum.photos/seed/montage1/400/300" },
        { title: "COSPLAY SPOTLIGHT", author: "@cosplayer", image: "https://picsum.photos/seed/cosplay1/400/300" },
        { title: "THEORY CRAFTING", author: "@loremaster", image: "https://picsum.photos/seed/theory1/400/300" },
        { title: "SPEEDRUN HIGHLIGHT", author: "@speedrunner", image: "https://picsum.photos/seed/speedrun1/400/300" },
      ].map((highlight, i) => (
        <motion.article key={highlight.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card variant="glass" hover padding="none" className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-video overflow-hidden">
              <img src={highlight.image} alt={highlight.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-abyss-black/80 via-transparent to-transparent" />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-display font-semibold text-body-lg text-ghost-white mb-1">{highlight.title}</h3>
              <p className="text-body-sm text-ghost-muted mb-4">By {highlight.author}</p>
              <Button variant="ghost" size="sm" className="mt-auto">VIEW</Button>
            </div>
          </Card>
        </motion.article>
      ))}
    </div>
  );
}