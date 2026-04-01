# 資安修復待辦清單

> 審查日期：2026-03-31
> 專案：Luxt Hotel Frontend (Nuxt 3)

---

## 🔴 嚴重（優先修復）

### 1. Admin 路由缺少認證守衛

- **問題：** `/admin/*` 頁面沒有驗證登入狀態，任何人可直接存取
- **影響檔案：**
  - `pages/admin/rooms/index.vue`
  - `pages/admin/rooms/create.vue`
  - `pages/admin/rooms/[id].vue`
- **修復方式：**
  - 建立 `middleware/auth.ts`，檢查 token 是否存在，未登入導向 `/login`
  - 在 admin 頁面的 `definePageMeta` 加入 `middleware: 'auth'`

### 2. Token 明文儲存在 localStorage

- **問題：** `stores/common.js` 使用 `{ persist: true }`，token 以明文存在 localStorage
- **影響檔案：** `stores/common.js`
- **修復方式：**
  - 從 Pinia persist 中移除 token，僅保留 `remember` 和 `email`
  - Token 改為只存在 cookie 中（由 `useCookie` 管理）

### 3. 登出未通知後端

- **問題：** `layouts/default.vue` 的 logout 只清除前端 cookie，後端 token 仍然有效
- **影響檔案：** `layouts/default.vue`
- **修復方式：**
  - 確認後端是否有 logout API（如 `POST /api/v1/user/logout`）
  - 登出時呼叫後端 API 失效 token
  - 同時清除 cookie 和 Pinia store

---

## 🟡 高風險

### 4. Cookie 缺少安全旗標

- **問題：** `useCookie('token')` 沒有設定安全選項
- **影響檔案：** 所有使用 `useCookie('token')` 的檔案
- **修復方式：**
  ```ts
  useCookie('token', {
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 天
  })
  ```

  - 建議抽成共用 composable 避免重複設定

### 5. DevTools 在 production 應關閉

- **問題：** `nuxt.config.ts` 中 `devtools: { enabled: true }` 硬編碼開啟
- **影響檔案：** `nuxt.config.ts`
- **修復方式：**
  ```ts
  devtools: {
    enabled: process.env.NODE_ENV !== 'production'
  }
  ```

### 6. test.vue 應移除

- **問題：** `pages/test.vue` 將 `route.query.name` 直接拼入外部 API URL，不應帶到正式環境
- **影響檔案：** `pages/test.vue`
- **修復方式：** 刪除此檔案，或加入 `.nuxtignore`

### 7. 表單輸入驗證不足

- **問題：** 預訂表單、登入表單僅有 HTML5 驗證，易被繞過
- **影響檔案：**
  - `pages/login.vue` — 密碼只有 minlength，缺少英數混合驗證
  - `pages/room/[id].vue` — 手機號碼、郵遞區號無格式驗證
- **修復方式：**
  - 加入 JS 正則驗證（submit 前檢查）
  - 手機：`/^09\d{8}$/`
  - 郵遞區號：`/^\d{3,6}$/`
  - 密碼：`/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/`

---

## 🟢 建議改善

### 8. 加入安全 Headers

- 透過 Nitro server middleware 設定 CSP、X-Frame-Options 等
- 建立 `server/middleware/security.ts`

### 9. 依賴版本鎖定

- `package.json` 中 `vue` 和 `vue-router` 使用 `latest`，建議鎖定明確版本
- 定期執行 `npm audit` 檢查漏洞

### 10. Token 過期處理

- `composables/Http.ts` 中 403 錯誤只做導向，沒有清除過期 token
- 應加入 token refresh 機制或在 403 時自動清除 token 並導向登入頁

---

## 修復順序建議

| 順序 | 項目                                    | 預估工時 |
| ---- | --------------------------------------- | -------- |
| 1    | 建立 auth middleware 保護 admin 路由    | 15 min   |
| 2    | Token 從 localStorage 移除，僅用 cookie | 10 min   |
| 3    | Cookie 加入安全旗標                     | 10 min   |
| 4    | 登出清除所有狀態 + 呼叫後端             | 10 min   |
| 5    | 刪除 test.vue                           | 1 min    |
| 6    | DevTools 環境判斷                       | 1 min    |
| 7    | 表單驗證強化                            | 20 min   |
| 8    | 安全 Headers                            | 15 min   |
| 9    | 鎖定依賴版本                            | 5 min    |
| 10   | Token 過期處理                          | 15 min   |
