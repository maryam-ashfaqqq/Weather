import { glass } from "../ui";
import WeatherIcon from "./WeatherIcon";

function HourlyForecast({ hours }) {
  if (!hours?.length) return null;

  return (
    <section className={`${glass} animate-rise rise-delay-1 p-4 sm:p-5`}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-[0.16em] text-white/75">
          HOURLY FORECAST
        </h2>
        <p className="text-xs text-white/60">Every 3 hours</p>
      </div>

      <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-1">
        {hours.map((hour, index) => (
          <article
            key={`${hour.time}-${index}`}
            className="min-w-23 rounded-2xl bg-white/10 px-3 py-3 text-center"
          >
            <p className="text-xs text-white/70">{hour.time}</p>
            <WeatherIcon code={hour.icon} className="mx-auto my-1 h-8 w-8" />
            <p className="text-lg font-semibold">{hour.temp}°</p>
            <p className="sr-only">{hour.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HourlyForecast;
