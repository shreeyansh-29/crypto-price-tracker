import type { OrderBookWithDepth } from '../hooks/useOrderBook';
import '../styles/OrderBook.css';

interface OrderBookViewProps {
  orderBook: OrderBookWithDepth | null;
  isLoading: boolean;
}

export function OrderBookView({ orderBook, isLoading }: OrderBookViewProps) {
  if (isLoading) {
    return <div className="ob-loading">Loading orderbook...</div>;
  }

  if (!orderBook) {
    return <div className="ob-empty">No orderbook data</div>;
  }

  const maxDepth = orderBook.maxDepth || 1;

  const askLevels = [...orderBook.asksWithDepth].reverse();

  const bestAsk = orderBook.asksWithDepth[0]?.price ?? 0;
  const bestBid = orderBook.bidsWithDepth[0]?.price ?? 0;
  const spread = bestAsk - bestBid;
  const spreadPct = bestBid > 0 ? (spread / bestBid) * 100 : 0;

  return (
    <div className="ob">
      {/* Column headers */}
      <div className="ob__header">
        <div className="ob__hcell ob__hcell--price">PRICE</div>
        <div className="ob__hcell">SIZE</div>
        <div className="ob__hcell">TOTAL</div>
      </div>

      {/* Asks (sell orders) — shown top, lowest ask at bottom */}
      <div className="ob__asks">
        {askLevels.map((level) => {
          const pct = maxDepth > 0 ? (level.cumulativeSize / maxDepth) * 100 : 0;
          return (
            <div key={level.price} className="ob__row ob__row--ask">
              <div
                className="ob__depth-fill ob__depth-fill--ask"
                style={{ width: `${pct}%` }}
              />
              <div className="ob__cell ob__cell--price ask-price">
                {level.price.toFixed(2)}
              </div>
              <div className="ob__cell">{level.size.toFixed(3)}</div>
              <div className="ob__cell">{level.cumulativeSize.toFixed(3)}</div>
            </div>
          );
        })}
      </div>

      {/* Spread */}
      <div className="ob__spread">
        Spread: ${spread.toFixed(2)} ({spreadPct.toFixed(3)}%)
      </div>

      {/* Bids (buy orders) */}
      <div className="ob__bids">
        {orderBook.bidsWithDepth.map((level) => {
          const pct = maxDepth > 0 ? (level.cumulativeSize / maxDepth) * 100 : 0;
          return (
            <div key={level.price} className="ob__row ob__row--bid">
              <div
                className="ob__depth-fill ob__depth-fill--bid"
                style={{ width: `${pct}%` }}
              />
              <div className="ob__cell ob__cell--price bid-price">
                {level.price.toFixed(2)}
              </div>
              <div className="ob__cell">{level.size.toFixed(3)}</div>
              <div className="ob__cell">{level.cumulativeSize.toFixed(3)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
