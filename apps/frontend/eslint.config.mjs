export default {
  env: {
    browser: true,
    ES2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:@typescript-eslint/recommended", // ADD THIS
  ],
  parser: "@typescript-eslint/parser", // ADD THIS
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "jsx-a11y", "@typescript-eslint"], // ADD '@typescript-eslint'
  rules: {
    "react/prop-types": "off",
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "jsx-a11y/anchor-is-valid": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
