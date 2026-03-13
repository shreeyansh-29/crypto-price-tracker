import { memo } from 'react';

export interface OrderLevel {
  price: number;
  size: number;
  cumulativeSize: number;
}

export interface OrderBookProps {
  bids?: OrderLevel[];
  asks?: OrderLevel[];
}

export function OrderBookComponent({ bids = [], asks = [] }: OrderBookProps) {
  const maxCumulative = Math.max(
    bids[bids.length - 1]?.cumulativeSize ?? 0,
    asks[asks.length - 1]?.cumulativeSize ?? 0,
  );

  const renderRow = (
    level: OrderLevel,
    side: 'bid' | 'ask',
  ) => {
    const widthPct =
      maxCumulative > 0
        ? (level.cumulativeSize / maxCumulative) * 100
        : 0;

    return (
      <div
        key={`${side}-${level.price}-${level.size}-${level.cumulativeSize}`}
        className={`ob-row ob-row--${side}`}
      >
        <div
          className="ob-depth"
          style={{ width: `${widthPct}%` }}
        />
        <div className="ob-cell ob-cell--price">
          {level.price.toFixed(2)}
        </div>
        <div className="ob-cell">{level.size.toFixed(3)}</div>
        <div className="ob-cell">
          {level.cumulativeSize.toFixed(3)}
        </div>
      </div>
    );
  };

  return (
    <div className="orderbook-panel">
      <div className="panel-header">
        <h3>Orderbook</h3>
      </div>
      <div className="ob-asks">
        {asks.map((ask) => renderRow(ask, 'ask'))}
      </div>
      <div className="ob-spread" />
      <div className="ob-bids">
        {bids.map((bid) => renderRow(bid, 'bid'))}
      </div>
    </div>
  );
}

export default memo(OrderBookComponent);

export const OrderBook = memo(OrderBookComponent);

