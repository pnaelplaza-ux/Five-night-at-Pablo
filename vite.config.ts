import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // On définit explicitement que @ pointe vers le dossier client/src
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  root: "client",
  build: {
    // On s'assure que le dossier de sortie est bien celui attendu par Netlify
    outDir: "dist",
    emptyOutDir: true,
  },
});
