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
    <div className="mt-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <span>🤖</span> AI 行情分析 ({pair})
        </h3>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            loading 
              ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20'
          }`}
        >
          {loading ? '分析中...' : `分析 ${pair}`}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {report && !loading && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-100 dark:border-gray-800">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 italic">
              "{report.summary}"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-500">技術趨勢</span>
              <p className="font-bold text-indigo-500">{report.technicalIndicators.trend}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-gray-500">風險評估</span>
              <p className={`font-bold ${getRiskColor(report.riskLevel)}`}>{report.riskLevel}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex-1">
              <span className="text-[10px] text-gray-500 block">支撐位</span>
              <span className="text-sm font-mono font-bold">{report.technicalIndicators.support || '---'}</span>
            </div>
            <div className="flex-1 text-right">
              <span className="text-[10px] text-gray-500 block">壓力位</span>
              <span className="text-sm font-mono font-bold">{report.technicalIndicators.resistance || '---'}</span>
            </div>
          </div>
          
          <div className="text-[10px] text-gray-400 text-right">
            分析時間: {new Date(report.timestamp).toLocaleString()}
          </div>
        </div>
      )}

      {!report && !loading && !error && (
        <p className="text-xs text-center text-gray-400 py-4">
          點擊按鈕獲取最新 AI 策略建議
        </p>
      )}
    </div>
  );
};
