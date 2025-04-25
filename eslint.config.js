import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  {
    ignores: [
      "**/*.d.ts",
      "**/coverage",
      "**/dist",
      "**/vendor/**/*.[jt]s",
      "**/public/**/*.[jt]s",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // ...globals.jest,
        axios: true,
        Echo: true,
        L: true, // leaflet
      },
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "vue/multi-word-component-names": "off",
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
  },
  eslintConfigPrettier
);
