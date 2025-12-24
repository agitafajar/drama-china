"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useEffect, useState } from "react";
import type { Episode } from "@/types/drama";

interface EpisodeGridProps {
  dramaId: string;
  episodes: Episode[];
  cover: string;
  title: string;
}

export default function EpisodeGrid({
  dramaId,
  episodes,
  cover,
  title,
}: EpisodeGridProps) {
  const { getHistory } = useWatchHistory();
  const [history, setHistory] = useState<any>({});

  useEffect(() => {
    // Load history once on mount
    const allHistory = getHistory();
    setHistory(allHistory[dramaId]?.episodes || {});
  }, [dramaId]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3 md:gap-4 pb-20">
      {episodes.map((ep) => {
        const epHistory = history[String(ep.chapterId)];
        const progress = epHistory?.progress || 0;

        return (
          <Link
            key={ep.chapterId}
            href={`/watch/${dramaId}?episode=${
              ep.chapterId
            }&title=${encodeURIComponent(title)}`}
            className="group relative bg-gray-900 rounded-md overflow-hidden hover:ring-2 hover:ring-primary transition-all"
          >
            <div className="aspect-video relative">
              <img
                src={cover}
                alt={ep.chapterName}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Progress Bar */}
              {progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              )}

              <span className="absolute bottom-2 right-2 text-[10px] md:text-xs font-bold text-white bg-black/60 px-1.5 rounded">
                {ep.chapterName}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
