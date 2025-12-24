import { dramaApi } from "@/lib/api";
import DramaCard from "@/components/DramaCard";

export default async function LatestPage() {
  const dramas = await dramaApi.getLatest();

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-primary pl-4">
        Latest Dramas
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {dramas.map((drama) => (
          <DramaCard key={drama.bookId} drama={drama} />
        ))}
      </div>
    </div>
  );
}
