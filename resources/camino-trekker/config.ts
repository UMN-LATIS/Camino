// vite uses import.meta.env for env variables
// and must be prefixed with VITE to be included in client side app build
// types for import.meta.env are set in `resources/env.d.ts`
// see: https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript

const config = {
  appUrl: import.meta.env.VITE_APP_URL,
  imageStorageBase: `${import.meta.env.VITE_APP_URL}/storage`,
  baseDir: import.meta.env.VITE_TREKKER_BASE_DIR,
  mapBox: {
    accessToken:
      import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ??
      "PLEASE_SET_MAPBOX_ACCESS_TOKEN",
  },
};

export default config;
