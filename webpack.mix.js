const fs = require("fs");
const mix = require("laravel-mix");

// Main Laravel App Styles and Scripts (homepage)
mix
  .js("resources/js/app.js", "public/js/app.js")
  .sass("resources/sass/app.scss", "public/css/app.css");

// Camino Creator App
mix
  .js("resources/camino-creator/main.js", "public/camino-creator/main.js")
  .sass("resources/camino-creator/main.scss", "public/camino-creator/main.css")
  .vue()
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
