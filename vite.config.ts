import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    // Listen on all IPv4 interfaces so `localhost` and `127.0.0.1` work reliably
    host: "0.0.0.0",
    // Use the standard Vite dev port so it's easy to remember
    port: 5173,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
