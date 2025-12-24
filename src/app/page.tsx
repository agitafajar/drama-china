import { dramaApi } from "@/lib/api";
import Link from "next/link";
import DramaCarousel from "@/components/DramaCarousel";

export const revalidate = 3600; // Revalidate every hour

export const metadata = {
  title: "Home",
  description:
    "Nonton drama China terbaik, terbaru, dan trending dengan subtitle Indonesia. Gratis akses ke ribuan episode.",
  alternates: {
    canonical: "https://nontoncdrama.com",
  },
};

export default async function Home() {
  const trending = await dramaApi.getTrending();
  const latest = await dramaApi.getLatest();
  // Using ForYou as "Recommended"
  let forYou: import("@/types/drama").Drama[] = [];
  let vip: import("@/types/drama").Drama[] = [];
  try {
    const results = await Promise.allSettled([
      dramaApi.getForYou(),
      dramaApi.getVip(),
    ]);

    if (results[0].status === "fulfilled") forYou = results[0].value;
    if (results[1].status === "fulfilled") vip = results[1].value;
  } catch (e) {
    console.error("Failed to fetch extra categories", e);
  }

  // Use the first trending as featured, or fallback
  const featuredDrama = trending[0];

  return (
    <div className="min-h-screen bg-[#0f0f0f] pb-20">
      {/* Hero Section */}
      {featuredDrama && (
        <section className="relative h-[85vh] w-full flex items-center md:items-center justify-start text-left">
          <div className="absolute inset-0 z-0">
            <img
              src={featuredDrama.cover || featuredDrama.coverWap}
              alt={featuredDrama.bookName}
              className="h-full w-full object-cover object-top"
            />
            {/* Gradient Overlays matching the design (darker on left/bottom) */}
            <div className="absolute inset-0 bg-linear-to-t from-[#0f0f0f] via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/50 to-transparent" />
          </div>

          <div className="relative z-10 p-6 md:p-12 max-w-4xl mx-auto w-full lg:mx-0 lg:pl-20 mt-20">
            {/* Badge */}
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-[#e50914] px-1.5 py-0.5 rounded-sm">
                <span className="text-white text-[10px] uppercase font-bold tracking-widest">
                  DramaBox
                </span>
              </div>
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Eksklusif
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {featuredDrama.bookName}
            </h1>
            <p className="text-gray-200 text-base md:text-xl mb-8 line-clamp-3 max-w-xl font-light">
              {featuredDrama.introduction}
            </p>

            <div className="flex space-x-4">
              <Link
                href={`/drama/${featuredDrama.bookId}`}
                className="px-8 py-3.5 bg-[#f6c65d] hover:bg-[#e5b54c] text-black font-bold text-lg rounded-md flex items-center transition-transform hover:scale-105 shadow-lg shadow-yellow-500/20"
              >
                <div className="mr-2 fill-current">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                Tonton Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Content Rows */}
      <div className="space-y-12 px-0 md:px-12 -mt-24 pt-12 relative z-20 pb-10">
        <DramaCarousel title="Recommended For You" items={forYou} />
        <DramaCarousel title="Latest Releases" items={latest} />
        <DramaCarousel title="Trending Now" items={trending} />
        <DramaCarousel title="VIP Exclusives" items={vip} />
      </div>
    </div>
  );
}
