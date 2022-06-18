/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testMatch: [
    "**/resources/**/__tests__/**/*.?(m)[jt]s?(x)",
    "**/resources/**/?(*.)+(spec|test).?(m)[tj]s?(x)",
  ],
};
