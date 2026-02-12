import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.113.180:8888",
        changeOrigin: true,
        // Rewrite cookie domain so Set-Cookie from the backend works when
        // proxied through the dev server. This removes any Domain attribute
        // so the browser will accept the cookie for the dev server origin.
        // An empty string rewrites the domain to the proxy host.
        cookieDomainRewrite: "",
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
