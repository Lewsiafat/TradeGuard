import React, { useState } from 'react';
import { ChecklistItem } from '../types';
import { Button } from './Button';

interface SettingsProps {
  template: ChecklistItem[];
  setTemplate: (items: ChecklistItem[]) => void;
  pairs: string[];
  setPairs: (pairs: string[]) => void;
}

export const Settings: React.FC<SettingsProps> = ({ template, setTemplate, pairs, setPairs }) => {
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

  return (
    <div className="space-y-8">
      
      {/* PAIRS SETTINGS */}
      <div className="bg-crypto-card border border-gray-700 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
          <span className="mr-3 text-3xl">💱</span> 交易對管理
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">新增交易對</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newPairText}
              onChange={(e) => setNewPairText(e.target.value)}
              placeholder="例如：DOGE/USDT"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
              onKeyDown={(e) => e.key === 'Enter' && addPair()}
            />
            <Button onClick={addPair} variant="secondary">新增</Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {pairs.map((pair) => (
            <div key={pair} className="flex items-center bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 group">
              <span className="text-gray-200 font-mono font-medium">{pair}</span>
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
      <div className="bg-crypto-card border border-gray-700 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-white">
          <span className="mr-3 text-3xl">📝</span> 檢查清單管理
        </h2>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">新增檢查項目</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="例如：資金費率是否為正？"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && addItem()}
            />
            <Button onClick={addItem} variant="secondary">新增</Button>
          </div>
        </div>

        <div className="space-y-3">
          {template.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/50 group hover:border-gray-600 transition-colors">
              <span className="text-gray-200">{item.text}</span>
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