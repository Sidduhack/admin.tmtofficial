import { createServerSupabaseClient } from "@/lib/supabase";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UC...";

export interface YouTubeVideo {
  id: string;
  youtube_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration: number | null;
  view_count: number | null;
  like_count: number | null;
  published_at: string;
  category: string | null;
  featured: boolean;
  challenge: boolean;
  popular: boolean;
}

export interface YouTubeApiResponse {
  items: YouTubeApiItem[];
  nextPageToken?: string;
  pageInfo: { totalResults: number; resultsPerPage: number };
}

export interface YouTubeApiItem {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: { default: { url: string }; medium: { url: string }; high: { url: string }; standard?: { url: string }; maxres?: { url: string } };
    publishedAt: string;
    channelId: string;
  };
  contentDetails?: { duration: string };
  statistics?: { viewCount: string; likeCount: string; commentCount: string };
}

function parseDuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function getBestThumbnail(thumbnails: YouTubeApiItem["snippet"]["thumbnails"]): string {
  return thumbnails.maxres?.url || thumbnails.standard?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url;
}

export async function fetchLatestVideos(maxResults = 20): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn("YouTube API key not configured");
    return [];
  }

  try {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("channelId", CHANNEL_ID);
    searchUrl.searchParams.set("maxResults", String(maxResults));
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("key", YOUTUBE_API_KEY);

    const searchResponse = await fetch(searchUrl.toString(), { next: { revalidate: 300 } });
    if (!searchResponse.ok) throw new Error("YouTube search API failed");
    const searchData: YouTubeApiResponse = await searchResponse.json();

    const videoIds = searchData.items.map((item) => item.id.videoId).join(",");

    const detailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    detailsUrl.searchParams.set("part", "contentDetails,statistics");
    detailsUrl.searchParams.set("id", videoIds);
    detailsUrl.searchParams.set("key", YOUTUBE_API_KEY);

    const detailsResponse = await fetch(detailsUrl.toString(), { next: { revalidate: 300 } });
    if (!detailsResponse.ok) throw new Error("YouTube details API failed");
    const detailsData: YouTubeApiResponse = await detailsResponse.json();

    const detailsMap = new Map(detailsData.items.map((item) => [item.id, item]));

    return searchData.items.map((item) => {
      const details = detailsMap.get(item.id.videoId);
      return {
        id: item.id.videoId,
        youtube_id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail_url: getBestThumbnail(item.snippet.thumbnails),
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
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error);
    return [];
  }
}

export async function fetchVideoById(youtubeId: string): Promise<YouTubeVideo | null> {
  if (!YOUTUBE_API_KEY) return null;

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails,statistics");
    url.searchParams.set("id", youtubeId);
    url.searchParams.set("key", YOUTUBE_API_KEY);

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!response.ok) return null;
    const data: YouTubeApiResponse = await response.json();
    const item = data.items[0];
    if (!item) return null;

    return {
      id: item.id,
      youtube_id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail_url: getBestThumbnail(item.snippet.thumbnails),
      duration: item.contentDetails ? parseDuration(item.contentDetails.duration) : null,
      view_count: item.statistics ? parseInt(item.statistics.viewCount, 10) : null,
      like_count: item.statistics ? parseInt(item.statistics.likeCount, 10) : null,
      published_at: item.snippet.publishedAt,
      category: "Gaming",
      featured: false,
      challenge: false,
      popular: false,
    };
  } catch {
    return null;
  }
}

export async function syncVideosToDatabase(): Promise<{ added: number; updated: number }> {
  const supabase = createServerSupabaseClient({
    get: () => undefined,
    set: () => {},
    remove: () => {},
  });

  const videos = await fetchLatestVideos(50);
  let added = 0;
  let updated = 0;

  for (const video of videos) {
    const { data: existing } = await supabase.from("videos").select("id").eq("youtube_id", video.youtube_id).single();

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
      const { error } = await supabase.from("videos").insert({
        ...video,
        synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (!error) added++;
    }
  }

  return { added, updated };
}

export async function getFeaturedVideos(): Promise<YouTubeVideo[]> {
  const supabase = createServerSupabaseClient({
    get: () => undefined,
    set: () => {},
    remove: () => {},
  });

  const { data } = await supabase
    .from("featured_videos")
    .select("video_id, position, videos(*)")
    .order("position", { ascending: true });

  return data?.map((item) => item.videos as YouTubeVideo).filter(Boolean) || [];
}

export async function getPopularVideos(): Promise<YouTubeVideo[]> {
  const supabase = createServerSupabaseClient({
    get: () => undefined,
    set: () => {},
    remove: () => {},
  });

  const { data } = await supabase
    .from("videos")
    .select("*")
    .or("featured.eq.true,challenge.eq.true,popular.eq.true")
    .order("view_count", { ascending: false, nullsLast: true })
    .limit(12);

  return data || [];
}

export async function getNewVideos(limit = 10): Promise<YouTubeVideo[]> {
  const supabase = createServerSupabaseClient({
    get: () => undefined,
    set: () => {},
    remove: () => {},
  });

  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  return data || [];
}