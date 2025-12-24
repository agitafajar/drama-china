"use client";

import { dramaApi } from "@/lib/api";
import { useRandomDrama } from "@/hooks/useDrama";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RandomPage() {
  const router = useRouter();
  const { data: dramas, isError } = useRandomDrama();

  useEffect(() => {
    if (dramas && dramas.length > 0) {
      const random = dramas[Math.floor(Math.random() * dramas.length)];
      router.replace(
        `/drama/${random.bookId}?title=${encodeURIComponent(random.bookName)}`
      );
    } else if (isError) {
      router.replace("/");
    }
  }, [dramas, isError, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p>Picking a drama for you...</p>
      </div>
    </div>
  );
}
