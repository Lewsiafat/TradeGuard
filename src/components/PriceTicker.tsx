import React, { useEffect, useState } from 'react';
import { cryptoService, PriceUpdate } from '../services/cryptoService';

type PriceData = {
  price: number;
  prevPrice: number | null;
  updateId: number;
};

export const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const symbols = ['BTCUSDT', 'ETHUSDT'];

  useEffect(() => {
    cryptoService.connect();

    const handlePriceUpdate = (update: PriceUpdate) => {
      setPrices(prev => {
        const currentData = prev[update.symbol] || { price: 0, prevPrice: null, updateId: 0 };
        if (currentData.price === update.price) return prev;
        
        return {
          ...prev,
          [update.symbol]: {
            price: update.price,
            prevPrice: currentData.price !== 0 ? currentData.price : null,
            updateId: currentData.updateId + 1
          }
        };
      });
    };

    symbols.forEach(symbol => {
      cryptoService.subscribe(symbol, handlePriceUpdate);
    });

    return () => {
      symbols.forEach(symbol => {
        cryptoService.unsubscribe(symbol, handlePriceUpdate);
      });
    };
  }, []);

  const getPriceAnimationClass = (symbol: string) => {
    const data = prices[symbol];
    if (!data || data.prevPrice === null) return '';
    if (data.price > data.prevPrice) return 'animate-flash-green';
    if (data.price < data.prevPrice) return 'animate-flash-red';
    return '';
  };

  const getPriceColor = (symbol: string) => {
    const data = prices[symbol];
    if (!data || data.prevPrice === null) return 'text-gray-400';
    if (data.price > data.prevPrice) return 'text-green-500';
    if (data.price < data.prevPrice) return 'text-red-500';
    return 'text-gray-400';
  };

  const hasData = Object.keys(prices).length > 0;

  if (!hasData) {
      return (
        <div className="flex gap-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 w-full justify-center lg:justify-start">
          <span className="text-gray-500 animate-pulse">正在連接行情服務...</span>
        </div>
      );
  }

  return (
    <div className="flex gap-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 w-full justify-center lg:justify-start">
      {symbols.map(symbol => {
        const data = prices[symbol];
        return (
          <div key={symbol} className="flex flex-col items-end min-w-[80px]">
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">{symbol.replace('USDT', '')}</span>
            <span 
              key={`${symbol}-${data?.updateId}`}
              className={`font-mono text-sm font-bold transition-colors duration-300 ${getPriceColor(symbol)} ${getPriceAnimationClass(symbol)}`}
            >
              {data?.price.toFixed(2) || '---'}
            </span>
          </div>
        );
      })}
    </div>
  );
};