import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/types/database";

type VideoUpdate = Database["public"]["Tables"]["videos"]["Update"];
type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchVideoDetails(videoId: string) {
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API not configured");
  }

  const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  detailsUrl.searchParams.set("part", "snippet,contentDetails,statistics");
  detailsUrl.searchParams.set("id", videoId);
  detailsUrl.searchParams.set("key", YOUTUBE_API_KEY);

  const response = await fetch(detailsUrl.toString());
  if (!response.ok) throw new Error("YouTube API failed");
  const data = await response.json();

  if (!data.items?.length) throw new Error("Video not found");

  const item = data.items[0];
  const snippet = item.snippet;
  const contentDetails = item.contentDetails;
  const statistics = item.statistics;

  function parseDuration(isoDuration: string): number {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    return hours * 3600 + minutes * 60 + seconds;
  }

  return {
    youtube_id: videoId,
    title: snippet.title,
    description: snippet.description,
    thumbnail_url: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url,
    duration: parseDuration(contentDetails.duration),
    view_count: parseInt(statistics.viewCount || "0", 10),
    like_count: parseInt(statistics.likeCount || "0", 10),
    published_at: snippet.publishedAt,
  };
}

interface VideoData {
  youtube_id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  duration: number;
  view_count: number;
  like_count: number;
  published_at: string;
  category: string;
  featured: boolean;
  challenge: boolean;
  popular: boolean;
  synced_at?: string;
  updated_at?: string;
  created_at?: string;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const adminSecret = process.env.ADMIN_API_SECRET;

  if (adminSecret && authHeader !== `Bearer ${adminSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, category, featured, challenge, popular } = await request.json();
    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json({ error: "Invalid YouTube URL" }, { status: 400 });
    }

    const video = await fetchVideoDetails(videoId);

    const videoWithToggles: VideoData = {
      ...video,
      category: category || "Gaming",
      featured: featured === true,
      challenge: challenge === true,
      popular: popular === true,
    };

    const supabase = createServerSupabaseClient({
      get: () => undefined,
      set: () => {},
      remove: () => {},
    });

    const { data: existing } = await supabase
      .from("videos")
      .select("id")
      .eq("youtube_id", videoId)
      .single();

    if (existing) {
      const updateData: VideoUpdate = {
        ...videoWithToggles,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("videos")
        .update(updateData)
        .eq("id", existing.id);
      if (error) throw error;
      return NextResponse.json({ success: true, updated: true, video: videoWithToggles });
    }

    const { data: inserted, error } = await supabase
      .from("videos")
      .insert({
        ...videoWithToggles,
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as VideoInsert)
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, added: true, video: { ...videoWithToggles, id: inserted.id } });
  } catch (error) {
    console.error("Add video error:", error);
    return NextResponse.json({ error: "Failed to add video", details: String(error) }, { status: 500 });
  }
}