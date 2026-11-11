export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
      <p className="text-sm text-white/70">loading weather...</p>
    </div>
  );
}