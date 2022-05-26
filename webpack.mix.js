const fs = require("fs");
const mix = require("laravel-mix");

// Main Laravel App Styles and Scripts (homepage)
mix
  .ts("resources/js/app.ts", "public/js/app.js")
  .sass("resources/sass/app.scss", "public/css/app.css");

// Camino Trekker
mix
  .ts("resources/camino-trekker/app.ts", "public/js/camino-trekker.js")
  .postCss(
    "resources/camino-trekker/main.css",
    "public/css/camino-trekker.css"
  );

// Camino Creator App
mix
  .ts("resources/camino-creator/app.ts", "public/js/camino-creator.js")
  .sass("resources/camino-creator/main.scss", "public/css/camino-creator.css");

mix
  .vue({
    options: {
      compilerOptions: {
        isCustomElement: (tag) =>
          ["a-text", "a-scene", "a-camera"].includes(tag),
      },
    },
  })
  .sourceMaps();

if (mix.inProduction()) {
  mix.version();
} else {
  mix
    .options({
      hmrOptions: {
        https: true,
        host: "localhost",
        port: "8001",
      },
    })
    .webpackConfig({
      devServer: {
        https: {
          key: fs.readFileSync("./.cert/key.pem"),
          cert: fs.readFileSync("./.cert/cert.pem"),
        },
      },
    });
}
