/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/eslint-config-typescript/recommended",
    "plugin:cypress/recommended",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "vue/multi-word-component-names": "off",
    // prevents vars used in `<script setup>` from being reported as unused
    // can be removed once https://github.com/vuejs/eslint-config-typescript/pull/42 is merged into eslint-config-typescript
    "vue/script-setup-uses-vars": "error",
    "vue/attribute-hyphenation": ["error", "never"],
    "vue/v-on-event-hyphenation": ["error", "never"],
    "vue/component-definition-name-casing": "off",
    "vue/component-name-in-template-casing": [
      "warn",
      "PascalCase",
      {
        registeredComponentsOnly: false,
        ignores: [
          "component",
          "client-only",
          "keep-alive",
          "router-link",
          "router-view",
          "teleport",
          "a-scene",
          "a-text",
          "a-camera",
        ],
      },
    ],
  },
  ignorePatterns: ["**/vendor/**/*.js", "**/public/**/*.js"],
  globals: {
    axios: true,
    Echo: true,
    L: true, // leaflet
  },
  overrides: [
    // cypress should only be linted in cypress/
    // {
    //   files: ["**/cypress/**/*.js"],
    //   extends: ["plugin:cypress/recommended"],
    // },
    // this keeps jest from linting cypress files
    // {
    //   files: ["**/resources/assets/js/**/*.js"],
    //   extends: ["plugin:jest/recommended", "plugin:jest/style"],
    // },
  ],
};
