// Live weather and city suggestions.
// The browser calls these routes. OpenWeather is called from openweather.js.

import { Router } from "express";
import { cleanCity, cleanCoordinates } from "../cleanCity.js";
import { getWeather, searchCities } from "../openweather.js";

const router = Router();

router.get("/suggest", async (req, res) => {
  try {
    const query = cleanCity(req.query.q);

    // Wait for at least 2 letters so we don't search on every keystroke noise.
    if (query.length < 2) {
      res.json({ suggestions: [] });
      return;
    }

    const suggestions = await searchCities(query);
    res.json({ suggestions });
  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Could not search cities.",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const city = cleanCity(req.query.city);
    const coords = cleanCoordinates(req.query.lat, req.query.lon);

    if (!city && !coords) {
      res.status(400).json({ message: "Please enter a city name" });
      return;
    }

    const weather = await getWeather({
      city,
      lat: coords?.lat,
      lon: coords?.lon,
    });
    res.json(weather);
  } catch (error) {
    const message = error.message
      ? error.message.charAt(0).toUpperCase() + error.message.slice(1)
      : "Something went wrong!";

    res.status(error.status || 500).json({ message });
  }
});

export default router;
