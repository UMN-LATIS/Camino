import { readFileSync } from "fs";
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    laravel([
      "resources/js/app.ts",
      "resources/camino-creator/creator-app.ts",
      "resources/camino-trekker/trekker-app.ts",
    ]),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
        compilerOptions: {
          isCustomElement: (tag) =>
            ["a-text", "a-scene", "a-camera"].includes(tag),
          whitespace: "preserve",
        },
      },
    }),
  ],
  resolve: {
    alias: {
      // use a vue dist that supports in-template compilation
      // e.g. including vue components in HTML within blade files
      vue: "vue/dist/vue.esm-bundler.js",
      "@": "/resources",
      "@trekker": "/resources/camino-trekker",
      "@creator": "/resources/camino-creator",
    },
  },
  server: {
    https: {
      key: readFileSync("./.cert/key.pem"),
      cert: readFileSync("./.cert/cert.pem"),
    },
  },
});
