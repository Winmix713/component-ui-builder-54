
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: mode === "development" ? {
    host: "0.0.0.0",
    port: 8080,
    origin:
      "https://5e39192a-52a5-49ad-b1c8-068b09a59974-00-pmuy4cj9guxu.riker.replit.dev",
    hmr: {
      protocol: "wss",
      clientPort: 443,
    },
  } : {},
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
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
