export type PriceUpdate = {
  symbol: string;
  price: number;
};

export type PriceListener = (update: PriceUpdate) => void;

export class CryptoService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, PriceListener[]> = new Map();
  private pendingSubscriptions: Set<string> = new Set();
  private baseUrl = 'wss://stream.binance.com:9443/ws';

  connect() {
    if (this.ws) return;

    this.ws = new WebSocket(this.baseUrl);

    this.ws.addEventListener('open', () => {
      console.log('Connected to Binance WebSocket');
      this.processPendingSubscriptions();
    });

    this.ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        // Binance trade stream format: { e: 'trade', s: 'BTCUSDT', p: '50000.00', ... }
        if (data.e === 'trade' && data.s && data.p) {
          const update: PriceUpdate = {
            symbol: data.s,
            price: parseFloat(data.p),
          };
          this.notifyListeners(update);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.ws.addEventListener('close', () => {
      console.log('Disconnected from Binance WebSocket');
      this.ws = null;
    });
    
    this.ws.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  subscribe(symbol: string, callback: PriceListener) {
    const upperSymbol = symbol.toUpperCase();
    
    if (!this.listeners.has(upperSymbol)) {
      this.listeners.set(upperSymbol, []);
      this.subscribeToStream(symbol);
    }
    
    this.listeners.get(upperSymbol)?.push(callback);
  }

  unsubscribe(symbol: string, callback?: PriceListener) {
      // Basic implementation for now, might need enhancement for full unsubscribe logic
      const upperSymbol = symbol.toUpperCase();
      if (this.listeners.has(upperSymbol)) {
          if (callback) {
               const callbacks = this.listeners.get(upperSymbol) || [];
               this.listeners.set(upperSymbol, callbacks.filter(cb => cb !== callback));
          } else {
              this.listeners.delete(upperSymbol);
          }
      }
  }

  private subscribeToStream(symbol: string) {
    const streamName = `${symbol.toLowerCase()}@trade`;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: [streamName],
        id: 1 // Simple ID for now
      }));
    } else {
      this.pendingSubscriptions.add(streamName);
    }
  }

  private processPendingSubscriptions() {
    if (this.pendingSubscriptions.size === 0) return;

    const streams = Array.from(this.pendingSubscriptions);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
            method: 'SUBSCRIBE',
            params: streams,
            id: 1
        }));
        this.pendingSubscriptions.clear();
    }
  }

  private notifyListeners(update: PriceUpdate) {
    const listeners = this.listeners.get(update.symbol);
    if (listeners) {
      listeners.forEach(listener => listener(update));
    }
  }
}

export const cryptoService = new CryptoService();