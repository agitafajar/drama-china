import { dramaApi } from "@/lib/api";
import WatchLayoutClient from "./WatchLayoutClient";
import WatchView from "./WatchView";
import { notFound } from "next/navigation";

import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ episode?: string; title?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const { title: titleParam } = await searchParams;

  // Optimistically fetch detail for metadata
  // Note: We might want a lighter way to get just title/cover if possible,
  // but getting detail is standard.
  const drama = await dramaApi.getDramaDetail(id, titleParam);

  if (!drama) {
    return {
      title: "Drama Not Found",
    };
  }

  const title = `${drama.bookName} | NontonCDrama`;
  const description =
    drama.introduction?.slice(0, 160) ||
    `Nonton ${drama.bookName} gratis subtitle Indonesia.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: drama.cover || drama.coverWap || "/og-placeholder.jpg",
          width: 800,
          height: 600,
          alt: drama.bookName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [drama.cover || drama.coverWap || ""],
    },
  };
}

export default async function WatchPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { episode: episodeId, title: titleParam } = await searchParams;

  const [drama, episodes] = await Promise.all([
    dramaApi.getDramaDetail(id, titleParam),
    dramaApi.getAllEpisodes(id),
  ]);

  if (!episodes || episodes.length === 0) {
    notFound();
  }

  // Sort episodes by index to ensure correct order
  episodes.sort((a, b) => a.chapterIndex - b.chapterIndex);

  // Find current episode
  // Convert to string to ensure safe comparison (API might return number)
  const currentEpisode = episodeId
    ? episodes.find((e) => String(e.chapterId) === String(episodeId)) ||
      episodes[0]
    : episodes[0];

  if (!currentEpisode) {
    notFound();
  }

  // Extract video source
  const cdn =
    currentEpisode.cdnList?.find((c) => c.isDefault === 1) ||
    currentEpisode.cdnList?.[0];
  const rawVideoSource =
    cdn?.videoPathList?.sort((a, b) => b.quality - a.quality)[0]?.videoPath ||
    "";

  // Transform video source to proxy URL
  const generateProxyUrl = (url: string) => {
    if (!url) return "";
    // Use local proxy API
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  };

  const isHls =
    rawVideoSource.toLowerCase().includes(".m3u8") ||
    rawVideoSource.toLowerCase().includes(".m3u");
  const shouldUseDirect = isHls;

  const videoSource = shouldUseDirect
    ? rawVideoSource
    : generateProxyUrl(rawVideoSource);

  const contentType = isHls ? "application/x-mpegURL" : "video/mp4";

  // Calculate Next/Prev
  const currentIndex = episodes.findIndex(
    (e) => e.chapterId === currentEpisode.chapterId
  );
  const prevEpisode = episodes[currentIndex - 1];
  const nextEpisode = episodes[currentIndex + 1];

  return (
    <WatchLayoutClient>
      <WatchView
        drama={drama}
        episodes={episodes}
        currentEpisode={currentEpisode}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
        videoSource={videoSource}
        contentType={contentType}
        titleParam={titleParam}
        id={id}
      />
    </WatchLayoutClient>
  );
}
