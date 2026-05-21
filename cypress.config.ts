import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  chromeWebSecurity: false,
  defaultCommandTimeout: 15000,
  watchForFileChanges: true,
  // retries: 2,
  videosFolder: "tests/cypress/videos",
  screenshotsFolder: "tests/cypress/screenshots",
  fixturesFolder: "tests/cypress/fixture",
  video: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: "https://localhost",
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/index.ts",
    experimentalRunAllSpecs: true,
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome" && browser.isHeadless) {
          // Mapbox GL requires WebGL; force software rendering in headless Chrome
          // (Chrome 136+ in --headless=new mode may not GPU-accelerate by default)
          launchOptions.args.push("--use-angle=swiftshader");
        }
        return launchOptions;
      });
    },
  },
});
