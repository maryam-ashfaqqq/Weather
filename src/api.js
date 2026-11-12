// Every weather request goes to our Express server.
// The browser does not call OpenWeather and does not know the API key.

// Vercel se Render tak ka rasta
const API_BASE = import.meta.env.VITE_API_URL;

async function readJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

export async function fetchWeather(city, coords) {
  const params = new URLSearchParams();

  // Coordinates mean "this exact suggestion". Otherwise search the typed name.
  if (coords) {
    params.set("lat", String(coords.lat));
    params.set("lon", String(coords.lon));
  } else {
    params.set("city", city);
  }

  const response = await fetch(`${API_BASE}/api/weather?${params}`);
  return readJson(response);
}

export async function fetchHistory() {
  const response = await fetch(`${API_BASE}/api/history`);
  const data = await readJson(response);
  return data.history || [];
}

export async function saveHistory(city, coords) {
  const response = await fetch(`${API_BASE}/api/history`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      city,
      lat: coords?.lat,
      lon: coords?.lon,
    }),
  });
  const data = await readJson(response);
  return data.history || [];
}

export async function fetchSuggestions(query, signal) {
  const response = await fetch(
    `${API_BASE}/api/weather/suggest?q=${encodeURIComponent(query)}`,
    { signal }
  );
  const data = await readJson(response);
  return data.suggestions || [];
}