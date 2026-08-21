"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatNumber, formatDuration, formatRelativeTime } from "@/lib/utils";
import { useSound } from "@/lib/sound";
import { Button } from "@/components/ui/Button";

interface VideoCardProps {
  video: {
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
  };
  variant?: "featured" | "standard" | "compact";
  index?: number;
}

export function VideoCard({ video, variant = "standard", index = 0 }: VideoCardProps) {
  const { playUIHover, playUIClick, playNotification } = useSound();
  const [hovered, setHovered] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hovered && variant === "featured" && videoRef.current) {
      videoRef.current.play().catch(() => {});
      setPreviewPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPreviewPlaying(false);
    }
  }, [hovered, variant]);

  const handleMouseEnter = () => {
    setHovered(true);
    playUIHover();
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playUIClick();
    playNotification();
  };

  const badgeColors = {
    featured: "bg-neon-gold/20 text-neon-gold border-neon-gold/30",
    challenge: "bg-neon-violet/20 text-neon-violet border-neon-violet/30",
    popular: "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30",
  };

  const badges = [];
  if (video.featured) badges.push(<span key="featured" className={cn("badge", badgeColors.featured)}>FEATURED</span>);
  if (video.challenge) badges.push(<span key="challenge" className={cn("badge", badgeColors.challenge)}>CHALLENGE</span>);
  if (video.popular) badges.push(<span key="popular" className={cn("badge", badgeColors.popular)}>POPULAR</span>);

  const baseStyles = `
    relative group cursor-pointer
    glass rounded-2xl overflow-hidden
    transition-all duration-500 ease-cinematic
    hover:scale-[1.02] hover:shadow-depth-3 hover:border-neon-cyan/30
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan
  `;

  const variantStyles = {
    featured: "aspect-video md:aspect-[16/9]",
    standard: "aspect-video",
    compact: "aspect-video",
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(baseStyles, variantStyles[variant])}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="relative aspect-video overflow-hidden">
        <AnimatePresence mode="wait">
          {hovered && variant === "featured" && videoRef.current ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover opacity-0"
              muted
              loop
              playsInline
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
            >
              <source src={`https://img.youtube.com/vi/${video.youtube_id}/sddefault.jpg`} type="video/mp4" />
            </video>
          ) : null}
        </AnimatePresence>

        <Image
          src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
          alt=""
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          placeholder="blur"
          blurDataURL={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-abyss-black/80 via-transparent to-transparent" />

        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {badges.map((badge) =>
              motion.span({
                ...badge.props,
                className: cn(
                  "badge px-2.5 py-1 text-xs font-display font-semibold rounded-full border",
                  "transition-all duration-300",
                  "hover:scale-105 hover:shadow-glow-cyan",
                  badge.props.className
                ),
                initial={{ opacity: 0, y: -10 }},
                animate={{ opacity: 1, y: 0 }},
                transition={{ delay: 0.2 }}
              })
            )}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-1 text-xs font-mono font-medium text-abyss-black bg-neon-cyan rounded">
            {video.duration ? formatDuration(video.duration) : "LIVE"}
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            className="p-4 rounded-full glass border-neon-cyan/50 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-abyss-black hover:shadow-glow-cyan transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Play video"
          >
            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </motion.button>
        </div>
      </div>

      <div className="p-4 pt-3 space-y-2">
        <h3 className="font-display font-semibold text-body-base text-ghost-white line-clamp-2 group-hover:text-neon-cyan transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center gap-4 text-body-sm text-ghost-muted">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            {video.view_count ? formatNumber(video.view_count) : "—"}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            {video.like_count ? formatNumber(video.like_count) : "—"}
          </span>
          <span>{formatRelativeTime(video.published_at)}</span>
        </div>

        {video.category && (
          <span className="inline-block px-2 py-0.5 text-xs font-mono text-neon-cyan/70 bg-neon-cyan/10 rounded">
            {video.category}
          </span>
        )}
      </div>

      <Link
        href={`https://youtube.com/watch?v=${video.youtube_id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 -z-10"
        aria-label={`Watch "${video.title}" on YouTube`}
      />
    </motion.div>
  );
}