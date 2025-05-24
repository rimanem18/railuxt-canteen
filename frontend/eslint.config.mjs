// .eslintrc.js
export default {
  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "prettier", // ← Prettier と競合する ESLint ルールをオフに
  ],
  plugins: ["vue"],
  // 必要に応じて parserOptions, rules などを追加
};
