function History({ history, onSelect, activeLabel }) {
  return (
    <section className="min-h-8">
      <h2 className="sr-only">Recent searches</h2>

      {history.length === 0 ? (
        <p className="text-sm text-white/65">Your last five searches will show up here.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {history.map((item) => {
            const active = activeLabel?.toLowerCase() === item.label?.toLowerCase();

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onSelect(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-white bg-white text-slate-900"
                    : "border-white/25 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default History;
