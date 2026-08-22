"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout/Navigation";
import { useSound } from "@/lib/sound";

const IntroExperience = dynamic(
  () => import("@/components/three/IntroExperience").then((mod) => mod.IntroExperience),
  { ssr: false, loading: () => <div className="fixed inset-0 bg-abyss-black z-[layer-5]" /> }
);

const Hero3D = dynamic(
  () => import("@/components/three/Hero3D").then((mod) => mod.Hero3D),
  { ssr: false, loading: () => <div className="w-full h-screen bg-abyss-black" /> }
);

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const { playUIClick, resumeContext } = useSound();

  useEffect(() => {
    resumeContext();
    const visited = localStorage.getItem("tmt-intro-completed");
    if (visited) {
      setIsReturningVisitor(true);
    }
  }, [resumeContext]);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setIntroCompleted(true);
    localStorage.setItem("tmt-intro-completed", "true");
  }, []);

  const handleSkipIntro = useCallback(() => {
    playUIClick();
    setShowIntro(false);
    setIntroCompleted(true);
    localStorage.setItem("tmt-intro-completed", "true");
  }, [playUIClick]);

  return (
    <div className="relative min-h-screen bg-abyss-black overflow-hidden">
      {showIntro && (
        <IntroExperience
          onComplete={handleIntroComplete}
          isReturningVisitor={isReturningVisitor}
          onSkip={handleSkipIntro}
        />
      )}

      {!showIntro && (
        <>
          <Hero3D />
          <Navigation />
        </>
      )}

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .animate-in,
          .animate-in-delay-1,
          .animate-in-delay-2,
          .animate-in-delay-3,
          .animate-in-delay-4,
          .animate-in-delay-5 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}