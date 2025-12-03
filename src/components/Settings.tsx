import React, { useState } from 'react';
import { ChecklistItem, TradeRecord } from '../types';
import { Button } from './Button';

interface SettingsProps {
  template: ChecklistItem[];
  setTemplate: (items: ChecklistItem[]) => void;
  pairs: string[];
  setPairs: (pairs: string[]) => void;
  activeTrades: TradeRecord[];
  history: TradeRecord[];
  onImport: (data: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ template, setTemplate, pairs, setPairs, activeTrades, history, onImport }) => {
  // Checklist State
  const [newItemText, setNewItemText] = useState('');

  // Pairs State
  const [newPairText, setNewPairText] = useState('');

  // Checklist Handlers
  const addItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      isRequired: true,
    };
    setTemplate([...template, newItem]);
    setNewItemText('');
  };

  const removeItem = (id: string) => {
    setTemplate(template.filter(item => item.id !== id));
  };

  // Pairs Handlers
  const addPair = () => {
    if (!newPairText.trim()) return;
    const formattedPair = newPairText.toUpperCase().trim();
    if (!pairs.includes(formattedPair)) {
      setPairs([...pairs, formattedPair]);
    }
    setNewPairText('');
  };

  const removePair = (pairToRemove: string) => {
    setPairs(pairs.filter(p => p !== pairToRemove));
  };

  // Data Management Handlers
  const handleExport = () => {
    const data = {
      activeTrades,
      history,
      template,
      pairs,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradeguard-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        onImport(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('檔案解析失敗');
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="space-y-8">

      {/* DATA MANAGEMENT */}
      <div className="bg-white dark:bg-crypto-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
          <span className="mr-3 text-3xl">💾</span> 資料管理
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">匯出備份</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              將您的交易紀錄、設定和檢查清單匯出為 JSON 檔案。建議定期備份。
            </p>
            <Button onClick={handleExport} variant="secondary" className="w-full">
              下載備份檔案
            </Button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">匯入還原</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              從備份檔案還原資料。注意：這將會覆蓋目前的設定與紀錄。
            </p>
            <label className="block w-full">
              <span className="sr-only">選擇檔案</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  dark:file:bg-indigo-900/30 dark:file:text-indigo-400
                  hover:file:bg-indigo-100 dark:hover:file:bg-indigo-900/50
                  cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* PAIRS SETTINGS */}
      <div className="bg-white dark:bg-crypto-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
          <span className="mr-3 text-3xl">💱</span> 交易對管理
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">新增交易對</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPairText}
              onChange={(e) => setNewPairText(e.target.value)}
              placeholder="例如：DOGE/USDT"
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              onKeyDown={(e) => e.key === 'Enter' && addPair()}
            />
            <Button onClick={addPair} variant="secondary">新增</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {pairs.map((pair) => (
            <div key={pair} className="flex items-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 group">
              <span className="text-gray-800 dark:text-gray-200 font-mono font-medium">{pair}</span>
              <button
                onClick={() => removePair(pair)}
                className="ml-3 text-gray-500 hover:text-rose-500"
                title="刪除"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CHECKLIST SETTINGS */}
      <div className="bg-white dark:bg-crypto-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm dark:shadow-none">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
          <span className="mr-3 text-3xl">📝</span> 檢查清單管理
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">新增檢查項目</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="例如：資金費率是否為正？"
              className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <Button onClick={addItem} variant="secondary">新增</Button>
          </div>
        </div>

        <div className="space-y-3">
          {template.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700/50 group hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              <span className="text-gray-800 dark:text-gray-200">{item.text}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-500 hover:text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                刪除
              </button>
            </div>
          ))}
          {template.length === 0 && (
            <p className="text-gray-500 text-center py-4">清單目前是空的</p>
          )}
        </div>
      </div>
    </div>
  );
};