module.exports = {
  env: {
    browser: true,
    node: true,
    "vue/setup-compiler-macros": true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["vue"],
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/component-name-in-template-casing": [
      "error",
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
