import axios from "axios";
import { Drama, Episode } from "@/types/drama";

const BASE_URL =
  typeof window === "undefined"
    ? "https://dramabox.sansekai.my.id/api/dramabox"
    : "/api/proxy";

const api = axios.create({
  baseURL: BASE_URL,
});

export const dramaApi = {
  getTrending: async () => {
    const { data } = await api.get<Drama[]>("/trending");
    return data;
  },
  getVip: async () => {
    const { data } = await api.get<any>("/vip");
    // Flatten all bookLists from the columnVoList
    const vipDramas: Drama[] =
      data?.columnVoList?.flatMap((col: any) => col.bookList || []) || [];
    return vipDramas;
  },
  getLatest: async () => {
    const { data } = await api.get<Drama[]>("/latest");
    return data;
  },
  getForYou: async () => {
    const { data } = await api.get<Drama[]>("/foryou");
    return data;
  },
  getSearch: async (query: string) => {
    const { data } = await api.get<Drama[]>(
      `/search?query=${encodeURIComponent(query)}`
    );
    return data;
  },
  getAllEpisodes: async (bookId: string) => {
    const { data } = await api.get<Episode[]>(`/allepisode?bookId=${bookId}`);
    return data;
  },
  getRandom: async () => {
    const { data } = await api.get<Drama[]>("/randomdrama");
    return data;
  },
  getDramaDetail: async (
    bookId: string,
    bookName?: string
  ): Promise<Drama | undefined> => {
    try {
      // 1. If we have a bookName, try valid search first (Fastest & Most Accurate)
      if (bookName) {
        try {
          const searchResults = await dramaApi.getSearch(bookName);
          const found = searchResults.find((d) => d.bookId === bookId);
          if (found) return found;
        } catch (error) {
          console.error("Search failed in getDramaDetail", error);
          // Proceed to fallback
        }
      }

      // 2. If no name or search failed, try lightweight lists (Trending/Latest)
      // We avoid fetching ALL lists to prevent timeouts.
      const [trending, latest] = await Promise.all([
        api.get<Drama[]>("/trending"),
        api.get<Drama[]>("/latest"),
      ]);

      let allDramas = [...(trending.data || []), ...(latest.data || [])];
      let found = allDramas.find((d) => d.bookId === bookId);

      if (found) return found;

      // 3. Fallback: Check VIP if still not found (Heavier but necessary for VIP content)
      const vip = await dramaApi.getVip();
      found = vip.find((d) => d.bookId === bookId);

      return found;
    } catch (e) {
      console.error("Error finding drama detail", e);
      return undefined;
    }
  },
};
