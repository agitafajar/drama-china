"use client";

import { useEffect, useRef, useState, memo } from "react";
import "plyr/dist/plyr.css";
import { useWatchHistory } from "@/hooks/useWatchHistory";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onEnded?: () => void;
  contentType?: string;
  dramaId?: string;
  episodeId?: string;
}

function VideoPlayer({
  src,
  poster,
  onEnded,
  contentType,
  dramaId,
  episodeId,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const hlsRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { saveProgress, getEpisodeProgress } = useWatchHistory();

  // Store onEnded in a ref so we can call the latest version without resetting the player
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  useEffect(() => {
    // We strictly want to run this once per src change.
    // Cleanup previous instances first.
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    let mounted = true;

    const initPlayer = async () => {
      try {
        const Plyr = (await import("plyr")).default;
        const Hls = (await import("hls.js")).default;

        if (!mounted) return;
        if (!videoRef.current) return;

        // Reset error
        setError(null);

        const defaultOptions = {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "fullscreen",
          ],
          settings: ["quality", "speed", "loop"],
          autoplay: true,
          hideControls: true,
          displayDuration: true,
        };

        // Helper to bind events
        const bindEvents = (player: any) => {
          player.on("ended", () => {
            if (onEndedRef.current) onEndedRef.current();
          });

          // Save progress every 5 seconds or on pause
          let lastSave = 0;
          player.on("timeupdate", (event: any) => {
            const now = Date.now();
            if (now - lastSave > 5000) {
              // 5s throttle
              const currentTime = player.currentTime;
              const duration = player.duration;
              if (dramaId && episodeId && currentTime > 5 && duration > 0) {
                saveProgress(dramaId, episodeId, currentTime, duration);
                lastSave = now;
              }
            }
          });

          player.on("pause", () => {
            const currentTime = player.currentTime;
            const duration = player.duration;
            if (dramaId && episodeId && currentTime > 5 && duration > 0) {
              saveProgress(dramaId, episodeId, currentTime, duration);
            }
          });
        };

        // RESUME LOGIC
        let startTime = 0;
        if (dramaId && episodeId) {
          const saved = getEpisodeProgress(dramaId, episodeId);
          // Only resume if progress < 95% (to avoid resuming at credits for finished eps)
          if (saved && saved.currentTime > 5 && saved.progress < 95) {
            startTime = saved.currentTime;
          }
        }

        const handleResume = (p: any) => {
          // If start time is set, ensure we seek to it
          if (startTime > 0) {
            // Try immediate seek
            if (Math.abs(p.currentTime - startTime) > 1) {
              p.currentTime = startTime;
            }

            // And a backup seek after a short delay since HLS/Autoplay can reset it
            setTimeout(() => {
              if (Math.abs(p.currentTime - startTime) > 1) {
                p.currentTime = startTime;
              }
            }, 800);
          }
        };

        // Determine if HLS
        const isHls =
          contentType === "application/x-mpegURL" || src.endsWith(".m3u8");

        // HLS Logic
        if (Hls.isSupported() && isHls) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            startPosition: startTime, // HLS start time
          });
          hls.loadSource(src);
          hls.attachMedia(videoRef.current);
          hlsRef.current = hls;

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            // Only init Plyr if valid
            if (!videoRef.current) return;
            if (!playerRef.current) {
              const player = new Plyr(videoRef.current, defaultOptions);
              playerRef.current = player;

              // Force seek when player is ready
              player.on("ready", () => handleResume(player));

              // Fallback if ready fired before listener
              if (startTime > 0 && videoRef.current) {
                videoRef.current.currentTime = startTime;
              }

              bindEvents(player);
            }
          });
          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            if (data.fatal) {
              console.error("HLS Fatal Error", data);
              setError("Stream error. Please try another server or browser.");
            }
          });
        } else {
          // MP4 / Direct Logic
          // Update video element directly for start time before plyr init
          if (startTime > 0) {
            videoRef.current.currentTime = startTime;
          }

          const player = new Plyr(videoRef.current, defaultOptions);
          playerRef.current = player;
          bindEvents(player);

          player.on("ready", () => handleResume(player));

          playerRef.current.source = {
            type: "video",
            sources: [
              {
                src: src,
                type: contentType || "video/mp4",
                // size: 1080
              },
            ],
            poster: poster,
          };
        }
      } catch (e) {
        console.error("Player initialization failed", e);
        setError("Failed to load player.");
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [src, contentType]); // Remove onEnded from dependency

  return (
    <div className="relative w-full h-full bg-black group video-player-inner">
      <style jsx global>{`
        .plyr {
          height: 100%;
          width: 100%;
          --plyr-color-main: #e50914;
          z-index: 20;
          background: #000 !important; /* Force black background for pillarboxing */
        }
        .plyr__video-wrapper {
          height: 100%;
          background: #000 !important;
        }
        .plyr video {
          object-fit: contain !important; /* Ensure pillarboxing */
          height: 100%;
        }
        :global(body.fullscreen-mode) .plyr video {
          object-fit: contain !important;
        }
      `}</style>

      {/* Error Message Display */}
      {error && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 text-white">
          <div className="text-center">
            <p className="text-red-500 font-bold mb-2">Unavailable</p>
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        </div>
      )}

      <div className="relative z-20 h-full w-full">
        <video
          ref={videoRef}
          className="plyr"
          playsInline
          preload="auto"
          poster={poster}
          // IMPORTANT: No src attribute here to avoid double-loading. Plyr handles source.
          // IMPORTANT: No controls attribute here. Plyr handles UI.
        />
      </div>
    </div>
  );
}

// Memoize to prevent re-renders from parent that cause hydration issues
export default memo(VideoPlayer);
