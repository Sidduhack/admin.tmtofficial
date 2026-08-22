"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoCard } from "@/components/sections/VideoCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface VideosPageClientProps {
  featuredVideos: {
    id: string;
    youtube_id: string;
    title: string;
    thumbnail_url: string | null;
    duration: number | null;
    view_count: number | null;
    like_count: number | null;
    published_at: string;
    category: string | null;
    featured: boolean;
    challenge: boolean;
    popular: boolean;
  }[];
  popularVideos: typeof featuredVideos;
  newVideos: typeof featuredVideos;
}

export function VideosPageClient({ featuredVideos, popularVideos, newVideos }: VideosPageClientProps) {
  const [activeTab, setActiveTab] = useState<"featured" | "new">("featured");

  const featuredContent = [...featuredVideos, ...popularVideos.filter((v) => !featuredVideos.some((f) => f.id === v.id))];

  return (
    <div className="min-h-screen bg-abyss-black">
      <section className="relative pt-32 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
              VIDEO ARCHIVE
            </span>
            <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tight text-ghost-white mb-4">
              <span className="text-gradient-cyan">FEATURED</span> & <span className="text-gradient-violet">NEW</span>
            </h1>
            <p className="text-body-lg text-ghost-muted">
              Explore our cinematic let&rsquo;s plays, epic challenges, and latest uploads.
            </p>
          </motion.div>

          <div className="relative mb-12">
            <div className="flex items-center justify-center gap-2 bg-abyss-elevated/50 backdrop-blur-glass rounded-xl p-1 border border-glass-border/50 w-fit mx-auto">
              <button
                onClick={() => setActiveTab("featured")}
                className={cn(
                  "px-6 py-3 rounded-lg font-display font-medium text-body-sm transition-all duration-300",
                  activeTab === "featured"
                    ? "bg-neon-cyan text-abyss-black shadow-glow-cyan"
                    : "text-ghost-muted hover:text-ghost-white hover:bg-glass-hover"
                )}
              >
                FEATURED & POPULAR
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={cn(
                  "px-6 py-3 rounded-lg font-display font-medium text-body-sm transition-all duration-300",
                  activeTab === "new"
                    ? "bg-neon-violet text-abyss-black shadow-glow-violet"
                    : "text-ghost-muted hover:text-ghost-white hover:bg-glass-hover"
                )}
              >
                NEW UPLOADS
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === "featured" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === "featured" ? 20 : -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {activeTab === "featured" ? (
                  <FeaturedSection videos={featuredContent} />
                ) : (
                  <NewVideosSection videos={newVideos} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeaturedSection({ videos }: { videos: VideosPageClientProps["featuredVideos"] }) {
  const featured = videos.filter((v) => v.featured || v.challenge).slice(0, 3);
  const popular = videos.filter((v) => v.popular || (!v.featured && !v.challenge)).slice(0, 9);

  return (
    <div className="space-y-16">
      {featured.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="FEATURED & CHALLENGES"
            subtitle="Hand-picked cinematic experiences"
            accent="cyan"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((video, i) => (
              <VideoCard key={video.id} video={video} variant="featured" index={i} />
            ))}
          </div>
        </motion.section>
      )}

      {popular.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionHeader
            title="POPULAR VIDEOS"
            subtitle="Most watched by the community"
            accent="violet"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {popular.map((video, i) => (
              <VideoCard key={video.id} video={video} variant="standard" index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

function NewVideosSection({ videos }: { videos: VideosPageClientProps["newVideos"] }) {
  const latest = videos[0];
  const recent = videos.slice(1, 10);

  return (
    <div className="space-y-12">
      {latest && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="LATEST UPLOAD"
            subtitle={latest.published_at ? `Published ${new Date(latest.published_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}` : "Just dropped"}
            accent="cyan"
          />
          <VideoCard video={latest} variant="featured" index={0} />
        </motion.section>
      )}

      {recent.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SectionHeader
            title="RECENT UPLOADS"
            subtitle="Fresh from the abyss"
            accent="violet"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recent.map((video, i) => (
              <VideoCard key={video.id} video={video} variant="standard" index={i} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}