import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-9xl font-extrabold text-primary opacity-20 select-none">
          404
        </h1>
        <div className="-mt-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            Oops! The drama you are looking for seems to have disappeared into
            the void. It might have been removed or the link is incorrect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center px-6 py-3 bg-primary hover:bg-red-700 text-white font-bold rounded transition-colors w-full sm:w-auto justify-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
            <Link
              href="/search"
              className="flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded backdrop-blur-md transition-colors w-full sm:w-auto justify-center"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Drama
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
