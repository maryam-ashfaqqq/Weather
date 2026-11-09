import {
  LuCloud,
  LuCloudDrizzle,
  LuCloudFog,
  LuCloudLightning,
  LuCloudMoon,
  LuCloudRain,
  LuCloudSnow,
  LuCloudSun,
  LuMoon,
  LuSun,
} from "react-icons/lu";

// OpenWeather icon codes, drawn with our own icons so the page
// does not need to load images from the weather service.
const ICONS = {
  "01d": LuSun,
  "01n": LuMoon,
  "02d": LuCloudSun,
  "02n": LuCloudMoon,
  "03d": LuCloud,
  "03n": LuCloud,
  "04d": LuCloud,
  "04n": LuCloud,
  "09d": LuCloudDrizzle,
  "09n": LuCloudDrizzle,
  "10d": LuCloudRain,
  "10n": LuCloudRain,
  "11d": LuCloudLightning,
  "11n": LuCloudLightning,
  "13d": LuCloudSnow,
  "13n": LuCloudSnow,
  "50d": LuCloudFog,
  "50n": LuCloudFog,
};

export default function WeatherIcon({ code, className = "" }) {
  const Icon = ICONS[code] || LuCloud;
  return <Icon className={className} aria-hidden="true" />;
}
