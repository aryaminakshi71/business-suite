import { defineConfig } from "@tanstack/start/config";
import { vitePlugin } from "@tanstack/start/vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  vite: {
    plugins: [
      react(),
      vitePlugin({
        routesDirectory: "./src/routes",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@suite": path.resolve(__dirname, "../packages"),
      },
    },
  },
});
