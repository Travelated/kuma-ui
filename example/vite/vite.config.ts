import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import kumaUI from "@travelated-kuma-ui/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), kumaUI()],
});
