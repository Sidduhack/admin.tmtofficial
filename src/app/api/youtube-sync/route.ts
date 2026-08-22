import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      maxres?: { url: string };
      high?: { url: string };
      medium?: { url: string };
    };
    publishedAt: string;
  };
}

interface YouTubeVideoDetailsItem {
  id: string;
  contentDetails: { duration: string };
  statistics: {
    viewCount: string;
    likeCount: string;
  };
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

async function fetchLatestVideos(maxResults = 50) {
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
    throw new Error("YouTube API not configured");
  }

  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("channelId", CHANNEL_ID);
  searchUrl.searchParams.set("maxResults", String(maxResults));
  searchUrl.searchParams.set("order", "date");
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("key", YOUTUBE_API_KEY);

  const searchResponse = await fetch(searchUrl.toString());
  if (!searchResponse.ok) throw new Error("YouTube search API failed");
  const searchData = await searchResponse.json();

  const videoIds = searchData.items.map((item: YouTubeSearchItem) => item.id.videoId).join(",");

  const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  detailsUrl.searchParams.set("part", "contentDetails,statistics");
  detailsUrl.searchParams.set("id", videoIds);
  detailsUrl.searchParams.set("key", YOUTUBE_API_KEY);

  const detailsResponse = await fetch(detailsUrl.toString());
  if (!detailsResponse.ok) throw new Error("YouTube details API failed");
  const detailsData = await detailsResponse.json();

  const detailsMap = new Map(detailsData.items.map((item: YouTubeVideoDetailsItem) => [item.id, item]));

  return searchData.items.map((item: YouTubeSearchItem) => {
    const details = detailsMap.get(item.id.videoId);
    return {
      youtube_id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      duration: details?.contentDetails ? parseDuration(details.contentDetails.duration) : null,
      view_count: details?.statistics ? parseInt(details.statistics.viewCount, 10) : null,
      like_count: details?.statistics ? parseInt(details.statistics.likeCount, 10) : null,
      published_at: item.snippet.publishedAt,
      category: "Gaming",
      featured: false,
      challenge: false,
      popular: false,
    };
  });
}

function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

interface VideoData {
  id: string;
  title: string;
  thumbnail_url: string | null;
  youtube_id: string;
}

async function sendNotificationEmails(supabase: ReturnType<typeof createServerSupabaseClient>, video: VideoData) {
  const { data: subscriptions } = await supabase
    .from("notification_subscriptions")
    .select("id, email")
    .eq("video_alerts", true)
    .eq("confirmed", true);

  if (!subscriptions || subscriptions.length === 0) return;

  const emailWorkerUrl = process.env.CLOUDFLARE_EMAIL_WORKER_URL;
  const apiToken = process.env.CLOUDFLARE_EMAIL_API_TOKEN;

  if (!emailWorkerUrl || !apiToken) {
    console.warn("Email worker not configured");
    return;
  }

  for (const sub of subscriptions) {
    try {
      await fetch(`${emailWorkerUrl}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiToken}` },
        body: JSON.stringify({
          to: sub.email,
          subject: `🎮 New Video: ${video.title}`,
          html: `
            <div style="font-family: 'IBM Plex Sans', sans-serif; background: #030307; color: #F0F0F5; padding: 40px 20px;">
              <div style="max-width: 600px; margin: 0 auto;">
                <div style="text-align: center; margin-bottom: 2rem;">
                  <h1 style="font-family: 'Space Grotesk', sans-serif; color: #00FFFF; font-size: 1.5rem;">TMT OFFICIAL</h1>
                </div>
                <div style="background: #0A0A12; border: 1px solid rgba(0,255,255,0.15); border-radius: 16px; overflow: hidden;">
                  <img src="${video.thumbnail_url}" alt="${video.title}" style="width: 100%; height: auto; display: block;" />
                  <div style="padding: 24px;">
                    <h2 style="font-family: 'Space Grotesk', sans-serif; color: #F0F0F5; margin: 0 0 12px; font-size: 1.25rem;">${video.title}</h2>
                    <p style="color: #6B6B7A; margin: 0 0 24px; line-height: 1.6;">Fresh from the abyss. Watch now before anyone else.</p>
                    <a href="https://youtube.com/watch?v=${video.youtube_id}" style="display: inline-block; background: linear-gradient(135deg, #00FFFF, #BC13FE); color: #030307; padding: 14px 28px; border-radius: 10px; font-weight: 700; text-decoration: none; font-family: 'Space Grotesk', sans-serif;">WATCH NOW</a>
                  </div>
                </div>
                <p style="color: #6B6B7A; font-size: 0.75rem; text-align: center; margin-top: 1.5rem;">
                  You&rsquo;re receiving this because you subscribed to video alerts.
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL}/join" style="color: #00FFFF;">Manage preferences</a>
                </p>
              </div>
            </div>
          `,
        }),
      });

      await supabase.from("notification_events").insert({
        video_id: video.id,
        subscription_id: sub.id,
        type: "new_video",
        status: "sent",
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to send email to ${sub.email}:`, error);
      await supabase.from("notification_events").insert({
        video_id: video.id,
        subscription_id: sub.id,
        type: "new_video",
        status: "failed",
        error: String(error),
        created_at: new Date().toISOString(),
      });
    }
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServerSupabaseClient({
      get: () => undefined,
      set: () => {},
      remove: () => {},
    });

    const videos = await fetchLatestVideos(20);
    let added = 0;
    let updated = 0;
    const newVideos: VideoData[] = [];

    for (const video of videos) {
      const { data: existing } = await supabase
        .from("videos")
        .select("id")
        .eq("youtube_id", video.youtube_id)
        .single();

      if (existing) {
        const { error } = await supabase
          .from("videos")
          .update({
            title: video.title,
            description: video.description,
            thumbnail_url: video.thumbnail_url,
            duration: video.duration,
            view_count: video.view_count,
            like_count: video.like_count,
            published_at: video.published_at,
            category: video.category,
            synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (!error) updated++;
      } else {
        const { data: inserted, error } = await supabase
          .from("videos")
          .insert({
            ...video,
            synced_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select("id")
          .single();
        if (!error && inserted) {
          added++;
          newVideos.push({ ...video, id: inserted.id });
        }
      }
    }

    for (const video of newVideos) {
      await sendNotificationEmails(supabase, video);
    }

    await supabase.from("analytics_events").insert({
      session_id: "cron-youtube-sync",
      event_type: "youtube_sync",
      page: "/api/youtube-sync",
      metadata: { added, updated, new_videos: newVideos.length },
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, added, updated, newVideos: newVideos.length });
  } catch (error) {
    console.error("YouTube sync error:", error);
    return NextResponse.json({ error: "Sync failed", details: String(error) }, { status: 500 });
  }
}