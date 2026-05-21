import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "**/resources/**/__tests__/**/*.?(m)[jt]s?(x)",
      "**/resources/**/?(*.)+(spec|test).?(m)[tj]s?(x)",
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./resources", import.meta.url)),
      "@trekker": fileURLToPath(
        new URL("./resources/camino-trekker", import.meta.url),
      ),
      "@creator": fileURLToPath(
        new URL("./resources/camino-creator", import.meta.url),
      ),
    },
  },
});
