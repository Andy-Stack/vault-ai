// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import obsidianmd from "eslint-plugin-obsidianmd";
import sdl from "@microsoft/eslint-plugin-sdl";
import importPlugin from "eslint-plugin-import";

export default [
  // Ignore patterns
  {
    ignores: ["node_modules/**", "main.js"]
  },

  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript configuration for .ts files
  {
    files: ["**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "obsidianmd": obsidianmd,
      "@microsoft/sdl": sdl,
      "import": importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        sourceType: "module"
      }
    },
    rules: {
      // Base rules
      "no-unused-vars": "off",
      "no-prototype-builtins": "off",
      "no-self-compare": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "prefer-const": "off",
      "no-implicit-globals": "error",
      "no-console": ["error", { allow: ["warn", "error", "debug"] }],

      // Restricted globals (with fetch removed for streaming)
      "no-restricted-globals": [
        "error",
        {
          name: "app",
          message: "Avoid using the global app object. Instead use the reference provided by your plugin instance.",
        },
        {
          name: "localStorage",
          message: "Prefer `App#saveLocalStorage` / `App#loadLocalStorage` functions to write / read localStorage data that's unique to a vault."
        }
      ],

      // Restricted imports
      "no-restricted-imports": [
        "error",
        {
          name: "axios",
          message: "Use the built-in `requestUrl` function instead of `axios`.",
        },
        {
          name: "superagent",
          message: "Use the built-in `requestUrl` function instead of `superagent`.",
        },
        {
          name: "got",
          message: "Use the built-in `requestUrl` function instead of `got`.",
        },
        {
          name: "node-fetch",
          message: "Use the built-in `requestUrl` function instead of `node-fetch`.",
        },
        {
          name: "moment",
          message: "The 'moment' package is bundled with Obsidian. Please import it from 'obsidian' instead.",
        },
      ],

      "no-alert": "error",
      "no-undef": "error",

      // TypeScript rules
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-deprecated": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-explicit-any": ["error", { fixToUnknown: true }],
      "@typescript-eslint/no-empty-function": "off",

      // Security rules
      "@microsoft/sdl/no-document-write": "error",
      "@microsoft/sdl/no-inner-html": "error",

      // Import rules
      "import/no-nodejs-modules": "error",
      "import/no-extraneous-dependencies": "error",

      // Obsidian plugin rules - Commands
      "obsidianmd/commands/no-command-in-command-id": "error",
      "obsidianmd/commands/no-command-in-command-name": "error",
      "obsidianmd/commands/no-default-hotkeys": "error",
      "obsidianmd/commands/no-plugin-id-in-command-id": "error",
      "obsidianmd/commands/no-plugin-name-in-command-name": "error",

      // Obsidian plugin rules - Settings Tab
      "obsidianmd/settings-tab/no-manual-html-headings": "error",
      "obsidianmd/settings-tab/no-problematic-settings-headings": "error",

      // Obsidian plugin rules - Vault
      "obsidianmd/vault/iterate": "error",

      // Obsidian plugin rules - General
      "obsidianmd/detach-leaves": "error",
      "obsidianmd/hardcoded-config-path": "error",
      "obsidianmd/no-forbidden-elements": "error",
      "obsidianmd/no-plugin-as-component": "error",
      "obsidianmd/no-sample-code": "error",
      "obsidianmd/no-tfile-tfolder-cast": "error",
      "obsidianmd/no-view-references-in-plugin": "error",
      "obsidianmd/no-static-styles-assignment": "error",
      "obsidianmd/object-assign": "error",
      "obsidianmd/platform": "error",
      "obsidianmd/prefer-file-manager-trash-file": "warn",
      "obsidianmd/prefer-abstract-input-suggest": "error",
      "obsidianmd/regex-lookbehind": "error",
      "obsidianmd/sample-names": "error",
      "obsidianmd/validate-manifest": "error",
      "obsidianmd/validate-license": "error",

      // Obsidian plugin rules - UI
      "obsidianmd/ui/sentence-case": ["error", { enforceCamelCaseLower: true }],
    }
  }
];