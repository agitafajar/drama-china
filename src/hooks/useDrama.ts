import { useQuery } from "@tanstack/react-query";
import { dramaApi } from "@/lib/api";
import { Drama, Episode } from "@/types/drama";

export const useTrending = () => {
  return useQuery({
    queryKey: ["trending"],
    queryFn: dramaApi.getTrending,
  });
};

export const useLatest = () => {
  return useQuery({
    queryKey: ["latest"],
    queryFn: dramaApi.getLatest,
  });
};

export const useForYou = () => {
  return useQuery({
    queryKey: ["foryou"],
    queryFn: dramaApi.getForYou,
  });
};

export const useVip = () => {
  return useQuery({
    queryKey: ["vip"],
    queryFn: dramaApi.getVip,
  });
};

export const useSearch = (keyword: string) => {
  return useQuery({
    queryKey: ["search", keyword],
    queryFn: () => dramaApi.getSearch(keyword),
    enabled: !!keyword,
  });
};

export const useDramaDetail = (bookId: string) => {
  return useQuery({
    queryKey: ["drama", bookId],
    queryFn: () => dramaApi.getDramaDetail(bookId),
    enabled: !!bookId,
  });
};

export const useEpisodes = (bookId: string) => {
  return useQuery({
    queryKey: ["episodes", bookId],
    queryFn: () => dramaApi.getAllEpisodes(bookId),
    enabled: !!bookId,
  });
};

export const useRandomDrama = () => {
  return useQuery({
    queryKey: ["random"],
    queryFn: dramaApi.getRandom,
    refetchOnWindowFocus: false,
  });
};
