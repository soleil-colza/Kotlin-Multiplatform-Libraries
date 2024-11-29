const { FlatCompat } = require("@eslint/eslintrc");
const { fixupConfigRules } = require("@eslint/compat");
const tailwindcss = require("eslint-plugin-tailwindcss");
const prettier = require("eslint-config-prettier");

const flatCompat = new FlatCompat();

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = [
  ...fixupConfigRules(
    flatCompat.extends("next/core-web-vitals"),
    flatCompat.extends("next/typescript"),
  ),
  ...tailwindcss.configs["flat/recommended"],
  {
    rules: {
      "tailwindcss/classnames-order": "error",
      "tailwindcss/enforces-negative-arbitrary-values": "error",
      "tailwindcss/enforces-shorthand": "error",
      "tailwindcss/migration-from-tailwind-2": "error",
      "tailwindcss/no-custom-classname": "error",
      "tailwindcss/no-unnecessary-arbitrary-value": "error",
    },
    settings: {
      tailwindcss: {
        callees: ["clsx", "cn", "cva"],
      },
    },
  },
  prettier,
];
