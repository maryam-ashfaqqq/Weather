// Weather server.
// Browser -> this server -> OpenWeather.
// The API key is read from .env and is never sent to the frontend.

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import weatherRouter from "./routes/weather.js";
import historyRouter from "./routes/history.js";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

dotenv.config({ path: path.join(rootDir, ".env"), quiet: true });

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "Weather server is running. Open the Vite site to use the app." });
});

app.use("/api/weather", weatherRouter);
app.use("/api/history", historyRouter);

app.use("/api", (req, res) => {
  res.status(404).json({ message: "That weather route does not exist." });
});

// Bad JSON should come back as JSON, not an HTML error page.
app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    res.status(400).json({ message: "The request body must be valid JSON." });
    return;
  }

  next(error);
});

if (!process.env.OPENWEATHER_API_KEY) {
  console.warn("Add OPENWEATHER_API_KEY to the .env file before searching.");
}

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port,"0.0.0.0" , () => {
  console.log(`Weather server is running at http://localhost:${port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Stop the other server and try again.`);
  } else {
    console.error(error.message);
  }

  process.exit(1);
});
