import React, { useState } from 'react';
import { aiService } from '../services/aiService';
import { AIAnalysisReport } from '../types';

interface AIAnalysisProps {
  pair: string;
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ pair }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<AIAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzePair(pair);
      setReport(result);
    } catch (err) {
      setError('分析失敗，請稍後再試。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-green-500';
      case 'MEDIUM': return 'text-yellow-500';
      case 'HIGH': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="mt-4 p-5 rounded-2xl bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-sm transition-all overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
         <span className="text-6xl">🤖</span>
      </div>
      
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div>
          <h3 className="font-black text-gray-800 dark:text-white flex items-center gap-2 tracking-tight">
            AI 行情透視
          </h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{pair} MARKET INSIGHT</p>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${
            loading 
              ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed text-gray-400' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
          }`}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              分析中
            </span>
          ) : '獲取報告'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      {report && !loading && (
        <div className="space-y-5 animate-fade-in relative z-10">
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100/50 dark:border-indigo-500/20 relative">
            <div className="absolute -top-2 -left-2 text-xl">“</div>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-indigo-100 font-medium">
              {report.summary}
            </p>
            <div className="absolute -bottom-2 -right-2 text-xl">”</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-1">趨勢導航</span>
              <p className="font-black text-lg text-indigo-500 leading-none">{report.technicalIndicators.trend}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 block mb-1">風險評級</span>
              <p className={`font-black text-lg leading-none ${getRiskColor(report.riskLevel)}`}>{report.riskLevel}</p>
            </div>
          </div>

          <div className="bg-gray-900 dark:bg-black/40 rounded-xl p-4 flex gap-6 items-center border border-white/5">
            <div className="flex-1">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">支撐</span>
              <span className="text-base font-mono font-black text-emerald-400">
                {report.technicalIndicators.support ? report.technicalIndicators.support.toLocaleString() : '---'}
              </span>
            </div>
            <div className="h-8 w-px bg-gray-800"></div>
            <div className="flex-1 text-right">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest block mb-1">壓力</span>
              <span className="text-base font-mono font-black text-rose-400">
                {report.technicalIndicators.resistance ? report.technicalIndicators.resistance.toLocaleString() : '---'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center px-1">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">AI ENGINE READY</span>
            </div>
            <span className="text-[9px] font-bold text-gray-500">
              UPDATE: {new Date(report.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {!report && !loading && !error && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-xl grayscale opacity-50">
            🔭
          </div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            等待指令分析市場數據
          </p>
        </div>
      )}
    </div>
  );
};
