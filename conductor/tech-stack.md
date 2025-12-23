# Tech Stack

本文件詳細說明了 TradeGuard 專案所使用的技術工具、框架與函式庫。

# 前端核心 (Frontend Core)

- **框架**：[React](https://react.dev/) (v19.2.0) - 用於建立用戶介面的核心 UI 庫。
- **程式語言**：[TypeScript](https://www.typescriptlang.org/) (v5.8.2) - 提供靜態類型檢查，增強程式碼的健壯性與可維護性。
- **建置工具**：[Vite](https://vitejs.dev/) (v6.2.0) - 極速的前端開發與打包工具。

# 樣式與 UI (Styling & UI)

- **樣式框架**：[Tailwind CSS](https://tailwindcss.com/) - 實用優先 (Utility-first) 的 CSS 框架，用於快速構建現代化介面。
- **設計風格**：簡約現代、深色主題優先、響應式設計。

# 狀態管理與資料持久化 (State Management & Persistence)

- **狀態管理**：React Hooks (useState, useEffect, useMemo) - 處理應用程式內部的組件狀態。
- **資料持久化**：瀏覽器 LocalStorage - 用於本地儲存交易紀錄、範本與用戶設定，實現無後端架構。

# 開發工具與流程 (Development & Workflow)

- **版本控制**：Git
- **自動化腳本**：Node.js (用於版本發布腳本 scripts/release.js)
- **套件管理**：npm / package-lock.json

# 未來擴充方向 (Future Considerations)

- **實時行情**：預計整合 WebSocket API 或 REST API (如 Binance API) 以獲取實時價格。
- **AI 整合**：預計串接 OpenAI/Gemini/Claude API 進行市場數據分析與報告生成。