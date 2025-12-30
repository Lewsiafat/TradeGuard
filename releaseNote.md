# Release Notes

## [0.1.0] - 2025-12-29

- Feature: 整合 Binance WebSocket 實時報價顯示，支援漲跌閃爍動效。
- Feature: 整合 Google Gemini AI 行情分析服務，支援按需生成市場分析報告。
- Style: 優化行情與分析報告介面樣式，提升專業感。
- Docs: 更新 README.md 文件。

## [0.0.2] - 2025-12-17

this is test


## [0.0.1] - 2025-12-17

### Flexible Position Entry & UI Improvements
#### New Features
- **Flexible Position Entry**: You can now create a trade plan without specifying "Long" or "Short" upfront. The direction is selected when closing the trade, allowing for more flexibility during the planning phase.
- **Pending State**: Active trades display a "PENDING" direction status until finalized.
- **Closing Flow Update**: The closing interface now includes a mandatory direction selection (Long/Short) to ensure accurate record-keeping.
- **Trade Notes Tooltip**: Added a tooltip to the trade history list. Hover over the new help icon next to a trade pair to view the full trade notes without cluttering the table.
- **Theme Support**: Added a theme toggle to switch between dark and light modes.
- **Data Export/Import**: Backup and restore trade history.

#### Technical Changes
- **Directory Structure**: Moved source code to `src/`.
- **Components**: Added `Tooltip.tsx`, updated `ActiveSession.tsx` and `Dashboard.tsx`.

#### Bug Fixes
- Fixed tooltip truncation issue.
