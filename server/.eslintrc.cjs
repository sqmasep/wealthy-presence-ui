module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: ["eskiu/ts"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [],
  rules: {
    "no-duplicate-imports": "off",
    "@typescript-eslint/promise-function-async": "off",
    "arrow-body-style": "off",
  },
};
