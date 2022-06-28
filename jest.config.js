/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  testMatch: [
    "**/resources/**/__tests__/**/*.?(m)[jt]s?(x)",
    "**/resources/**/?(*.)+(spec|test).?(m)[tj]s?(x)",
  ],
  // set these to correspond to the paths in your tsconfig.json
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/resources/$1",
    "@trekker/(.*)": "<rootDir>/resources/camino-trekker/$1",
    "@creator/(.*)": "<rootDir>/resources/camino-creator/$1",
  },
};
