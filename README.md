# Luxt Hotel — 飯店訂房前端

以 **Nuxt 4** 建構的飯店訂房網站，提供房型瀏覽、線上預訂及後台房型管理功能。

## 技術棧

- **框架**：Nuxt 4 / Vue 3（Composition API + `<script setup>`）
- **樣式**：Tailwind CSS
- **狀態管理**：Pinia + pinia-plugin-persistedstate
- **表單驗證**：vee-validate + yup
- **日期選擇器**：v-calendar
- **型別系統**：TypeScript（API 層完整型別定義）
- **程式碼品質**：ESLint + Prettier

## 安裝與啟動

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev
```

開發伺服器預設運行於 `http://localhost:3000`。

## 指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器 |
| `npm run build` | 建置正式環境 |
| `npm run preview` | 預覽正式環境建置結果 |
| `npm run lint` | ESLint 檢查 |

## 環境變數

請在專案根目錄建立 `.env` 檔案，並設定必要的環境變數。可參考 `.env.example`（如有提供）。

## 目錄結構

```
app/
├── components/       # 共用元件
├── composables/      # 共用邏輯與 API 模組
│   └── api/          # 後端 API 封裝（含完整型別）
├── layouts/          # 頁面佈局（default / admin）
├── middleware/        # 路由中介層
├── pages/            # 頁面路由
├── plugins/          # Nuxt 插件
├── stores/           # Pinia 狀態管理
└── types/            # TypeScript 型別定義
```

## 功能

- 房型瀏覽與詳情頁
- 線上預訂（含表單驗證與日曆選擇器）
- 使用者註冊與登入
- 訂單管理（查看、取消）
- 後台房型 CRUD 管理
- Toast 通知系統
