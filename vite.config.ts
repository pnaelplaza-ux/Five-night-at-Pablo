import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Cette ligne répare TOUS les imports avec "@" d'un coup
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  // On définit la racine sur le dossier client
  root: "client",
  build: {
    // Dossier de sortie pour Netlify
    outDir: "../dist",
    emptyOutDir: true,
  },
});
