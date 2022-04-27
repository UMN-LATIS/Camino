// vite uses import.meta.env for env variables
// must be prefixed with MIX to be included in client side app build
// const env = import.meta.env;

export default {
  appUrl: process.env.MIX_APP_URL,
  imageStorageBase: `${process.env.MIX_APP_URL}/storage`,
  baseDir: process.env.MIX_TREKKER_BASE_DIR,
  mapBox: {
    accessToken: process.env.MIX_MAPBOX_ACCESS_TOKEN,
  },
};
