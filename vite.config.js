import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    laravel(["resources/js/app.ts"]),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": "/resources",
      "@trekker": "/resources/camino-trekker",
      "@creator": "/resources/camino-creator",
    },
  },
});
