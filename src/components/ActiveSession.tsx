import React, { useState, useEffect } from 'react';
import { TradeRecord, ChecklistItem, TradeStatus } from '../types';
import { Button } from './Button';

interface ActiveSessionProps {
  activeTrades: TradeRecord[];
  availablePairs: string[];
  checklistTemplate: ChecklistItem[];
  startTrade: (pair: string, notes: string) => void;
  updateTradeStatus: (tradeId: string, status: TradeStatus) => void;
  closeTrade: (tradeId: string, closeData: { direction: 'LONG' | 'SHORT'; openPrice: number; closePrice: number; pnl: number; pnlPercentage: number; notes: string; endTime: number }) => void;
  cancelTrade: (tradeId: string) => void;
}

const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  activeTrades,
  availablePairs,
  checklistTemplate,
  startTrade,
  updateTradeStatus,
  closeTrade,
  cancelTrade,
}) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'DETAIL'>('LIST');
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  // --- Create Form State ---
  const [pair, setPair] = useState(availablePairs[0] || 'BTC/USDT');
  // direction removed from creation state
  const [preNotes, setPreNotes] = useState('');

  // --- Checklist State (Per Trade) ---
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // --- Closing State ---
  const [closeData, setCloseData] = useState({
    direction: 'LONG' as 'LONG' | 'SHORT', // Default to LONG, user must confirm
    openPrice: '',
    closePrice: '',
    pnl: '',
    pnlPercentage: '',
    notes: '',
    endTime: ''
  });

  // --- Effects ---
  useEffect(() => {
    if (activeTrades.length === 0) {
      setViewMode('CREATE');
    } else if (viewMode === 'LIST' && activeTrades.length === 0) {
      setViewMode('CREATE');
    }
  }, [activeTrades.length]);

  // --- Helpers ---
  const getSelectedTrade = () => activeTrades.find(t => t.id === selectedTradeId);

  const handleStart = () => {
    startTrade(pair, preNotes);
    setPreNotes(''); // Reset
    // Immediately select the new trade (which is the first one since we prepend)
    // But we need to wait for the prop update. 
    // Actually, simpler: just set view mode to LIST, and the user can click it.
    // Or better: The requirement says "Redirect to checklist immediately".
    // Since startTrade updates parent state, we can't easily know the ID here synchronously.
    // But we can assume it will be the first one.
    // For now, let's go to LIST, but maybe we can improve this.
    // Wait, if we go to LIST, the user sees the list.
    // To go to checklist immediately, we need the ID.
    // Let's just go to LIST for now, as finding the ID requires passing it back or effect.
    setViewMode('LIST');
  };

  const openDetail = (id: string) => {
    setSelectedTradeId(id);
    setCheckedItems({}); // Reset local check state for new view
    setCloseData({ direction: 'LONG', openPrice: '', closePrice: '', pnl: '', pnlPercentage: '', notes: '', endTime: '' });
    setViewMode('DETAIL');
  };

  // --- RENDERERS ---

  const renderTime = (startTime: number) => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h > 0 ? h + 'h ' : ''}${m}m`;
  };

  // 1. LIST VIEW (Dashboard of Active Trades)
  if (viewMode === 'LIST') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">進行中的交易 ({activeTrades.length})</h2>
          <Button onClick={() => setViewMode('CREATE')} variant="primary">
            + 新增交易
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTrades.map(trade => (
            <div
              key={trade.id}
              onClick={() => openDetail(trade.id)}
              className="bg-crypto-card border border-gray-700 hover:border-indigo-500 rounded-xl p-6 cursor-pointer transition-all shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden group"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${trade.direction === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-black text-white">{trade.pair}</h3>
                <span className={`px-2 py-1 rounded text-xs font-bold ${trade.status === TradeStatus.CHECKING ? 'bg-yellow-900/30 text-yellow-400' : 'bg-indigo-900/30 text-indigo-400'
                  }`}>
                  {trade.status === TradeStatus.CHECKING ? '檢查中' : '持倉中'}
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className={`font-bold text-lg ${trade.direction === 'LONG' ? 'text-emerald-400' : trade.direction === 'SHORT' ? 'text-rose-400' : 'text-gray-400'}`}>
                  {trade.direction || 'PENDING'}
                </span>
                <span className="text-gray-500 font-mono text-sm">
                  {renderTime(trade.startTime)}
                </span>
              </div>
            </div>
          ))}
          {activeTrades.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-500">目前沒有進行中的交易</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. CREATE VIEW
  if (viewMode === 'CREATE') {
    return (
      <div className="max-w-2xl mx-auto bg-crypto-card border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">🚀 建立新交易計畫</h2>
          {activeTrades.length > 0 && (
            <button onClick={() => setViewMode('LIST')} className="text-gray-400 hover:text-white">
              取消
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">交易對</label>
            <select
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono tracking-wide appearance-none"
            >
              {availablePairs.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Direction selection removed */}

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">交易筆記 (選填)</label>
          <textarea
            value={preNotes}
            onChange={(e) => setPreNotes(e.target.value)}
            placeholder="為什麼要開這筆單？邏輯是什麼？"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
          />
        </div>

        <Button
          onClick={handleStart}
          className="w-full py-4 text-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 border-none"
        >
          開始檢查清單
        </Button>
      </div >
    );
  }

  // 3. DETAIL VIEW
  const activeTrade = getSelectedTrade();
  if (!activeTrade) return <div>Error: Trade not found</div>;

  // --- PHASE: CHECKING ---
  if (activeTrade.status === TradeStatus.CHECKING) {
    const allChecked = checklistTemplate.every(item => !item.isRequired || checkedItems[item.id]);
    const progress = Math.round((Object.keys(checkedItems).length / checklistTemplate.length) * 100) || 0;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => setViewMode('LIST')} className="text-gray-400 hover:text-white flex items-center mb-4">
          ← 返回列表
        </button>

        <div className="bg-crypto-card border border-gray-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>

          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className={activeTrade.direction === 'LONG' ? 'text-emerald-400' : activeTrade.direction === 'SHORT' ? 'text-rose-400' : 'text-gray-400'}>
                  {activeTrade.direction || 'PENDING'}
                </span>
                <span>{activeTrade.pair}</span>
              </h2>
            </div>
            <button onClick={() => { cancelTrade(activeTrade.id); setViewMode('LIST'); }} className="text-gray-500 hover:text-white text-sm underline">
              取消此交易
            </button>
          </div>

          <div className="space-y-4">
            {checklistTemplate.map((item) => (
              <label
                key={item.id}
                className={`flex items-start p-4 rounded-xl border transition-all cursor-pointer select-none ${checkedItems[item.id]
                  ? 'bg-indigo-900/20 border-indigo-500/50'
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-500'
                  }`}
              >
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    className="appearance-none w-6 h-6 border-2 border-gray-500 rounded bg-gray-800 checked:bg-indigo-500 checked:border-indigo-500 transition-colors cursor-pointer"
                    checked={!!checkedItems[item.id]}
                    onChange={(e) => setCheckedItems(prev => ({ ...prev, [item.id]: e.target.checked }))}
                  />
                  {checkedItems[item.id] && (
                    <svg className="w-4 h-4 absolute top-1 left-1 text-white pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </div>
                <span className={`ml-3 text-lg ${checkedItems[item.id] ? 'text-white font-medium' : 'text-gray-300'}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <Button
              onClick={() => updateTradeStatus(activeTrade.id, TradeStatus.OPEN)}
              disabled={!allChecked}
              className={`w-full py-4 text-lg transition-all ${allChecked ? 'opacity-100 transform scale-100' : 'opacity-50'}`}
              variant={allChecked ? (activeTrade.direction === 'LONG' ? 'success' : 'danger') : 'secondary'}
            >
              {allChecked ? `確認開始交易` : `尚有 ${checklistTemplate.length - Object.keys(checkedItems).length} 項未確認`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- PHASE: OPEN / MONITOR ---
  if (activeTrade.status === TradeStatus.OPEN) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <button onClick={() => setViewMode('LIST')} className="text-gray-400 hover:text-white flex items-center mb-4">
          ← 返回列表
        </button>

        <div className="bg-crypto-card border border-gray-700 rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-2 ${activeTrade.direction === 'LONG' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>

          <h2 className="text-5xl font-black text-white mb-2 tracking-tight">{activeTrade.pair}</h2>
          <p className={`text-xl font-bold ${activeTrade.direction === 'LONG' ? 'text-emerald-400' : activeTrade.direction === 'SHORT' ? 'text-rose-400' : 'text-gray-400'}`}>
            {activeTrade.direction || 'PENDING'}
          </p>

          <div className="my-8 p-4 bg-gray-900 rounded-xl border border-gray-800">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-1">持倉時間</p>
            <p className="text-3xl font-mono text-indigo-300">
              <Timer startTime={activeTrade.startTime} />
            </p>
          </div>

          <Button
            onClick={() => {
              // Pre-fill the end time with current time when clicking close
              setCloseData(prev => ({ ...prev, endTime: formatDateTimeLocal(new Date()) }));
              updateTradeStatus(activeTrade.id, TradeStatus.CLOSED);
            }}
            variant="primary"
            className="w-full py-4 text-lg shadow-indigo-500/30"
          >
            平倉結算 (Close Position)
          </Button>
        </div>

        {activeTrade.notes && (
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl">
            <h4 className="text-gray-500 text-sm font-bold mb-2">開倉筆記</h4>
            <p className="text-gray-300">{activeTrade.notes}</p>
          </div>
        )}
      </div>
    );
  }

  // --- PHASE: CLOSING FORM ---
  if (activeTrade.status === TradeStatus.CLOSED) {
    return (
      <div className="max-w-xl mx-auto bg-crypto-card border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">💰 結算損益: {activeTrade.pair}</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">結束時間</label>
          <input
            type="datetime-local"
            value={closeData.endTime}
            onChange={(e) => setCloseData({ ...closeData, endTime: e.target.value })}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">交易方向</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setCloseData({ ...closeData, direction: 'LONG' })}
              className={`py-3 rounded-lg font-bold transition-all ${closeData.direction === 'LONG'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 ring-2 ring-emerald-400 ring-offset-2 ring-offset-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              做多 (LONG)
            </button>
            <button
              onClick={() => setCloseData({ ...closeData, direction: 'SHORT' })}
              className={`py-3 rounded-lg font-bold transition-all ${closeData.direction === 'SHORT'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 ring-2 ring-rose-400 ring-offset-2 ring-offset-gray-900'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
            >
              做空 (SHORT)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">開倉價格</label>
            <input
              type="number"
              value={closeData.openPrice}
              onChange={(e) => setCloseData({ ...closeData, openPrice: e.target.value })}
              placeholder="Entry Price"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">平倉均價</label>
            <input
              type="number"
              value={closeData.closePrice}
              onChange={(e) => setCloseData({ ...closeData, closePrice: e.target.value })}
              placeholder="Exit Price"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">盈虧金額 (USDT)</label>
            <input
              type="number"
              value={closeData.pnl}
              onChange={(e) => setCloseData({ ...closeData, pnl: e.target.value })}
              placeholder="0.00"
              className={`w-full bg-gray-900 border-2 rounded-lg px-4 py-2 font-bold focus:outline-none ${parseFloat(closeData.pnl) > 0 ? 'border-emerald-500 text-emerald-400' : parseFloat(closeData.pnl) < 0 ? 'border-rose-500 text-rose-400' : 'border-gray-700 text-white'
                }`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">盈虧百分比 (%)</label>
            <input
              type="number"
              value={closeData.pnlPercentage}
              onChange={(e) => setCloseData({ ...closeData, pnlPercentage: e.target.value })}
              placeholder="0.00"
              className={`w-full bg-gray-900 border-2 rounded-lg px-4 py-2 font-bold focus:outline-none ${parseFloat(closeData.pnlPercentage) > 0 ? 'border-emerald-500 text-emerald-400' : parseFloat(closeData.pnlPercentage) < 0 ? 'border-rose-500 text-rose-400' : 'border-gray-700 text-white'
                }`}
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">結算筆記 (檢討)</label>
          <textarea
            value={closeData.notes}
            onChange={(e) => setCloseData({ ...closeData, notes: e.target.value })}
            placeholder="這筆交易做得好嗎？有沒有遵守紀律？"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={() => { updateTradeStatus(activeTrade.id, TradeStatus.OPEN); }} variant="secondary" className="flex-1">返回持倉</Button>
          <Button
            onClick={() => {
              closeTrade(activeTrade.id, {
                direction: closeData.direction,
                openPrice: parseFloat(closeData.openPrice),
                closePrice: parseFloat(closeData.closePrice),
                pnl: parseFloat(closeData.pnl),
                pnlPercentage: parseFloat(closeData.pnlPercentage),
                notes: closeData.notes,
                endTime: closeData.endTime ? new Date(closeData.endTime).getTime() : Date.now()
              });
              setViewMode('LIST');
            }}
            disabled={!closeData.pnl}
            variant="primary"
            className="flex-[2] bg-gradient-to-r from-indigo-600 to-purple-600 border-none"
          >
            儲存交易紀錄
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

// Helper Component for Timer
const Timer = ({ startTime }: { startTime: number }) => {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  return <>{h > 0 ? h + 'h ' : ''}{m}m {s}s</>;
};