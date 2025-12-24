import { MetadataRoute } from "next";
import { dramaApi } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nontoncdrama.com";

  // Static routes
  const routes = ["", "/trending", "/latest", "/search"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic routes (Fetch some trending dramas for SEO)
  let dramaRoutes: MetadataRoute.Sitemap = [];
  try {
    const trending = await dramaApi.getTrending();
    dramaRoutes = trending.map((drama) => ({
      url: `${baseUrl}/drama/${drama.bookId}`,
      lastModified: new Date(), // Ideally this comes from API
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Sitemap generation failed to fetch dramas", error);
  }

  return [...routes, ...dramaRoutes];
}
