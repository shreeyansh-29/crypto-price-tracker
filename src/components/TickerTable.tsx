import { SYMBOL_NAMES, formatPrice, formatLargeNumber } from '../config';
import type { CryptoData } from '../types';
import '../styles/TickerTable.css';

interface TickerTableProps {
  tickers: Record<string, CryptoData>;
  onSymbolClick?: (symbol: string) => void;
  onToggleFavorite?: (symbol: string) => void;
  favorites?: Set<string>;
  isLoading: boolean;
  searchQuery?: string;
}

export function TickerTable({
  tickers,
  onSymbolClick,
  onToggleFavorite,
  favorites = new Set(),
  isLoading,
  searchQuery = '',
}: TickerTableProps) {
  if (isLoading) {
    return <div className="ticker-table--loading">Loading markets...</div>;
  }

  const q = searchQuery.toLowerCase().trim();

  const tickersArray = Object.values(tickers)
    .filter((ticker) => {
      if (!q) return true;
      const name = (SYMBOL_NAMES[ticker.symbol] || '').toLowerCase();
      return ticker.symbol.toLowerCase().includes(q) || name.includes(q);
    })
    .sort((a, b) => SYMBOL_NAMES[a.symbol].localeCompare(SYMBOL_NAMES[b.symbol]));

  if (tickersArray.length === 0) {
    return <div className="ticker-table--empty">No markets found</div>;
  }

  return (
    <div className="ticker-table-scroll">
    <div className="ticker-table">
      <div className="ticker-table__header">
        <div className="th th--symbol">SYMBOL</div>
        <div className="th th--price">LAST PRICE</div>
        <div className="th th--change">24H CHANGE</div>
        <div className="th th--volume">VOLUME</div>
      </div>

      {tickersArray.map((ticker) => {
        const changePercent = ticker.change_24h_percent ?? 0;
        const isPositive = changePercent >= 0;
        const isFav = favorites.has(ticker.symbol);

        return (
          <div
            key={ticker.symbol}
            className="ticker-row"
            onClick={() => onSymbolClick?.(ticker.symbol)}
          >
            <div className="td td--symbol">
              <button
                className={`fav-star ${isFav ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite?.(ticker.symbol);
                }}
                title={isFav ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFav ? '★' : '☆'}
              </button>
              <div className="symbol-info">
                <span className="symbol-code">{ticker.symbol}</span>
                <span className="symbol-name">{SYMBOL_NAMES[ticker.symbol]}</span>
              </div>
            </div>

            <div className="td td--price">
              ${formatPrice(ticker.last_price, 2)}
            </div>

            <div className={`td td--change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{formatPrice(changePercent, 2)}%
            </div>

            <div className="td td--volume">
              {formatLargeNumber(ticker.volume_24h)}
            </div>
          </div>
        );
      })}
    </div>
    </div>
  );
}
