export interface TickerData {
  symbol: string;
  last_price: number;
  mark_price: number;
  volume_24h: number;
  turnover_24h: number;
  open_interest: number;
  funding_rate: number;
  timestamp: number;
}

export interface CandleData {
  symbol: string;
  startTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBookData {
  symbol: string;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  timestamp: number;
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface CryptoData extends TickerData {
  change_24h?: number;
  change_24h_percent?: number;
  high_24h?: number;
  low_24h?: number;
}
