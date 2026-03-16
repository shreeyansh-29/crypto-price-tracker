import { useCallback, useEffect, useRef, useState } from 'react';
import type { Trade } from '../types';
import { useWebSocket } from './useWebSocket';

export function useTrades(symbol: string | null, maxTrades: number = 30) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const tradesRef = useRef<Trade[]>([]);
  let tradeIdCounter = useRef(0);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'all_trades' && data.symbol === symbol) {
      const { price, size, buyer_role, timestamp } = data;

      // Server sends buyer_role/seller_role ("maker"/"taker") — the taker is the aggressor.
      // If the buyer is the taker, it's a buy-initiated trade; otherwise sell.
      const side: 'buy' | 'sell' = buyer_role === 'taker' ? 'buy' : 'sell';

      const newTrade: Trade = {
        id: `${symbol}-${tradeIdCounter.current++}`,
        symbol: symbol!,
        price: parseFloat(price),
        size: parseFloat(size),
        side,
        // Server timestamp is in microseconds (Date.now() * 1000)
        timestamp: timestamp ? Math.floor(timestamp / 1000) : Date.now(),
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
