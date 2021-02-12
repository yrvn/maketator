module.exports = {
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    "plugin:react/recommended",
    // 'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    // "array-bracket-spacing": ["error", "always"],
    "object-curly-spacing": ["error", "always"],
    // "space-in-parens": ["error", "always"],
    "react/jsx-uses-vars": "error",
    "react/jsx-uses-react": "error",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
  },
};
