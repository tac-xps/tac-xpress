export default {
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{js,jsx,mjs,cjs}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,mdx,html,css}": [
    "prettier --write"
  ]
};
