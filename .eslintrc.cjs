/* eslint-env node */
module.exports = {
  root: true,
  ignorePatterns: ["dist", "coverage", "node_modules"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: { node: true, es2022: true },
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }]
  }
};
