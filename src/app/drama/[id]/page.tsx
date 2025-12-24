import { dramaApi } from "@/lib/api";
import Link from "next/link";
import { Play, Share2, Info } from "lucide-react";
import ResumeButton from "@/components/ResumeButton";
import EpisodeGrid from "@/components/EpisodeGrid";

export default async function DramaDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string }>;
}) {
  const { id } = await params;
  const { title: titleParam } = await searchParams;

  // Fetch data in parallel
  const [drama, episodes] = await Promise.all([
    dramaApi.getDramaDetail(id, titleParam),
    dramaApi.getAllEpisodes(id),
  ]);

  if (!episodes || episodes.length === 0) {
    // If no episodes found, it's likely an invalid ID or API error.
    // Checking if drama exists is secondary, but if episodes exist we can show the page.
    // If really nothing, 404.
    // notFound();
  }

  // Use data from drama detail if available, or fallback

  // If we have episodes but no drama detail, we can try to infer some info/use placeholders
  if (!drama && episodes.length > 0) {
    // Just continue, we will show "Drama {id}"
  } else if (!drama && (!episodes || episodes.length === 0)) {
    // If truly nothing, then 404
    // notFound();
  }

  const title = drama?.bookName || `Drama ${id}`;
  // If no cover, use the first episode poster if available, or placeholder
  const firstEpCdn =
    episodes?.[0]?.cdnList?.find((c) => c.isDefault === 1) ||
    episodes?.[0]?.cdnList?.[0];
  // Usually CDN path is video, not image.
  // API doesn't seem to give episode thumbnails easily in the list.
  const cover = drama?.cover || drama?.coverWap || "/placeholder.jpg";
  const description =
    drama?.introduction ||
    "No description available. Drama details count not be found in our database, but you can still watch the episodes below.";
  const category = drama?.tags?.join(", ") || "Unknown Category";

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Banner with Blur */}
      <div className="relative min-h-[60vh] md:min-h-[85vh] w-full overflow-hidden flex items-end">
        <div
          className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-110"
          style={{ backgroundImage: `url(${cover})` }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-transparent h-32" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-end pb-10 md:pb-20 gap-6 md:gap-10">
          {/* Mobile: Title & Poster Row */}
          <div className="flex md:hidden items-end gap-4 w-full">
            <div className="w-28 aspect-[2/3] rounded-lg shadow-xl overflow-hidden border border-white/10 shrink-0">
              <img
                src={cover}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-2xl font-bold text-white leading-tight line-clamp-3 mb-2 drop-shadow-md">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
                <span className="bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {episodes?.length || 0} Episodes
                </span>
                <span className="truncate max-w-[120px]">{category}</span>
              </div>
            </div>
          </div>

          {/* Desktop Poster */}
          <div className="hidden md:block w-52 lg:w-72 aspect-[2/3] rounded-xl shadow-2xl overflow-hidden border border-white/10 shrink-0 transform hover:scale-105 transition-transform duration-500">
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info - Desktop & Common */}
          <div className="flex-1 text-white mb-0 md:mb-4">
            {/* Desktop Title */}
            <h1 className="hidden md:block text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight shadow-black drop-shadow-lg">
              {title}
            </h1>

            {/* Desktop Metadata */}
            <div className="hidden md:flex flex-wrap items-center gap-x-6 gap-y-2 text-sm md:text-base text-gray-200 mb-8 font-medium">
              <span className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                {episodes?.length || 0} Episodes
              </span>
              <span>{category}</span>
            </div>

            <p className="text-gray-300 max-w-3xl mb-6 md:mb-10 text-sm md:text-lg leading-relaxed line-clamp-3 md:line-clamp-4 mix-blend-plus-lighter">
              {description}
            </p>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <ResumeButton
                dramaId={id}
                defaultEpisodeId={String(episodes?.[0]?.chapterId)}
                titleParam={title}
                className="flex items-center justify-center px-6 md:px-8 py-2.5 md:py-3 bg-primary hover:bg-red-700 text-white text-sm md:text-base font-bold rounded transition-colors w-full md:w-auto"
              />
              <button className="flex items-center justify-center px-6 md:px-6 py-2.5 md:py-3 bg-white/10 hover:bg-white/20 text-white text-sm md:text-base font-semibold rounded backdrop-blur-md transition-colors w-full md:w-auto">
                <Share2 className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Grid - Scrollable & Compact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 border-l-4 border-primary pl-4">
          Episodes
        </h2>

        {episodes && episodes.length > 0 ? (
          <div className="max-h-[250px] overflow-y-auto no-scrollbar pr-1">
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <EpisodeGrid
              dramaId={id}
              episodes={episodes}
              cover={cover}
              title={title}
            />
          </div>
        ) : (
          <div className="text-gray-500">No episodes found.</div>
        )}
      </div>
    </div>
  );
}
