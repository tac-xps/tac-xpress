import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "node:url"
import { playwright } from "@vitest/browser-playwright"
const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    exclude: ["**/.agents/**", "node_modules/**", "tests/**/*.spec.ts"],
    projects: [
      {
        extends: true,
        test: {
          environment: "jsdom",
          globals: true,
        },
      },
    ],
  },
})
