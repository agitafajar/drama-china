"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import VideoPlayer from "@/components/VideoPlayer";
import type { Drama, Episode } from "@/types/drama";

interface WatchViewProps {
  drama?: Drama;
  episodes: Episode[];
  currentEpisode: Episode;
  prevEpisode?: Episode;
  nextEpisode?: Episode;
  videoSource: string;
  titleParam?: string;
  id: string;
  contentType?: string;
}

export default function WatchView({
  drama,
  episodes,
  currentEpisode,
  prevEpisode,
  nextEpisode,
  videoSource,
  titleParam,
  id,
  contentType,
}: WatchViewProps) {
  const router = useRouter();
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Optional: Persist autoplay preference
  useEffect(() => {
    const saved = localStorage.getItem("autoplay");
    if (saved !== null) {
      setIsAutoplay(saved === "true");
    }
  }, []);

  const toggleAutoplay = () => {
    const newValue = !isAutoplay;
    setIsAutoplay(newValue);
    localStorage.setItem("autoplay", String(newValue));
  };

  const handleVideoEnded = () => {
    if (isAutoplay && nextEpisode) {
      router.push(
        `/watch/${id}?episode=${
          nextEpisode.chapterId
        }&title=${encodeURIComponent(drama?.bookName || titleParam || "")}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* 1. Video Player Section */}
          <div className="order-1 lg:col-span-3 w-full max-w-5xl mx-auto mb-6 lg:mb-10">
            <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 video-player-container-wrapper relative ring-1 ring-white/10">
              {/* Background ambient glow */}
              <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-20 -z-10 animate-pulse"></div>

              <VideoPlayer
                key={videoSource} // Force remount on source change
                src={videoSource}
                poster={drama?.cover || drama?.coverWap}
                onEnded={handleVideoEnded}
                contentType={contentType}
                dramaId={drama?.bookId || id}
                episodeId={String(currentEpisode.chapterId)}
              />
            </div>
          </div>

          {/* 2. Title & Metadata */}
          <div className="order-2 lg:col-span-3 mb-4 lg:mb-8 hide-in-fullscreen">
            <h1 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight">
              {drama?.bookName || `Drama ${id}`}
            </h1>
            <div className="flex flex-col gap-4 text-gray-400 text-sm border-b border-gray-800 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-y-3">
                <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm">
                  <span className="text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded">
                    {currentEpisode.chapterName}
                  </span>
                  <span>•</span>
                  <span>{episodes.length} Episodes</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    {drama?.tags?.join(", ") || "Drama"}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center space-x-2 md:space-x-3 w-full md:w-auto justify-end">
                  {prevEpisode ? (
                    <Link
                      href={`/watch/${id}?episode=${
                        prevEpisode.chapterId
                      }&title=${encodeURIComponent(
                        drama?.bookName || titleParam || ""
                      )}`}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors text-[10px] md:text-xs"
                    >
                      <ChevronLeft size={12} className="mr-1" /> Prev
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gray-900 text-gray-600 rounded-full cursor-not-allowed text-[10px] md:text-xs"
                    >
                      <ChevronLeft size={12} className="mr-1" /> Prev
                    </button>
                  )}

                  {nextEpisode ? (
                    <Link
                      href={`/watch/${id}?episode=${
                        nextEpisode.chapterId
                      }&title=${encodeURIComponent(
                        drama?.bookName || titleParam || ""
                      )}`}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors text-[10px] md:text-xs"
                    >
                      Next <ChevronRight size={12} className="ml-1" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gray-900 text-gray-600 rounded-full cursor-not-allowed text-[10px] md:text-xs"
                    >
                      Next <ChevronRight size={12} className="ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Sidebar (Right Column / Middle on Mobile) */}
          <div className="order-3 lg:col-span-1 lg:col-start-4 lg:row-start-1 lg:row-span-3 hide-in-fullscreen mb-8 lg:mb-0">
            <div className="bg-gray-900/30 rounded-xl border border-white/10 flex flex-col h-[350px] lg:h-[calc(100vh-120px)] lg:max-h-[800px] sticky top-24">
              {/* Header with AutoPlay Toggle */}
              <div className="p-3 md:p-4 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
                <h3 className="font-bold text-white text-sm md:text-base">
                  Up Next
                </h3>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-[10px] md:text-xs text-gray-400">
                    Autoplay
                  </span>
                  <button
                    onClick={toggleAutoplay}
                    className={clsx(
                      "relative w-8 h-4 md:w-10 md:h-5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                      isAutoplay ? "bg-primary" : "bg-gray-600"
                    )}
                  >
                    <span
                      className={clsx(
                        "absolute top-0.5 left-0.5 inline-block w-3 h-3 md:w-4 md:h-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out",
                        isAutoplay
                          ? "translate-x-4 md:translate-x-5"
                          : "translate-x-0"
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                {episodes.map((ep, idx) => {
                  const isCurrent = ep.chapterId === currentEpisode.chapterId;
                  return (
                    <Link
                      key={ep.chapterId}
                      href={`/watch/${id}?episode=${
                        ep.chapterId
                      }&title=${encodeURIComponent(
                        drama?.bookName || titleParam || ""
                      )}`}
                      className={clsx(
                        "flex gap-3 p-2 rounded-lg transition-all group",
                        isCurrent
                          ? "bg-white/10 ring-1 ring-primary/50"
                          : "hover:bg-white/5"
                      )}
                    >
                      {/* Thumbnail Placeholder */}
                      <div className="relative w-24 md:w-28 aspect-video rounded-md overflow-hidden bg-gray-800 shrink-0">
                        <img
                          src={
                            drama?.cover ||
                            drama?.coverWap ||
                            "/placeholder.jpg"
                          }
                          alt="Ep"
                          className={clsx(
                            "w-full h-full object-cover transition-opacity",
                            isCurrent
                              ? "opacity-100"
                              : "opacity-60 group-hover:opacity-80"
                          )}
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-ping" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px] md:text-[9px] text-white">
                          Ep {idx + 1}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex flex-col justify-center min-w-0">
                        <h4
                          className={clsx(
                            "text-xs md:text-sm font-medium truncate mb-0.5 md:mb-1",
                            isCurrent
                              ? "text-primary"
                              : "text-gray-200 group-hover:text-white"
                          )}
                        >
                          {ep.chapterName}
                        </h4>
                        <p className="text-[9px] md:text-[10px] text-gray-500 truncate">
                          {drama?.bookName || "Drama"}
                        </p>
                        {isCurrent && (
                          <span className="text-[9px] md:text-[10px] text-primary mt-1 font-bold">
                            PLAYING
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 4. Synopsis */}
          <div className="order-4 lg:col-span-3 bg-gray-900/50 rounded-xl p-4 md:p-6 border border-white/5 hide-in-fullscreen pb-24 h-fit">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-4">
              Synopsis
            </h3>
            <div className="relative">
              <p
                className={clsx(
                  "text-gray-300 leading-relaxed text-sm md:text-base transition-all duration-300",
                  !isExpanded && "line-clamp-3 md:line-clamp-none"
                )}
              >
                {drama?.introduction ||
                  "No description available for this drama."}
              </p>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-1 text-primary text-xs font-semibold hover:underline md:hidden focus:outline-none"
              >
                {isExpanded ? "Lihat Lebih Sedikit" : "Lihat Selengkapnya"}
              </button>
            </div>

            {/* Tags */}
            <div className="mt-4 md:mt-6 flex flex-wrap gap-2">
              {drama?.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 md:px-3 md:py-1 bg-white/5 border border-white/10 rounded-full text-[10px] md:text-xs text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
