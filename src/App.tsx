import React, { useState, useEffect } from 'react';
import { AppState, ChecklistItem, TradeRecord, TradeStatus, ViewState } from './types';
import { DEFAULT_CHECKLIST, DEFAULT_PAIRS, STORAGE_KEYS } from './constants';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ActiveSession } from './components/ActiveSession';
import { Settings } from './components/Settings';

const App: React.FC = () => {
  // --- State Management ---
  const [currentView, setCurrentView] = useState<ViewState>('ACTIVE_TRADES');

  // Load initial data from local storage
  const [history, setHistory] = useState<TradeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return saved ? JSON.parse(saved) : [];
  });

  const [template, setTemplate] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TEMPLATE);
    return saved ? JSON.parse(saved) : DEFAULT_CHECKLIST;
  });

  const [pairs, setPairs] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAIRS);
    return saved ? JSON.parse(saved) : DEFAULT_PAIRS;
  });

  // Active Trades is now an array
  const [activeTrades, setActiveTrades] = useState<TradeRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TRADES);
    return saved ? JSON.parse(saved) : [];
  });

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMPLATE, JSON.stringify(template));
  }, [template]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAIRS, JSON.stringify(pairs));
  }, [pairs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TRADES, JSON.stringify(activeTrades));
  }, [activeTrades]);

  // --- Actions ---

  const handleStartTrade = (pair: string, notes: string) => {
    const newTrade: TradeRecord = {
      id: Date.now().toString(),
      pair,
      // direction is now optional and set at close
      status: TradeStatus.CHECKING,
      startTime: Date.now(),
      notes,
      checklistSnapshot: [] // Populated when checklist completes
    };
    setActiveTrades(prev => [newTrade, ...prev]);
  };

  const handleUpdateStatus = (tradeId: string, status: TradeStatus) => {
    setActiveTrades(prev => prev.map(trade => {
      if (trade.id !== tradeId) return trade;
      return {
        ...trade,
        status,
        // Reset start time if just moving to OPEN (optional, depends if you want to count checklist time)
        startTime: status === TradeStatus.OPEN ? Date.now() : trade.startTime
      };
    }));
  };

  const handleCloseTrade = (tradeId: string, closeData: { direction: 'LONG' | 'SHORT'; openPrice: number; closePrice: number; pnl: number; pnlPercentage: number; notes: string; endTime: number }) => {
    const trade = activeTrades.find(t => t.id === tradeId);
    if (!trade) return;

    const closedTrade: TradeRecord = {
      ...trade,
      status: TradeStatus.CLOSED,
      direction: closeData.direction, // Set direction here
      endTime: closeData.endTime,
      openPrice: closeData.openPrice,
      closePrice: closeData.closePrice,
      pnl: closeData.pnl,
      pnlPercentage: closeData.pnlPercentage,
      notes: trade.notes ? `${trade.notes}\n---\n[結算]: ${closeData.notes}` : closeData.notes
    };

    setHistory(prev => [closedTrade, ...prev]);
    setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
    // View remains on ACTIVE_TRADES usually
  };

  const handleCancelTrade = (tradeId: string) => {
    if (window.confirm('確定要取消這筆交易嗎？紀錄將不會保存。')) {
      setActiveTrades(prev => prev.filter(t => t.id !== tradeId));
    }
  };

  const handleImportData = (data: any) => {
    try {
      if (data.history) setHistory(data.history);
      if (data.template) setTemplate(data.template);
      if (data.pairs) setPairs(data.pairs);
      if (data.activeTrades) setActiveTrades(data.activeTrades);
      alert('資料匯入成功！');
    } catch (error) {
      console.error('Import failed:', error);
      alert('資料匯入失敗，請檢查檔案格式。');
    }
  };

  // --- Render Logic ---

  const renderContent = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard history={history} />;

      case 'ACTIVE_TRADES':
        return (
          <ActiveSession
            activeTrades={activeTrades}
            availablePairs={pairs}
            checklistTemplate={template}
            startTrade={handleStartTrade}
            updateTradeStatus={handleUpdateStatus}
            closeTrade={handleCloseTrade}
            cancelTrade={handleCancelTrade}
          />
        );

      case 'HISTORY':
        return <Dashboard history={history} />;

      case 'SETTINGS':
        return (
          <Settings
            template={template}
            setTemplate={setTemplate}
            pairs={pairs}
            setPairs={setPairs}
            activeTrades={activeTrades}
            history={history}
            onImport={handleImportData}
          />
        );

      default:
        return <Dashboard history={history} />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderContent()}
    </Layout>
  );
};

export default App;