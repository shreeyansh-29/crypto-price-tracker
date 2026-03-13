import { memo } from 'react';

export interface Trade {
  id: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
}

export interface TradesListProps {
  trades?: Trade[];
}

export function TradesListComponent({ trades = [] }: TradesListProps) {
  return (
    <div className="trades-panel">
      <div className="panel-header">
        <h3>Recent Trades</h3>
      </div>
      <div className="trades-header">
        <div className="trades-cell">Price</div>
        <div className="trades-cell">Size</div>
        <div className="trades-cell">Side</div>
        <div className="trades-cell">Time</div>
      </div>
      <div className="trades-body">
        {trades.map((trade) => {
          const sideClass =
            trade.side === 'buy' ? 'text-up' : 'text-down';
          const date = new Date(trade.timestamp);
          const time = date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return (
            <div
              key={trade.id}
              className="trades-row"
            >
              <div className="trades-cell">
                {trade.price.toFixed(2)}
              </div>
              <div className="trades-cell">
                {trade.size.toFixed(3)}
              </div>
              <div className={`trades-cell ${sideClass}`}>
                {trade.side.toUpperCase()}
              </div>
              <div className="trades-cell">{time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(TradesListComponent);

