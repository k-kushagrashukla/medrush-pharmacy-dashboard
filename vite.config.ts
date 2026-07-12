import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Electron loads the built app via file://, so base must be relative ("./"),
// otherwise asset paths break when the app is packaged.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
