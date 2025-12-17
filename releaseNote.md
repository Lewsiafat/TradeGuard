# Release Notes

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
