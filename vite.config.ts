import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    // Keep browser requests same-origin while the local API runs as a separate process.
    proxy: { "/api": "http://localhost:3001" },
  },
});
