import { useEffect, useRef, useState } from "react";
import { LuMapPin, LuSearch } from "react-icons/lu";
import { fetchSuggestions } from "../api";

function SearchBar({ city, setCity, onSearch, loading }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [hint, setHint] = useState("");
  const [looking, setLooking] = useState(false);
  const wrapRef = useRef(null);
  // Skip suggestions when the city was set by code, not by typing.
  const typed = useRef(false);

  useEffect(() => {
    if (!typed.current) return undefined;

    const query = city.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setHint("");
      setOpen(false);
      setLooking(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLooking(true);
      setOpen(true);

      try {
        const next = await fetchSuggestions(query, controller.signal);
        setSuggestions(next);
        setHint(next.length ? "" : "No matching cities");
        setOpen(true);
        setActive(-1);
      } catch (error) {
        if (error.name === "AbortError") return;
        setSuggestions([]);
        setHint("Suggestions are unavailable. You can still search.");
        setOpen(true);
      } finally {
        if (!controller.signal.aborted) setLooking(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [city]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!wrapRef.current?.contains(event.target)) setOpen(false);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function choose(item) {
    typed.current = false;
    setOpen(false);
    setSuggestions([]);
    setCity(item.name);
    onSearch(item.label, { lat: item.lat, lon: item.lon });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (open && active >= 0 && suggestions[active]) {
      choose(suggestions[active]);
      return;
    }

    typed.current = false;
    setOpen(false);
    onSearch(city);
  }

  function onKeyDown(event) {
    if (!open || suggestions.length === 0) {
      if (event.key === "Escape") setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index <= 0 ? suggestions.length - 1 : index - 1));
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault();
      choose(suggestions[active]);
    }
  }

  const showMenu = open && (looking || hint || suggestions.length > 0);

  return (
    <div ref={wrapRef} className="relative z-30">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label className="sr-only" htmlFor="city-search">
          Search city
        </label>

        <input
          id="city-search"
          type="text"
          role="combobox"
          value={city}
          autoComplete="off"
          autoCapitalize="words"
          enterKeyHint="search"
          spellCheck={false}
          placeholder="Search for a city"
          aria-expanded={showMenu}
          aria-controls="city-suggestions"
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `suggestion-${active}` : undefined}
          onChange={(event) => {
            typed.current = true;
            setCity(event.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="h-12 min-w-0 flex-1 rounded-2xl border border-white/25 bg-white/15 px-4 text-base text-white outline-none backdrop-blur-xl placeholder:text-white/55 focus:border-white/60 focus:bg-white/20"
        />

        <button
          type="submit"
          aria-label="Search"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-slate-900 transition hover:scale-[1.03] active:scale-95"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
          ) : (
            <LuSearch className="text-lg" />
          )}
        </button>
      </form>

      {showMenu && (
        <ul
          id="city-suggestions"
          role="listbox"
          className="absolute mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-white/20 bg-slate-950/85 p-1.5 shadow-2xl backdrop-blur-xl"
        >
          {looking && suggestions.length === 0 && (
            <li className="px-3 py-3 text-sm text-white/70">Looking up cities...</li>
          )}

          {!looking && suggestions.length === 0 && hint && (
            <li className="px-3 py-3 text-sm text-white/70">{hint}</li>
          )}

          {suggestions.map((item, index) => (
            <li key={`${item.lat}-${item.lon}`} role="presentation">
              <button
                id={`suggestion-${index}`}
                type="button"
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onClick={() => choose(item)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${
                  index === active ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                <LuMapPin className="shrink-0 text-white/70" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
