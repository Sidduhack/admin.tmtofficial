import { Metadata } from "next";
import { getFeaturedVideos, getPopularVideos, getNewVideos } from "@/lib/youtube";
import { VideosPageClient } from "./VideosPageClient";

export const metadata: Metadata = {
  title: "Videos",
  description: "Watch the latest gaming videos, featured challenges, and popular content from TMT OFFICIAL.",
};

export default async function VideosPage() {
  const [featuredVideos, popularVideos, newVideos] = await Promise.all([
    getFeaturedVideos(),
    getPopularVideos(),
    getNewVideos(20),
  ]);

  return <VideosPageClient featuredVideos={featuredVideos} popularVideos={popularVideos} newVideos={newVideos} />;
}