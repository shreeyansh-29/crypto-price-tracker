import { useMemo } from 'react';
import { useTickerStream } from '../hooks/useTickerStream';
import { SYMBOL_NAMES } from '../config';

export interface TickerSummaryProps {
  symbol: string;
  name?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function TickerSummaryComponent({
  symbol,
  isFavorite,
  onToggleFavorite,
}: TickerSummaryProps) {
  const symbols = useMemo(() => [symbol], [symbol]);
  const { tickers } = useTickerStream(symbols);
  const ticker = tickers[symbol];

  const change = ticker?.change_24h_percent ?? 0;
  const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : '';
  const displayName = SYMBOL_NAMES[symbol] || symbol;

  return (
    <div className="detail-header">
      <div>
        <h2>{symbol}</h2>
        <span className="detail-name">{displayName}</span>
      </div>
      <div className="detail-price">
        <div className="price">
          ${ticker ? ticker.last_price.toLocaleString() : '0.00'}
        </div>
        <div className={`change ${changeClass}`}>
          {ticker ? `${change.toFixed(2)}%` : '—'}
        </div>
      </div>
      {onToggleFavorite && (
        <button onClick={onToggleFavorite} className="fav-btn">
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}

export const TickerSummary = memo(TickerSummaryComponent);

