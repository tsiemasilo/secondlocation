import { defineConfig } from "vite";
import dyadComponentTagger from "@dyad-sh/react-vite-component-tagger";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(() => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true as const,
  },
  plugins: [dyadComponentTagger(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
    'import.meta.env.VITE_NETLIFY_DATABASE_URL': JSON.stringify(process.env.NETLIFY_DATABASE_URL),
    'import.meta.env.VITE_TICKETMASTER_API_KEY': JSON.stringify(process.env.VITE_TICKETMASTER_API_KEY),
    'import.meta.env.VITE_FOURSQUARE_API_KEY': JSON.stringify(process.env.VITE_FOURSQUARE_API_KEY),
    'import.meta.env.VITE_YELP_API_KEY': JSON.stringify(process.env.VITE_YELP_API_KEY),
  },
}));
