import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import svgLoader from "vite-svg-loader"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgLoader()],
  server: {
    open: true,
    port: 5900,
  },
  build: {
    outDir: "build",
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  optimizeDeps: {
    exclude: [],
  },
})
