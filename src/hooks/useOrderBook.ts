import { useCallback, useEffect, useState } from 'react';
import type { OrderBookData, OrderBookLevel } from '../types';
import { useWebSocket } from './useWebSocket';

export interface OrderBookWithDepth extends OrderBookData {
  bidsWithDepth: (OrderBookLevel & { cumulativeSize: number })[];
  asksWithDepth: (OrderBookLevel & { cumulativeSize: number })[];
  maxDepth: number;
}

export function useOrderBook(symbol: string | null) {
  const [orderBook, setOrderBook] = useState<OrderBookWithDepth | null>(null);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'l2_orderbook' && data.symbol === symbol) {
      const { bids, asks } = data;
      
      // Parse bids and asks as numbers
      const parsedBids = bids.map(([price, size]: [string, string]) => ({
        price: parseFloat(price),
        size: parseFloat(size),
      }));
      const parsedAsks = asks.map(([price, size]: [string, string]) => ({
        price: parseFloat(price),
        size: parseFloat(size),
      }));
      
      // Calculate cumulative sizes
      const calculateDepth = (levels: OrderBookLevel[]) => {
        let cumulative = 0;
        return levels.map((level) => ({
          ...level,
          cumulativeSize: (cumulative += level.size),
        }));
      };

      const bidsWithDepth = calculateDepth([...parsedBids].reverse()).reverse();
      const asksWithDepth = calculateDepth(parsedAsks);
      const maxDepth = Math.max(
        bidsWithDepth[bidsWithDepth.length - 1]?.cumulativeSize || 0,
        asksWithDepth[asksWithDepth.length - 1]?.cumulativeSize || 0
      );

      setOrderBook({
        symbol: symbol!,
        bids: parsedBids,
        asks: parsedAsks,
        timestamp: data.timestamp || Date.now(),
        bidsWithDepth: bidsWithDepth.slice(-10), // Top 10
        asksWithDepth: asksWithDepth.slice(0, 10), // Top 10
        maxDepth,
      });
    }
  }, [symbol]);

  const { subscribe, unsubscribe, isConnected } = useWebSocket({
    onMessage: handleMessage,
  });

  useEffect(() => {
    if (!symbol || !isConnected) return;

    subscribe([{ name: 'l2_orderbook', symbols: [symbol] }]);

    return () => {
      unsubscribe([{ name: 'l2_orderbook', symbols: [symbol] }]);
    };
  }, [symbol, isConnected, subscribe, unsubscribe]);

  return {
    orderBook,
    isLoading: !isConnected || !orderBook,
  };
}
