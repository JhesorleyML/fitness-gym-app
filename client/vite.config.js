import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    //vite proxy to avoid changing dev and production
    port: 5173,
    host: true, // allow external access (required for port forwarding)
    proxy: {
      "/api": {
        target: "http://localhost:3005", // your Node backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
