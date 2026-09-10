// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import nextVitals from "eslint-config-next/core-web-vitals";

export default [...nextVitals, {
  ignores: [
    ".next/**",
    "node_modules/**",
    ".agents/**",
    ".gemini/**",
    ".github/skills/**",
    ".claude/**",
    ".codex/**",
    ".superdesign/**",
    "test-results/**",
    "playwright-report/**",
    "storybook-static/**",
    ".storybook/**",
    "stories/**",
  ],
}, {
  rules: {
    "no-unused-vars": "off",
    "no-console": "warn",
    // Enforce barrel imports — prevents import path drift causing ReferenceErrors
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["*/db/schema/*"],
            message:
              "Use the barrel import '@/lib/db/schema' instead of direct schema file imports to prevent import drift errors.",
          },
        ],
      },
    ],
  },
}, ...storybook.configs["flat/recommended"]];
