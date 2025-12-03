# Release Notes - Flexible Position Entry & UI Improvements

## 🚀 New Features

### Flexible Position Entry
- **Deferred Direction Selection**: You can now create a trade plan without specifying "Long" or "Short" upfront. The direction is selected when closing the trade, allowing for more flexibility during the planning phase.
- **Pending State**: Active trades display a "PENDING" direction status until finalized.
- **Closing Flow Update**: The closing interface now includes a mandatory direction selection (Long/Short) to ensure accurate record-keeping.

### Dashboard Improvements
- **Trade Notes Tooltip**: Added a tooltip to the trade history list. Hover over the new help icon next to a trade pair to view the full trade notes without cluttering the table.

### Theme Support
- **Dark/Light Mode**: Added a theme toggle to switch between dark and light modes. The preference is saved locally.

### Data Management
- **Export/Import**: You can now export your trade history and settings to a JSON file for backup, and import it back to restore your data.

## 🛠 Technical Changes

### Directory Structure Refactor
- Moved all source code files to a `src/` directory to align with standard Vite project structure and best practices.
- Updated `index.html`, `tsconfig.json`, and `vite.config.ts` to reflect the new structure.

### Component Updates
- **`Tooltip.tsx`**: Created a reusable, responsive tooltip component.
- **`ActiveSession.tsx`**: Refactored to support the flexible entry flow.
- **`Dashboard.tsx`**: Integrated the tooltip component.

## 🐛 Bug Fixes
- Fixed an issue where the tooltip content was truncated by increasing the maximum width and adjusting padding.
