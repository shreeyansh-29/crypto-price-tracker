import { useCallback, useEffect, useRef, useState } from 'react';
import type { TickerData, CandleData, CryptoData } from '../types';
import { useWebSocket } from './useWebSocket';

export function useTickerStream(symbols: string[]) {
  const [tickers, setTickers] = useState<Record<string, CryptoData>>({});
  const [candleData, setCandleData] = useState<Record<string, CandleData>>({});
  const tickerRef = useRef<Record<string, TickerData>>({});
  const candleRef = useRef<Record<string, CandleData>>({});
  const dailyOpenRef = useRef<Record<string, number>>({});

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'v2/ticker') {
      const { symbol, close, mark_price, volume, turnover, oi_value, funding_rate, timestamp } = data;

      const last_price = close;
      const volume_24h = volume;
      const turnover_24h = turnover;
      const open_interest = oi_value;

      // Parse numeric values
      const parsedLastPrice = parseFloat(last_price);
      const parsedMarkPrice = parseFloat(mark_price);
      const parsedVolume24h = parseFloat(volume_24h);
      const parsedTurnover24h = parseFloat(turnover_24h);
      const parsedOpenInterest = parseFloat(open_interest);
      const parsedFundingRate = parseFloat(funding_rate);

      // Initialize daily open if not set
      if (!dailyOpenRef.current[symbol]) {
        dailyOpenRef.current[symbol] = parsedLastPrice;
      }

      tickerRef.current[symbol] = {
        symbol,
        last_price: parsedLastPrice,
        mark_price: parsedMarkPrice,
        volume_24h: parsedVolume24h,
        turnover_24h: parsedTurnover24h,
        open_interest: parsedOpenInterest,
        funding_rate: parsedFundingRate,
        timestamp,
      };

      // Calculate 24h change
      const openPrice = dailyOpenRef.current[symbol];
      const change24h = parsedLastPrice - openPrice;
      const change24hPercent = (change24h / openPrice) * 100;

      const cryptoData: CryptoData = {
        ...tickerRef.current[symbol],
        change_24h: change24h,
        change_24h_percent: change24hPercent,
      };

      setTickers((prev) => ({
        ...prev,
        [symbol]: cryptoData,
      }));
    } else if (data.type?.startsWith('candlestick_')) {
      const { symbol, candle_start_time, open, high, low, close, volume } = data;
      candleRef.current[symbol] = {
        symbol,
        startTime: candle_start_time,
        open: parseFloat(open),
        high: parseFloat(high),
        low: parseFloat(low),
        close: parseFloat(close),
        volume: parseFloat(volume),
      };
      setCandleData((prev) => ({
        ...prev,
        [symbol]: candleRef.current[symbol],
      }));
    }
  }, []);

  const { subscribe, unsubscribe, isConnected } = useWebSocket({
    onMessage: handleMessage,
  });

  // Subscribe to ticker data
  useEffect(() => {
    if (isConnected && symbols.length > 0) {
      subscribe([{ name: 'v2/ticker', symbols }]);
      // Also subscribe to 1d candlestick data for daily high/low
      subscribe([{ name: 'candlestick_1d', symbols }]);
    }

    return () => {
      if (symbols.length > 0) {
        unsubscribe([{ name: 'v2/ticker', symbols }]);
        unsubscribe([{ name: 'candlestick_1d', symbols }]);
      }
    };
  }, [isConnected, symbols, subscribe, unsubscribe]);

  return {
    tickers,
    candleData,
    isLoading: !isConnected || Object.keys(tickers).length === 0,
  };
}

