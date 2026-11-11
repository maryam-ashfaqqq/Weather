import { useCallback, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader"
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import HourlyForecast from "./components/HourlyForecast";
import ForecastCard from "./components/ForecastCard";
import History from "./components/History";
import { fetchHistory, fetchWeather, saveHistory } from "./api";
import { glass } from "./ui";
import { themeClass, themeFor } from "./weatherTheme";

// The original stylesheet is still in App.css.
// This screen uses Tailwind, so those old rules are not imported.

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("Lahore");
  const requestId = useRef(0);

  const loadWeather = useCallback(async (searchCity, coords) => {
    const query = String(searchCity || "").trim();

    if (!query && !coords) {
      setError("Please enter a city name");
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError("");

    try {
      const data = await fetchWeather(query, coords);
      if (id !== requestId.current) return;

      // A suggestion keeps its full label, such as "London, Kentucky, US".
      const label = coords ? query : data.city || query;

      setWeather({ ...data, placeLabel: coords ? query : "" });
      // setCity(data.city || query);
      setSelected(label);

      try {
        const saved = await saveHistory(label, coords);
        if (id === requestId.current) setHistory(saved);
      } catch {
        // Keep the forecast on screen even if saving the search fails.
      }
    } catch (err) {
      if (id !== requestId.current) return;
      setError(err.message || "Something went wrong!");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load saved cities first, then the default city.
    // Doing it in this order stops an older history response from wiping a new search.
    let ignore = false;

    async function start() {
      try {
        const saved = await fetchHistory();
        if (!ignore) setHistory(saved);
      } catch {
        // The city search still works if the history file cannot be read.
      }

      if (!ignore) loadWeather("Lahore");
    }

    start();

    return () => {
      ignore = true;
    };
  }, [loadWeather]);

  const theme = themeFor(weather);

  return (
    <div
      data-theme={theme}
      className={`relative min-h-screen bg-linear-to-br ${themeClass[theme]} text-white`}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="stars absolute inset-0" />
        <div className="orb absolute -left-16 top-8 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
        <div
          className="orb absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-black/25 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10">
        <Header />

        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={loadWeather}
          loading={loading}
        />

        <History
          history={history}
          activeLabel={selected}
          onSelect={(item) => {
            const coords = item.lat == null ? null : { lat: item.lat, lon: item.lon };
            loadWeather(item.label, coords);
          }}
        />

        {error && (
          <p
            role="alert"
            className="rounded-2xl border border-red-200/30 bg-red-500/25 px-4 py-3 text-center text-sm"
          >
            {error}
          </p>
        )}

        {loading && !weather && (
          <Loader/>
        )}

        {weather && (
          <div key={`${weather.city}-${weather.icon}`} className="grid gap-5">
            <WeatherCard weather={weather} />
            <HourlyForecast hours={weather.hourly} />
            <ForecastCard days={weather.daily} />
          </div>
        )}

        <p className="pb-2 text-center text-xs text-white/50">
          Times follow the city's local clock. Your last five searches are saved on this computer.
        </p>
      </div>
    </div>
  );
}

export default App;
