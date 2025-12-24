import { dramaApi } from "@/lib/api";
import DramaCard from "@/components/DramaCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await searchParams;
  const keyword = query || "";
  let results: import("@/types/drama").Drama[] = [];

  if (keyword) {
    try {
      results = await dramaApi.getSearch(keyword);
    } catch (error) {
      console.error("Search failed:", error);
    }
  }

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Search Results</h1>
        <p className="text-gray-400">
          {keyword
            ? `Showing results for "${keyword}"`
            : "Enter a keyword to search"}
        </p>
      </div>

      {results && results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results.map((drama) => (
            <DramaCard key={drama.bookId} drama={drama} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          {keyword
            ? "No dramas found matching your criteria."
            : "Start typing to search for dramas."}
        </div>
      )}
    </div>
  );
}
