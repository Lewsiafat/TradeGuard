import { render, screen, act } from '@testing-library/react';
import { PriceTicker } from './PriceTicker';
import { cryptoService } from '../services/cryptoService';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock the cryptoService
vi.mock('../services/cryptoService', () => ({
  cryptoService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
  }
}));

describe('PriceTicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(<PriceTicker />);
    // Assuming it shows BTCUSDT by default or just renders something
    // If we pass props, we should update the test.
  });

  it('should subscribe to BTCUSDT and ETHUSDT on mount', () => {
    render(<PriceTicker />);
    expect(cryptoService.connect).toHaveBeenCalled();
    expect(cryptoService.subscribe).toHaveBeenCalledWith('BTCUSDT', expect.any(Function));
    expect(cryptoService.subscribe).toHaveBeenCalledWith('ETHUSDT', expect.any(Function));
  });

  it('should update price when cryptoService notifies', () => {
    let priceCallback: any;
    (cryptoService.subscribe as any).mockImplementation((symbol: string, cb: any) => {
        if (symbol === 'BTCUSDT') {
            priceCallback = cb;
        }
    });

    render(<PriceTicker />);

    act(() => {
        if (priceCallback) {
            priceCallback({ symbol: 'BTCUSDT', price: 50000.00 });
        }
    });

    expect(screen.getByText('50000.00')).toBeInTheDocument();
  });
  
  it('should apply green color when price goes up', () => {
     let priceCallback: any;
    (cryptoService.subscribe as any).mockImplementation((symbol: string, cb: any) => {
        if (symbol === 'BTCUSDT') {
            priceCallback = cb;
        }
    });

    render(<PriceTicker />);

    // Initial price
    act(() => {
        priceCallback({ symbol: 'BTCUSDT', price: 50000.00 });
    });
    
    // Price up
    act(() => {
        priceCallback({ symbol: 'BTCUSDT', price: 50100.00 });
    });

    const priceElement = screen.getByText('50100.00');
    expect(priceElement).toHaveClass('text-green-500');
    expect(priceElement).toHaveClass('animate-flash-green');
  });

  it('should apply red color when price goes down', () => {
     let priceCallback: any;
    (cryptoService.subscribe as any).mockImplementation((symbol: string, cb: any) => {
        if (symbol === 'BTCUSDT') {
            priceCallback = cb;
        }
    });

    render(<PriceTicker />);

    // Initial price
    act(() => {
        priceCallback({ symbol: 'BTCUSDT', price: 50000.00 });
    });
    
    // Price down
    act(() => {
        priceCallback({ symbol: 'BTCUSDT', price: 49900.00 });
    });

    const priceElement = screen.getByText('49900.00');
    expect(priceElement).toHaveClass('text-red-500');
    expect(priceElement).toHaveClass('animate-flash-red');
  });
});
