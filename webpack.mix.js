const fs = require('fs');
const mix = require('laravel-mix');

/*
|--------------------------------------------------------------------------
| Mix Asset Management
|--------------------------------------------------------------------------
|
| Mix provides a clean, fluent API for defining some Webpack build steps
| for your Laravel application. By default, we are compiling the Sass
| file for the application as well as bundling up all the JS files.
|
*/

mix.options({
   hmrOptions: {
       https: true,
       host: 'localhost',
       port: '8001'
   }
})
.webpackConfig({
   resolve: {
      symlinks: false
   },
   devServer: {
      https: {
         key: fs.readFileSync('./.cert/key.pem'),
         cert: fs.readFileSync('./.cert/cert.pem'),
       },
    },
});

mix.js('resources/js/app.js', 'public/js').vue().sass('resources/sass/app.scss', 'public/css');


if (mix.inProduction()) {
   mix.version();
}

mix.js('resources/js/edit.js', 'public/js').vue().sass('resources/sass/edit.scss', 'public/css');


if (mix.inProduction()) {
   mix.version();
}