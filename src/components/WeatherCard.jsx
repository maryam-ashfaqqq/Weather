import {
  LuDroplets,
  LuEye,
  LuGauge,
  LuSunrise,
  LuSunset,
  LuThermometer,
  LuWind,
} from "react-icons/lu";
import { glass } from "../ui";
import WeatherIcon from "./WeatherIcon";

function WeatherCard({ weather }) {
  if (!weather) return null;

  const place = weather.placeLabel
    || (weather.country ? `${weather.city}, ${weather.country}` : weather.city);

  const stats = [
    { label: "Feels like", value: `${weather.feelsLike}°`, icon: LuThermometer },
    { label: "Humidity", value: `${weather.humidity}%`, icon: LuDroplets },
    {
      label: "Wind",
      value: weather.windSpeed == null ? "—" : `${weather.windSpeed} m/s`,
      icon: LuWind,
    },
    {
      label: "Pressure",
      value: weather.pressure == null ? "—" : `${weather.pressure} hPa`,
      icon: LuGauge,
    },
    {
      label: "Visibility",
      value: weather.visibility == null ? "—" : `${weather.visibility} km`,
      icon: LuEye,
    },
    { label: "Sunrise", value: weather.sunrise, icon: LuSunrise },
    { label: "Sunset", value: weather.sunset, icon: LuSunset },
  ];

  return (
    <section className={`${glass} animate-rise p-5 sm:p-7`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-white/75">{place}</p>
          <p className="font-display mt-2 text-6xl leading-none tracking-tight sm:text-8xl">
            {weather.temp}°
          </p>
          <p className="mt-3 text-lg capitalize">{weather.description}</p>
        </div>

        <WeatherIcon
          code={weather.icon}
          className="h-20 w-20 shrink-0 text-white drop-shadow-xl sm:h-36 sm:w-36"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl bg-white/10 px-3 py-3"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15">
                <Icon className="text-lg" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-white/65">{stat.label}</span>
                <span className="block truncate text-sm font-semibold">{stat.value}</span>
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WeatherCard;
