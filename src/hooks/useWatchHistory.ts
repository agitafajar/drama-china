import { useState, useEffect, useCallback } from "react";

export interface EpisodeProgress {
  currentTime: number;
  duration: number;
  progress: number; // 0-100
  updatedAt: number;
}

export interface DramaHistory {
  lastWatchedEpisodeId: string;
  lastUpdated: number;
  episodes: Record<string, EpisodeProgress>;
}

export interface HistoryStore {
  [dramaId: string]: DramaHistory;
}

const STORAGE_KEY = "drama-watch-history";

export function useWatchHistory() {
  const getHistory = (): HistoryStore => {
    if (typeof window === "undefined") return {};
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : {};
    } catch (e) {
      console.error("Failed to read watch history", e);
      return {};
    }
  };

  const saveProgress = useCallback(
    (
      dramaId: string,
      episodeId: string,
      currentTime: number,
      duration: number
    ) => {
      if (typeof window === "undefined") return;

      try {
        const history = getHistory();
        const dramaHistory = history[dramaId] || {
          lastWatchedEpisodeId: episodeId,
          lastUpdated: Date.now(),
          episodes: {},
        };

        // Update episode specific progress
        const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
        dramaHistory.episodes[episodeId] = {
          currentTime,
          duration,
          progress,
          updatedAt: Date.now(),
        };

        // Update last watched if this is the most recent action
        dramaHistory.lastWatchedEpisodeId = episodeId;
        dramaHistory.lastUpdated = Date.now();

        history[dramaId] = dramaHistory;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
    },
    []
  );

  const getEpisodeProgress = (
    dramaId: string,
    episodeId: string
  ): EpisodeProgress | undefined => {
    const history = getHistory();
    return history[dramaId]?.episodes?.[episodeId];
  };

  const getLastWatchedEpisode = (dramaId: string): string | undefined => {
    const history = getHistory();
    return history[dramaId]?.lastWatchedEpisodeId;
  };

  return {
    saveProgress,
    getEpisodeProgress,
    getLastWatchedEpisode,
    getHistory,
  };
}
