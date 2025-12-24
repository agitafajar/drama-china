import Link from "next/link";
import { Drama } from "@/types/drama";
import { PlayCircle } from "lucide-react";

interface DramaCardProps {
  drama: Drama;
}

export default function DramaCard({ drama }: DramaCardProps) {
  return (
    <Link
      href={`/drama/${drama.bookId}`}
      className="group relative block aspect-2/3 overflow-hidden rounded-md bg-[#1a1a1a] transition-all duration-300 hover:scale-105 hover:z-10 ring-0 hover:ring-2 hover:ring-white/20"
    >
      <img
        src={drama.cover || drama.coverWap}
        alt={drama.bookName}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay - Gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Rank Badge if available - Styled like the reference (Red box with # Number) */}
      {drama.rankVo && (
        <div className="absolute top-0 right-2 w-8 h-8 bg-[#e50914] text-white flex items-center justify-center font-bold text-lg shadow-lg rounded-b-sm">
          #{drama.rankVo.sort}
        </div>
      )}

      {/* Logo/Badge overlay if needed (e.g. DramaBox Exclusive) - Placeholder for now */}
      {/* <div className="absolute top-2 left-2 flex items-center space-x-1">
         <img src="/logo-small.png" className="h-4" /> 
         <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Exclusive</span>
      </div> */}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end h-full">
        <div className="mt-auto transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <div className="mb-1 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              <PlayCircle size={16} fill="currentColor" />
            </div>
          </div>

          <h3 className="text-white font-semibold text-sm md:text-base leading-snug line-clamp-2 mb-1 group-hover:text-white transition-colors">
            {drama.bookName}
          </h3>
          <p className="text-gray-400 text-xs font-medium">
            {drama.chapterCount} Episodes
          </p>
        </div>
      </div>
    </Link>
  );
}
