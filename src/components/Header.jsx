function Header() {
  return (
    <header className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.22em] text-white/70">
          LIVE FORECAST
        </p>
        <h1 className="font-display text-4xl leading-none sm:text-5xl">Weather App</h1>
      </div>

      <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/85">
        <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.9)]" />
        Live
      </p>
    </header>
  );
}

export default Header;
