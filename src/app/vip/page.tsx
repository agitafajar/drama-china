import { dramaApi } from "@/lib/api";
import DramaCard from "@/components/DramaCard";
import { Crown } from "lucide-react";

export const metadata = {
  title: "VIP Access - Exclusive Dramas",
  description:
    "Akses koleksi drama VIP eksklusif. Nonton drama China premium tanpa batas dengan kualitas terbaik.",
  alternates: {
    canonical: "https://nontoncdrama.com/vip",
  },
};

export const revalidate = 3600;

export default async function VipPage() {
  const vipDramas = await dramaApi.getVip();

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-20">
      {/* Premium Hero Header */}
      <div className="relative mb-12 px-4 md:px-12">
        <div className="bg-linear-to-r from-amber-900/40 to-black rounded-3xl p-8 md:p-12 border border-amber-500/20 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Crown size={400} className="text-amber-500 transform rotate-12" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-amber-500 text-black text-xs font-black px-2 py-1 rounded uppercase tracking-wider">
                Elite Access
              </span>
              <span className="text-amber-500/80 text-sm font-medium tracking-wide flex items-center gap-1">
                <Crown size={14} /> VIP Collection
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Exclusive{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-200">
                VIP
              </span>{" "}
              Dramas
            </h1>

            <p className="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
              Unlock a world of premium entertainment. Dive into our curated
              collection of top-tier dramas, available exclusively for our VIP
              members.
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-4 md:px-12">
        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
            All VIP Titles
          </h2>
          <span className="text-gray-400 text-sm">
            {vipDramas.length} Titles Available
          </span>
        </div>

        {vipDramas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 lg:gap-x-6 lg:gap-y-10">
            {vipDramas.map((drama) => (
              <div key={drama.bookId}>
                <DramaCard drama={drama} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Crown size={48} className="mb-4 opacity-20" />
            <p>No VIP dramas available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
