// Pick a background from the live condition.
// Night is used for clear or cloudy skies after sunset.
// Rain keeps the rainy background even at night.

const RAIN = ["Rain", "Drizzle", "Thunderstorm"];
const MIST = ["Mist", "Fog", "Haze", "Smoke", "Dust", "Sand", "Ash", "Squall", "Tornado"];

export function themeFor(weather) {
  if (!weather) return "default";

  const condition = weather.condition || "";

  if (RAIN.includes(condition)) return "rainy";
  if (condition === "Snow") return "snow";
  if (MIST.includes(condition)) return "mist";
  if (weather.isNight) return "night";
  if (condition === "Clear") return "sunny";
  if (condition === "Clouds") return "cloudy";

  return "cloudy";
}

export const themeClass = {
  sunny: "from-[#8a4b16] via-[#c2410c] to-[#0c4a6e]",
  rainy: "from-[#0f172a] via-[#1e3a5f] to-[#0b1220]",
  cloudy: "from-[#334155] via-[#3f5574] to-[#1e3a5f]",
  night: "from-[#070b16] via-[#1e1b4b] to-[#111827]",
  snow: "from-[#334155] via-[#3b6280] to-[#1e293b]",
  mist: "from-[#3f3f46] via-[#44403c] to-[#27272a]",
  default: "from-[#0369a1] via-[#1d4ed8] to-[#312e81]",
};
