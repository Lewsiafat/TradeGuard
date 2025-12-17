# TradeGuard

> 專業的加密貨幣永續合約交易助手 - 提升交易紀律，優化風險管理

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 目錄

- [專案簡介](#-專案簡介)
- [核心功能](#-核心功能)
- [技術棧](#-技術棧)
- [快速開始](#-快速開始)
- [發布流程](#-發布流程)
- [功能說明](#-功能說明)
- [項目結構](#-項目結構)
- [AI 集成](#-ai-集成)
- [資料持久化](#-資料持久化)
- [常見問題](#-常見問題)

## 🎯 專案簡介

**TradeGuard** 是一款專為加密貨幣永續合約交易者設計的輔助工具,透過強制執行**交易前檢查清單**來提升交易紀律，並提供完整的持倉追蹤與交易損益分析功能。

### 為什麼需要 TradeGuard？

- 💡 **避免情緒化交易** - 強制完成檢查清單才能確認交易

- 📊 **全面風控檢視** - 涵蓋技術面、基本面、心理面
- 📈 **詳細績效追蹤** - 完整記錄每筆交易的生命週期
- 🎨 **專業 UI/UX** - 深色主題，適合長時間使用

## ✨ 核心功能

### 1. 進行中交易管理

- ✅ **交易前檢查清單** - 確保完成所有必要的分析步驟
  - 預設 14 個專業檢查項目（AI 分析、技術面、基本面、心理面）
  - 支援自訂檢查項目
  - 強制完成必填項目才能確認交易
- 📍 **持倉監控** - 實時顯示持倉時間與狀態
- 💰 **平倉結算** - 記錄開倉價、平倉價、損益等資訊

### 2. 交易統計儀表板

- 📊 **總覽指標**
  - 總收益 (Total PnL)
  - 勝率 (Win Rate)
  - 最近 10 筆交易視覺化圖表
- 📜 **完整交易歷史** - 包含時間、交易對、方向、損益等詳細資訊

### 3. 設定管理

- 🪙 **交易對管理** - 新增/刪除可用的加密貨幣交易對
- ✏️ **檢查清單管理** - 自訂專屬的交易前檢查項目
- 🌓 **主題切換** - 支援深色/淺色模式切換
- 💾 **資料管理** - 支援匯出/匯入交易紀錄與設定備份

## 🛠 技術棧

| 類別 | 技術 | 版本 |
|------|------|------|
| **前端框架** | React | ^19.2.0 |
| **程式語言** | TypeScript | ~5.8.2 |
| **建置工具** | Vite | ^6.2.0 |
| **樣式框架** | Tailwind CSS | CDN |
| **狀態管理** | React Hooks + localStorage | - |

## 🚀 快速開始

### 環境需求

- Node.js >= 18.x
- npm 或 yarn

### 安裝步驟

```bash
# 1. 克隆專案
git clone https://github.com/yourusername/TradeGuard.git
cd TradeGuard

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 開啟瀏覽器訪問
http://localhost:3000
```

### 生產環境部署

```bash
# 建置專案
npm run build

# 預覽建置結果
npm run preview
```

## 📦 發布流程

我們使用自動化腳本來管理版本發布。

### 執行發布

```bash
npm run release
```

此命令將引導您完成以下步驟：
1.  選擇版本升級類型（Patch, Minor, Major 或自訂）。
2.  確認新版本號。
3.  輸入發布說明（Release Notes）。
4.  自動更新 `package.json` 版本號。
5.  自動更新 `releaseNote.md`。

完成後，請記得推送標籤：
```bash
git commit -am "Release x.x.x"
git tag vx.x.x
git push origin master --tags
```

## 📖 功能說明

### 交易流程

```
建立交易 → 完成檢查清單 → 確認開倉 → 持倉監控 → 平倉結算
```

### 交易狀態

- **CHECKING** - 檢查清單階段
- **OPEN** - 持倉中
- **CLOSED** - 已結算

### 預設檢查清單

TradeGuard 提供 14 個專業檢查項目：

1. ✅ GEMINI 產生分析報告
2. ✅ Claude 產生分析報告
3. ✅ ChatGPT 產生分析報告
4. ✅ 產生三種 AI 的綜合分析報告
5. ✅ 報告是否過於分歧
6. ✅ 確認做多還是做空
7. ✅ 確認止盈是否合理 (TP1, TP2, TP3)
8. ✅ 確認止損是否合理
9. ✅ 查看最近 12 小時內是否有重大新聞
10. ✅ 查看最近虛擬貨幣 ETF 流出流入
11. ✅ 查看最近虛擬貨幣巨鯨動態
12. ✅ 接下來 12 小時是否有更重要的事
13. ✅ 現在心情精神是否正常
14. ✅ 今天是否為週末 (週末起伏較小)

### 支援的交易對

預設支援：`BTC/USDT`, `ETH/USDT`, `SOL/USDT`, `BNB/USDT`, `BTC(cm)`, `ETH(cm)`

可在「設定」頁面自訂新增其他交易對。

## 📁 項目結構

```
TradeGuard/
├── src/
│   ├── components/           # React 元件
│   │   ├── Layout.tsx       # 應用布局（導航 + 主內容）
│   │   ├── ActiveSession.tsx # 進行中交易管理（核心功能）
│   │   ├── Dashboard.tsx    # 交易統計儀表板
│   │   ├── Settings.tsx     # 設定頁面
│   │   └── Button.tsx       # 可複用按鈕元件
│   ├── App.tsx              # 主應用元件（狀態管理中樞）
│   ├── types.ts             # TypeScript 類型定義
│   ├── constants.ts         # 常量定義（預設檢查清單、交易對）
│   └── index.tsx            # React 入口點
├── index.html               # HTML 模板
├── scripts/                 # 自動化腳本
│   └── release.js           # 版本發布腳本
├── vite.config.ts           # Vite 建置配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 專案依賴配置
└── README.md                # 專案說明文件
```



## 💾 資料持久化

所有資料使用 **localStorage** 本地儲存，無需後端伺服器：

| 儲存鍵 | 用途 |
|--------|------|
| `tradeguard_history` | 歷史交易記錄 |
| `tradeguard_template` | 檢查清單模板 |
| `tradeguard_active_trades` | 進行中的交易 |
| `tradeguard_pairs` | 使用者自訂的交易對 |

> ⚠️ **注意**：清除瀏覽器快取會刪除所有資料，建議定期匯出備份。

### 備份與還原

TradeGuard 提供資料匯出與匯入功能：

1. **匯出**：在「設定」頁面點擊「下載備份檔案」，將下載包含所有交易紀錄與設定的 JSON 檔案。
2. **匯入**：在「設定」頁面選擇備份檔案進行還原。**注意：還原將覆蓋目前的資料**。

## ❓ 常見問題


### Q: 資料是否會上傳到雲端？

不會。所有資料都儲存在您的瀏覽器本地儲存中，完全隱私安全。

### Q: 支援哪些交易所？

TradeGuard 是交易助手工具，不直接連接交易所 API。您需要在交易所執行實際交易。

### Q: 可以自訂檢查清單嗎？

可以！在「設定」頁面中，您可以新增、編輯或刪除檢查項目。

### Q: 支援行動裝置嗎？

支援！TradeGuard 採用響應式設計，可在桌面和行動裝置上流暢使用。

## 🎨 UI/UX 設計

- **深色主題** - 適合長時間盯盤使用
- **色彩編碼**
  - 綠色 = 做多 (LONG) / 盈利
  - 紅色 = 做空 (SHORT) / 虧損
  - 靛藍色 = 主要操作按鈕
- **響應式布局**
  - 桌面版：左側固定導航欄 + 主內容區
  - 行動版：頂部導航欄 + 全螢幕內容

## 📄 授權協議

MIT License - 詳見 [LICENSE](LICENSE) 檔案

## 🤝 貢獻指南

歡迎提交 Issue 和 Pull Request！

1. Fork 本專案
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📧 聯絡方式

如有任何問題或建議，歡迎：

- 提交 [GitHub Issue](https://github.com/yourusername/TradeGuard/issues)
- 發送郵件至：your.email@example.com

## 🙏 致謝

- [React](https://reactjs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 建置工具
- [Tailwind CSS](https://tailwindcss.com/) - 樣式框架


---

**⚠️ 風險提示**：加密貨幣交易具有高風險，可能導致本金損失。TradeGuard 僅為輔助工具，不構成投資建議。請謹慎評估自身風險承受能力。

---

<p align="center">Made with ❤️ for Crypto Traders</p>
