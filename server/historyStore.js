// Saves the last 5 cities in a JSON file on this computer.
// This is the small local database for search history.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const historyFile = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "data",
  "history.json"
);

function asEntry(value) {
  // Older saves were plain city names. New saves can also remember coordinates.
  if (typeof value === "string") {
    const label = value.trim();
    return label ? { label } : null;
  }

  if (!value || typeof value.label !== "string") return null;

  const label = value.label.trim();
  if (!label) return null;

  const entry = { label };
  const lat = Number(value.lat);
  const lon = Number(value.lon);

  if (Number.isFinite(lat) && Number.isFinite(lon)) {
    entry.lat = lat;
    entry.lon = lon;
  }

  return entry;
}

export async function readHistory() {
  try {
    const raw = await fs.readFile(historyFile, "utf8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) return [];

    return data.map(asEntry).filter(Boolean).slice(0, 5);
  } catch {
    return [];
  }
}

export async function addCity(value) {
  const entry = asEntry(value);
  const current = await readHistory();

  // Put the newest city first, and don't keep duplicates.
  const history = [
    entry,
    ...current.filter((item) => item.label.toLowerCase() !== entry.label.toLowerCase()),
  ].slice(0, 5);

  await fs.mkdir(path.dirname(historyFile), { recursive: true });
  await fs.writeFile(historyFile, JSON.stringify(history, null, 2));

  return history;
}
