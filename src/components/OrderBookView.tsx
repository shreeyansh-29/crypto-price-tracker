import React from 'react';
import type { OrderBookWithDepth } from '../hooks/useOrderBook';
import '../styles/OrderBook.css';

interface OrderBookViewProps {
  orderBook: OrderBookWithDepth | null;
  isLoading: boolean;
}

export function OrderBookView({ orderBook, isLoading }: OrderBookViewProps) {
  if (isLoading) {
    return <div className="orderbook--loading">Loading orderbook...</div>;
  }

  if (!orderBook) {
    return <div className="orderbook--empty">No orderbook data</div>;
  }

  const maxDepth = orderBook.maxDepth || 1;

  return (
    <div className="orderbook">
      <div className="orderbook-section">
        <h3>Asks (Sell Orders)</h3>
        <div className="orderbook-header">
          <div className="ob-col-price">Price</div>
          <div className="ob-col-size">Size</div>
          <div className="ob-col-depth">Depth</div>
        </div>
        <div className="orderbook-rows">
          {orderBook.asksWithDepth.map((level) => {
            const depthPercent = (level.cumulativeSize / maxDepth) * 100;
            return (
              <div key={level.price} className="orderbook-row ask">
                <div className="ob-col-price">${level.price.toFixed(2)}</div>
                <div className="ob-col-size">{level.size.toFixed(4)}</div>
                <div className="ob-col-depth">
                  <div
                    className="depth-bar ask-bar"
                    style={{ width: `${depthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="orderbook-section">
        <h3>Bids (Buy Orders)</h3>
        <div className="orderbook-header">
          <div className="ob-col-price">Price</div>
          <div className="ob-col-size">Size</div>
          <div className="ob-col-depth">Depth</div>
        </div>
        <div className="orderbook-rows">
          {orderBook.bidsWithDepth.map((level) => {
            const depthPercent = (level.cumulativeSize / maxDepth) * 100;
            return (
              <div key={level.price} className="orderbook-row bid">
                <div className="ob-col-price">${level.price.toFixed(2)}</div>
                <div className="ob-col-size">{level.size.toFixed(4)}</div>
                <div className="ob-col-depth">
                  <div
                    className="depth-bar bid-bar"
                    style={{ width: `${depthPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
