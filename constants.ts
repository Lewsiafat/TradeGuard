import { ChecklistItem } from './types';

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', text: 'GEMINI 產生分析報告', isRequired: true },
  { id: 'c2', text: 'Claude 產生分析報告', isRequired: true },
  { id: 'c3', text: 'ChatGPT 產生分析報告', isRequired: true },
  { id: 'c4', text: '產生三種AI的綜合分析報告', isRequired: true },
  { id: 'c5', text: '報告是否過於分岐', isRequired: true },
  { id: 'c6', text: '確認做多還是做空', isRequired: true },
  { id: 'c7', text: '確認止盈是否合理(TP1, TP2, TP3)', isRequired: true },
  { id: 'c8', text: '確認止損是否合理', isRequired: true },
  { id: 'c9', text: '查看最近12小時內是否有重大新聞或經濟數據是否公布', isRequired: true },
  { id: 'c10', text: '查看最近虛擬貨幣ETF流出流入', isRequired: true },
  { id: 'c11', text: '查看最近虛擬貨幣巨鯨動態', isRequired: true },
  { id: 'c12', text: '接下來12小時是否有更重要的事', isRequired: true },
  { id: 'c13', text: '現在心情精神是否正常', isRequired: true },
  { id: 'c14', text: '今天是否為周末(周末起伏較小)', isRequired: true },
];

export const DEFAULT_PAIRS = [
  'BTC/USDT',
  'ETH/USDT',
  'SOL/USDT',
  'BNB/USDT',
  'BTC(cm)',
  'ETH(cm)'
];

export const STORAGE_KEYS = {
  HISTORY: 'tradeguard_history',
  TEMPLATE: 'tradeguard_template',
  ACTIVE_TRADES: 'tradeguard_active_trades', // Updated key
  PAIRS: 'tradeguard_pairs',
};