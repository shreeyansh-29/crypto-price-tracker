import { useCallback, useEffect, useRef, useState } from 'react';
import type { Trade } from '../types';
import { useWebSocket } from './useWebSocket';

export function useTrades(symbol: string | null, maxTrades: number = 30) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const tradesRef = useRef<Trade[]>([]);
  let tradeIdCounter = useRef(0);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'all_trades' && data.symbol === symbol) {
      const { price, size, side, timestamp } = data;
      
      const newTrade: Trade = {
        id: `${symbol}-${tradeIdCounter.current++}`,
        symbol: symbol!,
        price: parseFloat(price),
        size: parseFloat(size),
        side: side.toLowerCase() === 'buy' ? 'buy' : 'sell',
        timestamp: timestamp || Date.now(),
      };

      tradesRef.current = [newTrade, ...tradesRef.current].slice(0, maxTrades);
      setTrades([...tradesRef.current]);
    }
  }, [symbol, maxTrades]);

  const { subscribe, unsubscribe, isConnected } = useWebSocket({
    onMessage: handleMessage,
  });

  useEffect(() => {
    if (!symbol || !isConnected) return;

    subscribe([{ name: 'all_trades', symbols: [symbol] }]);

    return () => {
      unsubscribe([{ name: 'all_trades', symbols: [symbol] }]);
    };
  }, [symbol, isConnected, subscribe, unsubscribe]);

  return {
    trades,
    isLoading: !isConnected,
  };
}
