import { SYMBOL_NAMES, formatPrice, formatLargeNumber } from '../config';
import type { CryptoData, CandleData } from '../types';
import { OrderBookView } from '../components/OrderBookView';
import { TradesListView } from '../components/TradesListView';
import { useOrderBook } from '../hooks/useOrderBook';
import { useTrades } from '../hooks/useTrades';
import '../styles/ProductDetail.css';

interface ProductDetailProps {
  symbol: string;
  ticker?: CryptoData;
  candleData?: CandleData;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClose?: () => void;
}

export function ProductDetail({
  symbol,
  ticker,
  candleData,
  isFavorite,
  onToggleFavorite,
  onClose,
}: ProductDetailProps) {
  const { orderBook, isLoading: obLoading } = useOrderBook(symbol);
  const { trades, isLoading: tradesLoading } = useTrades(symbol);

  if (!ticker) {
    return (
      <div className="pd-loading">Loading {symbol} details...</div>
    );
  }

  const high24h = candleData?.high || ticker.last_price;
  const low24h = candleData?.low || ticker.last_price;
  const changePercent = ticker.change_24h_percent ?? 0;
  const isPositive = changePercent >= 0;

  return (
    <div className="pd">
      {/* Top nav */}
      <div className="pd__nav">
        <button className="pd__back-btn" onClick={onClose}>
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="pd__card">
        <div className="pd__header">
          <div className="pd__title-block">
            <div className="pd__symbol">{symbol}</div>
            <div className="pd__name">{SYMBOL_NAMES[symbol]}</div>
          </div>
          <button
            className={`pd__fav-btn ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ★
          </button>
        </div>

        {/* Price */}
        <div className="pd__price-row">
          <span className="pd__price">${formatPrice(ticker.last_price, 2)}</span>
          <span className={`pd__change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}{formatPrice(changePercent, 2)}%
          </span>
        </div>

        {/* Stats bar */}
        <div className="pd__stats">
          <div className="pd__stat">
            <span className="pd__stat-label">MARK PRICE</span>
            <span className="pd__stat-value">${formatPrice(ticker.mark_price, 2)}</span>
          </div>
          <div className="pd__stat">
            <span className="pd__stat-label">24H HIGH</span>
            <span className="pd__stat-value">${formatPrice(high24h, 2)}</span>
          </div>
          <div className="pd__stat">
            <span className="pd__stat-label">24H LOW</span>
            <span className="pd__stat-value">${formatPrice(low24h, 2)}</span>
          </div>
          <div className="pd__stat">
            <span className="pd__stat-label">24H VOLUME</span>
            <span className="pd__stat-value">{formatLargeNumber(ticker.volume_24h)}</span>
          </div>
          <div className="pd__stat">
            <span className="pd__stat-label">FUNDING RATE</span>
            <span className="pd__stat-value">{formatPrice(ticker.funding_rate * 100, 4)}%</span>
          </div>
        </div>

        {/* Orderbook + Recent Trades side by side */}
        <div className="pd__panels">
          <div className="pd__panel">
            <div className="pd__panel-title">Orderbook</div>
            <OrderBookView orderBook={orderBook} isLoading={obLoading} />
          </div>

          <div className="pd__panel">
            <div className="pd__panel-title">Recent Trades</div>
            <TradesListView trades={trades} isLoading={tradesLoading} />
          </div>
        </div>

        {/* WebSocket status */}
        <div className="pd__ws-status">
          <span className="pd__ws-dot" />
          WebSocket connected · Live updates active
        </div>
      </div>
    </div>
  );
}
