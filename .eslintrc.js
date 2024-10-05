module.exports = {
  env: {
    browser: true, // 允許使用瀏覽器全域變數
    es2023: true, // 使用 ECMAScript 2023 特性
  },
  extends: ["@nuxtjs", "prettier"], // 使用 Nuxt.js 和 Prettier 推薦的規則
  parserOptions: {
    ecmaVersion: 2023, // 指定 ECMAScript 版本
    sourceType: "module", // 使用 ES 模組語法
  },
  plugins: ["prettier"], // 使用 Prettier 插件
  rules: {
    "no-undef": "off", // 關閉未定義變數的警告（Nuxt 3 會自動處理）
    "prettier/prettier": "error", // 將不符合 Prettier 規則的地方標記為錯誤
  },
  overrides: [
    {
      files: ["**/*.js", "**/*.ts", "**/*.vue"], // 這些規則適用於所有 .js、.ts 和 .vue 文件
    },
  ],
};
