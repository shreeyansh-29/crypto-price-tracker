export const WS_URL = "ws://localhost:8080";

export const SYMBOLS = [
  "BTCUSD",
  "ETHUSD",
  "XRPUSD",
  "SOLUSD",
  "PAXGUSD",
  "DOGEUSD",
];

export const SYMBOL_NAMES: Record<string, string> = {
  BTCUSD: "Bitcoin",
  ETHUSD: "Ethereum",
  XRPUSD: "XRP",
  SOLUSD: "Solana",
  PAXGUSD: "PAX Gold",
  DOGEUSD: "Dogecoin",
};

export const formatPrice = (price: number, decimalPlaces: number = 2): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '—';
  }
  return price.toFixed(decimalPlaces);
};

export const formatLargeNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '—';
  }
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return num.toFixed(2);
};

export const FAVORITES_STORAGE_KEY = 'crypto_favorites';
