"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center max-w-lg bg-gray-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
        <div className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-6">
          <AlertCircle className="h-12 w-12 text-primary" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Something went wrong!
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          We encountered an error while loading this page. Please try refreshing
          or checking your internet connection.
        </p>

        <button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          className="flex items-center mx-auto px-8 py-3 bg-white hover:bg-gray-200 text-black font-bold rounded transition-colors"
        >
          <RefreshCw className="mr-2 h-5 w-5" />
          Try Again
        </button>
      </div>
    </div>
  );
}
