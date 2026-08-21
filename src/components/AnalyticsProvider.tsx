"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/lib/analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    trackEvent("session_start");

    const handleBeforeUnload = () => {
      trackEvent("session_end", { duration: Date.now() - performance.timeOrigin });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [trackEvent]);

  useEffect(() => {
    let scrollDepth = 0;
    const trackScroll = () => {
      const newDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (newDepth > scrollDepth && newDepth % 25 === 0) {
        scrollDepth = newDepth;
        trackEvent("scroll_depth", { depth: scrollDepth });
      }
    };
    window.addEventListener("scroll", trackScroll, { passive: true });
    return () => window.removeEventListener("scroll", trackScroll);
  }, [trackEvent]);

  return <>{children}</>;
}