const fs = require("fs");
const mix = require("laravel-mix");

mix
  .js("resources/camino-creator/main.js", "public/camino-creator/main.js")
  .sass("resources/camino-creator/main.scss", "public/camino-creator/main.css")
  .vue()
  .sourceMaps();

if (mix.inProduction()) {
  mix.version();
}

if (!mix.inProduction()) {
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
