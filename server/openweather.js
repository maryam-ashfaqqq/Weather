// This file is the only place that talks to OpenWeather.
// The API key stays on the server. The browser never sees it.

function apiKey() {
  const key = process.env.OPENWEATHER_API_KEY;

  if (!key) {
    const error = new Error(
      "Add OPENWEATHER_API_KEY to the .env file in the project folder."
    );
    error.status = 500;
    throw error;
  }

  return key;
}

function weatherUrl(pathname, params) {
  const url = new URL(pathname, "https://api.openweathermap.org");

  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, String(value));
  }

  url.searchParams.set("appid", apiKey());
  return url;
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    const data = await response.json().catch(() => null);
    return { response, data };
  } catch {
    const error = new Error("The weather service did not respond. Please try again.");
    error.status = 502;
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function fail(response, data, fallback) {
  const code = Number(data?.cod || response.status);
  const error = new Error(data?.message || fallback);
  error.status = code === 404 ? 404 : code === 401 ? 401 : 502;

  if (error.status === 401) {
    error.message = "The weather service rejected the API key.";
  }

  return error;
}

// Move a UTC timestamp onto the city's clock.
// After this, UTC date methods show the local time in that city.
function atCityTime(unixSeconds, offsetSeconds) {
  return new Date((unixSeconds + offsetSeconds) * 1000);
}

function formatClock(unixSeconds, offsetSeconds, withMinutes) {
  return atCityTime(unixSeconds, offsetSeconds).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: withMinutes ? "2-digit" : undefined,
    timeZone: "UTC",
  });
}

function formatDay(unixSeconds, offsetSeconds) {
  const date = atCityTime(unixSeconds, offsetSeconds);

  return {
    key: date.toISOString().slice(0, 10),
    name: date.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
  };
}

function visibilityKm(meters) {
  if (typeof meters !== "number") return null;

  const km = meters / 1000;
  if (km >= 10) return Math.round(km);
  return Math.round(km * 10) / 10;
}

function buildHourly(list, offsetSeconds) {
  // The free forecast arrives in 3-hour steps. Eight steps cover about 24 hours.
  return list.slice(0, 8).map((item) => {
    const weather = item.weather?.[0] || {};

    return {
      time: formatClock(item.dt, offsetSeconds, false),
      temp: Math.round(item.main.temp),
      icon: weather.icon || "03d",
      description: weather.description || "Forecast",
    };
  });
}

function buildDaily(list, offsetSeconds, todayKey) {
  const groups = new Map();

  for (const item of list) {
    const day = formatDay(item.dt, offsetSeconds);

    if (!groups.has(day.key)) {
      groups.set(day.key, { day, items: [] });
    }

    groups.get(day.key).items.push(item);
  }

  return [...groups.values()].slice(0, 5).map(({ day, items }) => {
    // Pick the reading closest to noon for the day's icon.
    const closest = items.reduce((best, item) => {
      const hour = atCityTime(item.dt, offsetSeconds).getUTCHours();
      const bestHour = atCityTime(best.dt, offsetSeconds).getUTCHours();
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? item : best;
    });

    const weather = closest.weather?.[0] || {};
    let icon = weather.icon || "03d";

    // Daily cards should show the daytime icon, even if noon data is missing.
    if (icon.endsWith("n")) icon = `${icon.slice(0, -1)}d`;

    return {
      day: day.key === todayKey ? "Today" : day.name,
      date: day.date,
      min: Math.round(Math.min(...items.map((item) => item.main.temp_min))),
      max: Math.round(Math.max(...items.map((item) => item.main.temp_max))),
      icon,
      description: weather.description || "Forecast",
    };
  });
}

export async function searchCities(query) {
  const { response, data } = await fetchJson(
    weatherUrl("/geo/1.0/direct", { q: query, limit: 5 })
  );

  if (!response.ok || !Array.isArray(data)) {
    throw fail(response, data, "Could not search cities.");
  }

  const seen = new Set();
  const suggestions = [];

  for (const place of data) {
    const region = [place.state, place.country].filter(Boolean).join(", ");
    const label = region ? `${place.name}, ${region}` : place.name;
    const key = label.toLowerCase();

    if (seen.has(key)) continue;
    seen.add(key);

    suggestions.push({
      name: place.name,
      label,
      // OpenWeather understands "City,CountryCode".
      query: place.country ? `${place.name},${place.country}` : place.name,
      lat: place.lat,
      lon: place.lon,
    });
  }

  const typed = query.toLowerCase();

  // Cities that start with what the user typed should appear first.
  suggestions.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(typed) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(typed) ? 0 : 1;
    return aStarts - bStarts;
  });

  return suggestions;
}

export async function getWeather(location) {
  // Coordinates pick the exact suggested place.
  // A typed city name still uses the city search.
  const params = location.lat == null
    ? { q: location.city, units: "metric" }
    : { lat: location.lat, lon: location.lon, units: "metric" };

  const currentUrl = weatherUrl("/data/2.5/weather", params);
  const forecastUrl = weatherUrl("/data/2.5/forecast", params);

  const [currentResult, forecastResult] = await Promise.all([
    fetchJson(currentUrl),
    fetchJson(forecastUrl),
  ]);

  const current = currentResult.data;

  if (!currentResult.response.ok || Number(current?.cod) !== 200) {
    throw fail(currentResult.response, current, "Could not load weather.");
  }

  const forecastOk =
    forecastResult.response.ok && Number(forecastResult.data?.cod) === 200;
  const forecastList = forecastOk ? forecastResult.data.list || [] : [];

  const details = current.weather?.[0] || {};
  const offset = current.timezone || 0;
  const sunrise = current.sys?.sunrise;
  const sunset = current.sys?.sunset;
  const isNight =
    typeof sunrise === "number" && typeof sunset === "number"
      ? current.dt < sunrise || current.dt > sunset
      : String(details.icon || "").endsWith("n");

  return {
    city: current.name,
    country: current.sys?.country || "",
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    windSpeed:
      typeof current.wind?.speed === "number"
        ? Math.round(current.wind.speed * 10) / 10
        : null,
    pressure: current.main.pressure ?? null,
    visibility: visibilityKm(current.visibility),
    description: details.description || "Unknown",
    condition: details.main || "Clouds",
    icon: details.icon || "03d",
    isNight,
    sunrise: typeof sunrise === "number" ? formatClock(sunrise, offset, true) : "—",
    sunset: typeof sunset === "number" ? formatClock(sunset, offset, true) : "—",
    hourly: buildHourly(forecastList, offset),
    daily: buildDaily(forecastList, offset, formatDay(current.dt, offset).key),
  };
}
