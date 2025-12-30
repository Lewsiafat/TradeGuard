import React, { useEffect, useState, memo } from 'react';
import { cryptoService, PriceUpdate } from '../services/cryptoService';

type PriceData = {
  price: number;
  prevPrice: number | null;
  updateId: number;
};

const PriceItem = memo(({ symbol, data }: { symbol: string, data: PriceData | undefined }) => {
  const getPriceAnimationClass = () => {
    if (!data || data.prevPrice === null) return '';
    if (data.price > data.prevPrice) return 'animate-flash-green';
    if (data.price < data.prevPrice) return 'animate-flash-red';
    return '';
  };

  const getPriceColor = () => {
    if (!data || data.prevPrice === null) return 'text-gray-400';
    if (data.price > data.prevPrice) return 'text-emerald-500';
    if (data.price < data.prevPrice) return 'text-rose-500';
    return 'text-gray-400';
  };

  return (
    <div className="flex flex-col items-end min-w-[90px] px-2 py-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/30 transition-colors">
      <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-gray-500 dark:text-gray-500 leading-none mb-1">{symbol.replace('USDT', '')}</span>
      <span 
        key={`${symbol}-${data?.updateId}`}
        className={`font-mono text-sm font-black transition-colors duration-300 ${getPriceColor()} ${getPriceAnimationClass()}`}
      >
        {data?.price.toFixed(2) || '---'}
      </span>
    </div>
  );
});

export const PriceTicker: React.FC = () => {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT']; // Added SOL

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

  const hasData = Object.keys(prices).length > 0;

  if (!hasData) {
      return (
        <div className="flex gap-4 p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 w-full justify-center lg:justify-start">
          <span className="text-[10px] text-gray-500 animate-pulse font-medium tracking-wide py-1">CONNECTING TO BINANCE...</span>
        </div>
      );
  }

  return (
    <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-gray-100/50 dark:bg-gray-800/30 backdrop-blur-md border border-gray-200 dark:border-gray-800 w-full justify-center lg:justify-start shadow-inner">
      {symbols.map(symbol => (
        <PriceItem key={symbol} symbol={symbol} data={prices[symbol]} />
      ))}
    </div>
  );
};