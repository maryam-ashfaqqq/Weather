// Read and save the last 5 searched cities.

import { Router } from "express";
import { cleanCity, cleanCoordinates } from "../cleanCity.js";
import { addCity, readHistory } from "../historyStore.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const history = await readHistory();
    res.json({ history });
  } catch {
    res.status(500).json({ message: "Could not load search history." });
  }
});

router.post("/", async (req, res) => {
  try {
    const city = cleanCity(req.body?.city);
    const coords = cleanCoordinates(req.body?.lat, req.body?.lon);

    if (!city) {
      res.status(400).json({ message: "Please enter a city name" });
      return;
    }

    const history = await addCity({
      label: city,
      lat: coords?.lat,
      lon: coords?.lon,
    });
    res.json({ history });
  } catch {
    res.status(500).json({ message: "Could not save that city." });
  }
});

export default router;
