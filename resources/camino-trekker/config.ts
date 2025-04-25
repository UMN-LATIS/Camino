// vite uses import.meta.env for env variables
// must be prefixed with MIX to be included in client side app build
const env = import.meta.env;

interface TrekkerConfig {
  appUrl: string;
  imageStorageBase: string;
  baseDir: string;
  mapBox: {
    accessToken: string;
  };
}

const config: TrekkerConfig = {
  appUrl: env.VITE_APP_URL,
  imageStorageBase: `${env.VITE_APP_URL}/storage`,
  baseDir: env.VITE_TREKKER_BASE_DIR,
  mapBox: {
    accessToken:
      env.VITE_MAPBOX_ACCESS_TOKEN ?? "PLEASE_SET_MAPBOX_ACCESS_TOKEN",
  },
};

export default config;
