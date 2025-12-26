import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CryptoService, PriceUpdate } from './cryptoService';

describe('CryptoService', () => {
  let service: CryptoService;
  let mockWebSocket: any;

  beforeEach(() => {
    service = new CryptoService();
    
    // Mock WebSocket instance
    mockWebSocket = {
      send: vi.fn(),
      close: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      readyState: 1 // OPEN
    };

    // Use a regular function for the mock implementation to ensure it's treated as a constructor
    global.WebSocket = vi.fn(function() {
        return mockWebSocket;
    }) as any;
    (global.WebSocket as any).OPEN = 1;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create a WebSocket connection when connect is called', () => {
    service.connect();
    expect(global.WebSocket).toHaveBeenCalledWith(expect.stringContaining('wss://stream.binance.com:9443/ws'));
  });

  it('should subscribe to a symbol and receive updates', () => {
    service.connect();
    
    // Simulate WebSocket open
    const openCallback = mockWebSocket.addEventListener.mock.calls.find((call: any[]) => call[0] === 'open')[1];
    openCallback();

    const mockCallback = vi.fn();
    service.subscribe('btcusdt', mockCallback);

    // Verify subscription message sent
    expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({
      method: 'SUBSCRIBE',
      params: ['btcusdt@trade'],
      id: 1
    }));

    // Simulate incoming message
    const messageCallback = mockWebSocket.addEventListener.mock.calls.find((call: any[]) => call[0] === 'message')[1];
    const mockData = {
      e: 'trade',
      s: 'BTCUSDT',
      p: '50000.00'
    };
    
    messageCallback({ data: JSON.stringify(mockData) });

    expect(mockCallback).toHaveBeenCalledWith({
      symbol: 'BTCUSDT',
      price: 50000.00
    });
  });

  it('should close connection when disconnect is called', () => {
    service.connect();
    service.disconnect();
    expect(mockWebSocket.close).toHaveBeenCalled();
  });
});
