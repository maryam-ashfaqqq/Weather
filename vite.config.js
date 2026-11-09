import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

// The site calls /api. Vite forwards that to the Express server,
// so the page and the API can run together on one dev command.
dotenv.config({ quiet: true });

const apiPort = Number(process.env.PORT) || 5000;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
});
