/** @type {import("prettier").Config} */
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  arrowParens: "avoid",

  plugins: ["prettier-plugin-tailwindcss"],
};
