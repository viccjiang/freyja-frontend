/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{vue,js,ts}", // 掃描所有 Vue 組件
    "./layouts/**/*.vue", // 掃描所有布局文件
    "./pages/**/*.vue", // 掃描所有頁面文件
    "./composables/**/*.{js,ts}", // 掃描所有可組合式函數
    "./plugins/**/*.{js,ts}", // 掃描所有插件
    "./utils/**/*.{js,ts}", // 掃描所有工具函數
    "./{App,app}.{js,ts,vue}", // 掃描主應用文件
    "./{Error,error}.{js,ts,vue}", // 掃描錯誤處理文件
    "./app.config.{js,ts}", // 掃描應用配置文件
  ],
  theme: {
    extend: {}, // 在這裡可以擴展或覆蓋 Tailwind 的默認主題
  },
  plugins: [], // 可以添加 Tailwind 插件
};
