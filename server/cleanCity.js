// Turn whatever the user typed into a safe city string.

export function cleanCity(value) {
  if (typeof value !== "string") return "";

  const city = value.trim().replace(/\s+/g, " ");

  if (!city || city.length > 80) return "";

  // Block hidden control characters. Normal city names still pass.
  for (let index = 0; index < city.length; index += 1) {
    if (city.charCodeAt(index) < 32) return "";
  }

  return city;
}

// Keep latitude and longitude only when both are real coordinates.
export function cleanCoordinates(latValue, lonValue) {
  const lat = Number(latValue);
  const lon = Number(lonValue);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;

  return { lat, lon };
}
