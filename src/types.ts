export enum TradeStatus {
  CHECKING = 'CHECKING', // User is going through the checklist
  OPEN = 'OPEN',         // Trade is active/open
  CLOSED = 'CLOSED'      // Trade is finished and recorded
}

export interface ChecklistItem {
  id: string;
  text: string;
  isRequired: boolean;
}

export interface TradeRecord {
  id: string;
  pair: string;         // e.g., BTC/USDT
  direction?: 'LONG' | 'SHORT';
  status: TradeStatus;
  startTime: number;
  endTime?: number;
  openPrice?: number;   // New: Entry price
  closePrice?: number;  // New: Exit price
  pnl?: number;         // Profit and Loss amount
  pnlPercentage?: number; // Profit and Loss %
  notes?: string;
  checklistSnapshot: { text: string; checked: boolean }[]; // Snapshot of what was checked
}

export interface AppState {
  activeTrades: TradeRecord[];
  tradeHistory: TradeRecord[];
  checklistTemplate: ChecklistItem[];
  availablePairs: string[];
}

export type ViewState = 'DASHBOARD' | 'ACTIVE_TRADES' | 'HISTORY' | 'SETTINGS';