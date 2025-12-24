export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="flex flex-col items-center animate-pulse">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold tracking-widest uppercase">
          Loading NontonCDrama...
        </h2>
      </div>
    </div>
  );
}
