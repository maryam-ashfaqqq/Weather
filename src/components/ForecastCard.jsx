import { glass } from "../ui";
import WeatherIcon from "./WeatherIcon";

function ForecastCard({ days }) {
  if (!days?.length) return null;

  return (
    <section className={`${glass} animate-rise rise-delay-2 p-4 sm:p-5`}>
      <h2 className="mb-3 text-sm font-semibold tracking-[0.16em] text-white/75">
        5-DAY FORECAST
      </h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {days.map((day) => (
          <article
            key={`${day.day}-${day.date}`}
            className="rounded-2xl bg-white/10 px-3 py-4 text-center"
          >
            <p className="font-semibold">{day.day}</p>
            <p className="text-xs text-white/60">{day.date}</p>
            <WeatherIcon code={day.icon} className="mx-auto my-1 h-10 w-10" />
            <p className="text-xs capitalize text-white/75">{day.description}</p>
            <p className="mt-2 text-sm">
              <span className="font-semibold">{day.max}°</span>
              <span className="text-white/55"> {day.min}°</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ForecastCard;
