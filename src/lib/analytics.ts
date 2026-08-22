"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface AnalyticsEvent {
  event_type: string;
  page: string;
  metadata?: Record<string, unknown>;
}

let sessionId: string | null = null;
const sessionStartTime = Date.now();

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  if (!sessionId) {
    sessionId = sessionStorage.getItem("tmt_session_id") || crypto.randomUUID();
    sessionStorage.setItem("tmt_session_id", sessionId);
  }
  return sessionId;
}

function getClientInfo() {
  if (typeof window === "undefined") return {};
  return {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    userAgent: navigator.userAgent,
    language: navigator.language,
    referrer: document.referrer,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

async function sendEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined") return;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return;

  try {
    await fetch(`${supabaseUrl}/rest/v1/analytics_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: event.event_type,
        page: event.page,
        metadata: {
          ...event.metadata,
          ...getClientInfo(),
          timestamp: Date.now(),
        },
        created_at: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch (error) {
    console.debug("Analytics send failed:", error);
  }
}

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageViewSent = useRef(false);
  const lastPathRef = useRef(pathname);

  useEffect(() => {
    if (pageViewSent.current && pathname === lastPathRef.current) return;

    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    sendEvent({
      event_type: "page_view",
      page: fullPath,
      metadata: { title: document.title },
    });

    pageViewSent.current = true;
    lastPathRef.current = pathname;
  }, [pathname, searchParams]);

  const trackEvent = useCallback((eventType: string, metadata?: Record<string, unknown>) => {
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    sendEvent({ event_type: eventType, page: fullPath, metadata });
  }, [pathname, searchParams]);

  return { trackEvent };
}

export function trackClick(element: string, metadata?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const pathname = window.location.pathname + window.location.search;
  sendEvent({ event_type: "click", page: pathname, metadata: { element, ...metadata } });
}

export function trackVideoClick(videoId: string, videoTitle: string, source: string) {
  trackClick("video_card", { video_id: videoId, video_title: videoTitle, source });
}

export function trackJoinConversion(plan: string) {
  trackClick("join_submit", { plan });
}

export function trackFeedbackSubmit(rating: number, category: string) {
  trackClick("feedback_submit", { rating, category });
}

export function trackSocialClick(platform: string) {
  trackClick("social_link", { platform });
}

export function trackGalleryInteraction(action: "view" | "fullscreen" | "download", imageId: string) {
  trackClick("gallery", { action, image_id: imageId });
}

export function getSessionDuration(): number {
  return Date.now() - sessionStartTime;
}