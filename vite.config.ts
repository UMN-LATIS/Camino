import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import laravel from "laravel-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      laravel({
        input: {
          homeStyles: "resources/sass/app.scss",
          home: "resources/js/app.ts",
          trekker: "resources/camino-trekker/app.ts",
          creator: "resources/camino-creator/app.ts",
        },
        refresh: true,
      }),
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith("a-"),
            whitespace: "preserve",
          },
          transformAssetUrls: {
            // The Vue plugin will re-write asset URLs, when referenced
            // in Single File Components, to point to the Laravel web
            // server. Setting this to `null` allows the Laravel plugin
            // to instead re-write asset URLs to point to the Vite
            // server instead.
            base: null,

            // The Vue plugin will parse absolute URLs and treat them
            // as absolute paths to files on disk. Setting this to
            // `false` will leave absolute URLs un-touched so they can
            // reference assets in the public directory as expected.
            includeAbsolute: false,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./resources", import.meta.url)),
        "@trekker": fileURLToPath(
          new URL("./resources/camino-trekker", import.meta.url)
        ),
        "@creator": fileURLToPath(
          new URL("./resources/camino-creator", import.meta.url)
        ),

        // needed for home and tour pages
        vue: "vue/dist/vue.esm-bundler.js",
      },
    },

    server: {
      host: env.VITE_APP_URL ? new URL(env.VITE_APP_URL).host : "127.0.0.1",
      https: {
        cert: "./.cert/cert.pem",
        key: "./.cert/key.pem",
      },
    },
  };
});
