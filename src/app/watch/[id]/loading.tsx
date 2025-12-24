export default function Loading() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-3 pb-24">
            <div className="w-full max-w-5xl mx-auto mb-10">
              <div className="aspect-video w-full bg-gray-800 rounded-2xl animate-pulse" />
            </div>
            <div className="h-8 w-1/2 bg-gray-800 rounded animate-pulse mb-6" />
            <div className="h-4 w-1/4 bg-gray-800 rounded animate-pulse mb-8" />
            <div className="bg-gray-900/50 rounded-xl p-6 border border-white/5 h-48 animate-pulse" />
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-gray-900/30 rounded-xl border border-white/10 h-[600px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
