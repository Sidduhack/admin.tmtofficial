"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSound } from "@/lib/sound";
import { Navigation } from "@/components/layout/Navigation";

const GALLERY_CATEGORIES = ["All", "Artwork", "Behind the Scenes", "Screenshots", "Events", "Promotional"];

const MOCK_GALLERY = Array.from({ length: 24 }, (_, i) => ({
  id: `gallery-${i}`,
  src: `https://picsum.photos/seed/tmt-gallery-${i}/800/600`,
  alt: `TMT Gallery Image ${i + 1}`,
  category: GALLERY_CATEGORIES[Math.floor(Math.random() * (GALLERY_CATEGORIES.length - 1)) + 1],
  featured: i < 3,
}));

export default function GalleryPage() {
  const { playUIHover, playUIClick } = useSound();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredImages = activeCategory === "All"
    ? MOCK_GALLERY
    : MOCK_GALLERY.filter((img) => img.category === activeCategory);

  const handleImageClick = (index: number) => {
    playUIClick();
    const originalIndex = MOCK_GALLERY.findIndex((img) => img.id === filteredImages[index].id);
    setLightboxIndex(originalIndex);
    setLightboxOpen(true);
  };

  const handleLightboxNavigate = (direction: number) => {
    playUIHover();
    setLightboxIndex((prev) => (prev + direction + MOCK_GALLERY.length) % MOCK_GALLERY.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "Escape") setLightboxOpen(false);
    if (e.key === "ArrowLeft") handleLightboxNavigate(-1);
    if (e.key === "ArrowRight") handleLightboxNavigate(1);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  return (
    <div className="min-h-screen bg-abyss-black">
      <Navigation />

      <section className="relative pt-32 pb-16 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass border-glass-border/50 text-caption text-neon-cyan tracking-widest mb-6">
              DIGITAL EXHIBITION
            </span>
            <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(3.5rem,8vw,6rem)] font-black tracking-tight text-ghost-white mb-4">
              <span className="text-gradient-cyan">GALLERY</span>
            </h1>
            <p className="text-body-lg text-ghost-muted">
              A curated collection of artwork, behind-the-scenes moments, and memorable captures.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10" role="tablist" aria-label="Gallery categories">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => {
                  playUIHover();
                  setActiveCategory(cat);
                }}
                className={cn(
                  "px-5 py-2 rounded-full font-display font-medium text-body-sm transition-all duration-300",
                  "glass border border-glass-border",
                  activeCategory === cat
                    ? "bg-neon-cyan text-abyss-black shadow-glow-cyan border-neon-cyan/50"
                    : "text-ghost-muted hover:text-ghost-white hover:bg-glass-hover hover:border-neon-cyan/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                role="list"
                aria-label={`${activeCategory} gallery`}
              >
                {filteredImages.map((image, index) => (
                  <motion.article
                    key={image.id}
                    role="listitem"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03, type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={{ scale: 1.02 }}
                    className="relative group cursor-pointer rounded-2xl overflow-hidden glass border-glass-border"
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        placeholder="blur"
                        blurDataURL={image.src.replace("800/600", "20/15")}
                        onLoad={() => setLoadedImages((prev) => new Set(prev).add(index))}
                        loading={index < 8 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-abyss-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-3 left-3 right-3 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
                        <span className="px-3 py-1 text-xs font-mono text-neon-cyan/70 bg-neon-cyan/10 rounded">{image.category}</span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleImageClick(index)}
                          className="p-2 rounded-full glass border-neon-cyan/50 bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan hover:text-abyss-black hover:shadow-glow-cyan transition-all"
                          aria-label={`View ${image.alt} fullscreen`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                        </motion.button>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-display font-medium text-body-sm text-ghost-white line-clamp-1">{image.alt}</h3>
                    </div>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {filteredImages.length === 0 && (
            <div className="text-center py-20 glass rounded-2xl border-glass-border">
              <p className="text-ghost-muted">No images in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[layer-5] flex items-center justify-center bg-abyss-black/95 backdrop-blur-lg"
            onClick={() => setLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Image fullscreen view"
          >
            <motion.button
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              className="absolute top-6 right-6 z-10 p-3 rounded-full glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all"
              aria-label="Close lightbox"
            >
              <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </motion.button>

            <motion.button
              onClick={(e) => { e.stopPropagation(); handleLightboxNavigate(-1); }}
              className="absolute left-6 z-10 p-3 rounded-full glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all hidden md:flex"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
            </motion.button>

            <motion.button
              onClick={(e) => { e.stopPropagation(); handleLightboxNavigate(1); }}
              className="absolute right-6 z-10 p-3 rounded-full glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all hidden md:flex"
              aria-label="Next image"
            >
              <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>
            </motion.button>

            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-[90vw] max-h-[85vh]"
            >
              <Image
                src={MOCK_GALLERY[lightboxIndex].src}
                alt={MOCK_GALLERY[lightboxIndex].alt}
                width={1200}
                height={900}
                className="rounded-xl shadow-depth-3"
                priority
              />
              <div className="mt-4 text-center">
                <h3 className="font-display font-semibold text-body-lg text-ghost-white">{MOCK_GALLERY[lightboxIndex].alt}</h3>
                <p className="text-body-sm text-ghost-muted mt-1">{MOCK_GALLERY[lightboxIndex].category}</p>
              </div>
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:hidden">
              <motion.button
                onClick={(e) => { e.stopPropagation(); handleLightboxNavigate(-1); }}
                className="p-3 rounded-full glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all"
                aria-label="Previous image"
              >
                <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="15 18 9 12 15 6" /></svg>
              </motion.button>
              <motion.button
                onClick={(e) => { e.stopPropagation(); handleLightboxNavigate(1); }}
                className="p-3 rounded-full glass hover:bg-glass-hover hover:border-neon-cyan/50 transition-all"
                aria-label="Next image"
              >
                <svg className="w-6 h-6 text-ghost-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><polyline points="9 18 15 12 9 6" /></svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}