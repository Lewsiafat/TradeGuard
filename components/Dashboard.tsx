import React from 'react';
import { TradeRecord } from '../types';

interface DashboardProps {
  history: TradeRecord[];
}

export const Dashboard: React.FC<DashboardProps> = ({ history }) => {
  const totalTrades = history.length;
  const winTrades = history.filter(t => (t.pnl || 0) > 0).length;
  const winRate = totalTrades > 0 ? Math.round((winTrades / totalTrades) * 100) : 0;
  const totalPnl = history.reduce((sum, t) => sum + (t.pnl || 0), 0);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-crypto-card border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-500 text-sm font-medium">總收益 (PnL)</p>
          <p className={`text-3xl font-bold mt-2 ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)} <span className="text-sm text-gray-600">USDT</span>
          </p>
        </div>
        <div className="bg-crypto-card border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-500 text-sm font-medium">勝率 (Win Rate)</p>
          <p className="text-3xl font-bold mt-2 text-indigo-400">
            {winRate}% <span className="text-sm text-gray-600">/ {totalTrades} 筆</span>
          </p>
        </div>
        <div className="bg-crypto-card border border-gray-800 p-6 rounded-2xl">
          <p className="text-gray-500 text-sm font-medium">近期表現</p>
          <div className="flex gap-1 mt-3">
            {history.slice(0, 10).map((t, i) => (
              <div 
                key={i} 
                className={`w-3 h-8 rounded-sm ${
                    (t.pnl || 0) > 0 ? 'bg-emerald-500' : (t.pnl || 0) < 0 ? 'bg-rose-500' : 'bg-gray-600'
                }`}
                title={`${t.pair}: ${t.pnl}`}
              ></div>
            ))}
            {history.length === 0 && <span className="text-gray-600 text-sm">尚無數據</span>}
          </div>
        </div>
      </div>

      {/* Recent History Table */}
      <div className="bg-crypto-card border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">近期交易紀錄</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">時間</th>
                <th className="px-6 py-4">交易對</th>
                <th className="px-6 py-4">方向</th>
                <th className="px-6 py-4 text-right">損益</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {history.map((trade) => (
                <tr key={trade.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(trade.startTime).toLocaleString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{trade.pair}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.direction === 'LONG' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-rose-900/30 text-rose-400'
                    }`}>
                      {trade.direction}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${(trade.pnl || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {(trade.pnl || 0) > 0 ? '+' : ''}{trade.pnl}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-600">
                    目前還沒有交易紀錄，開始第一筆交易吧！
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};