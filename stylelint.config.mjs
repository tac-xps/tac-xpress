/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'layer',
          'theme',
          'source',
          'plugin',
          'utility',
          'custom-variant'
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'oklch', 'color-mix'],
      },
    ],
    'no-descending-specificity': null,
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    // @utility is a valid Tailwind v4 scoping root — stylelint doesn't know it
    'nesting-selector-no-missing-scoping-root': null,
    // We intentionally use numeric oklch notation (0.91 not 91%) — both are valid CSS
    'lightness-notation': null,
    'hue-degree-notation': null,
    'alpha-value-notation': null,
    // Font family names like "DM Sans" and "IBM Plex Mono" are proper nouns
    'value-keyword-case': null,
  },
}
