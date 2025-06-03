
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";
import ViteImagemin from "@vheemstra/vite-plugin-imagemin";

export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    ViteImagemin([
      {
        test: /\.(jpe?g|png)$/i,
        plugins: {
          mozjpeg: { quality: 80 },
          pngquant: { quality: [0.65, 0.8] },
        },
      },
      {
        test: /\.gif$/i,
        plugins: {
          gifsicle: { optimizationLevel: 7 },
        },
      },
      {
        test: /\.webp$/i,
        plugins: {
          webp: { quality: 75 },
        },
      },
    ]),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["@radix-ui/react-slot", "@radix-ui/react-toast"],
          editor: ["@monaco-editor/react"],
          query: ["@tanstack/react-query"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
