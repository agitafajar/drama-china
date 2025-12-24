"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useWatchHistory } from "@/hooks/useWatchHistory";
import { useEffect, useState } from "react";

interface ResumeButtonProps {
  dramaId: string;
  defaultEpisodeId: string;
  className?: string;
  titleParam?: string;
}

export default function ResumeButton({
  dramaId,
  defaultEpisodeId,
  className,
  titleParam,
}: ResumeButtonProps) {
  const { getLastWatchedEpisode, getEpisodeProgress } = useWatchHistory();
  const [targetEpisodeId, setTargetEpisodeId] = useState(defaultEpisodeId);
  const [label, setLabel] = useState("Watch Now");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only access local storage on mount
    const lastId = getLastWatchedEpisode(dramaId);
    if (lastId) {
      setTargetEpisodeId(lastId);

      const epProgress = getEpisodeProgress(dramaId, lastId);
      if (epProgress && epProgress.progress < 95) {
        setLabel(`Resume Ep`);
        setProgress(epProgress.progress);
      } else {
        // If finished, it might be better to find the NEXT episode, but that requires full episode list.
        // For now, simpler logic: just "Watch Ep X"
        setLabel(`Watch Ep`);
      }
    }
  }, [dramaId, defaultEpisodeId]);

  return (
    <Link
      href={`/watch/${dramaId}?episode=${targetEpisodeId}&title=${
        titleParam || ""
      }`}
      className={className}
    >
      <Play className="mr-2 h-4 w-4 md:h-5 md:w-5" fill="currentColor" />
      {label === "Resume Ep" || label === "Watch Ep" ? (
        <span className="flex flex-col items-start leading-none">
          <span>{label === "Resume Ep" ? "Resume" : "Watch"}</span>
          {progress > 0 && (
            <span className="text-[10px] opacity-80 mt-0.5">
              Continue at {Math.round(progress)}%
            </span>
          )}
        </span>
      ) : (
        "Watch Now"
      )}
    </Link>
  );
}
