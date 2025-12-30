import React from 'react';
import { ViewState } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { PriceTicker } from './PriceTicker';

interface LayoutProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, setCurrentView, children }) => {
  const navItems: { id: ViewState; label: string; icon: string }[] = [
    { id: 'ACTIVE_TRADES', label: '進行中交易', icon: '🚀' },
    { id: 'DASHBOARD', label: '儀表板', icon: '📊' },
    // { id: 'HISTORY', label: '歷史紀錄', icon: '📜' }, // Merged with Dashboard for now or keep specific? Let's keep Dashboard as main history view
    { id: 'SETTINGS', label: '設定', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-crypto-dark text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
      {/* Mobile Header Wrapper */}
      <div className="lg:hidden sticky top-0 z-20 flex flex-col">
        <header className="bg-white dark:bg-crypto-card border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            TradeGuard
          </h1>
          <div className="flex space-x-2 items-center">
            <ThemeToggle />
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`p-2 rounded-md text-lg ${currentView === item.id ? 'bg-gray-200 dark:bg-gray-700 text-indigo-600 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {item.icon}
              </button>
            ))}
          </div>
        </header>
        {/* Mobile Ticker */}
        <div className="bg-white/80 dark:bg-crypto-dark/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 p-2">
           <PriceTicker />
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-crypto-dark p-6 sticky top-0 h-screen">
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-indigo-500">Trade</span>Guard
            </h1>
            <p className="text-xs text-gray-500 mt-1">永續合約風控助手</p>
          </div>

          <div className="mb-6">
            <PriceTicker />
          </div>

          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === item.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-900/50'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-4">
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-600 text-center">
              &copy; 2025 TradeGuard v1.1
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};