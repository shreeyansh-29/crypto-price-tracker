import type { Trade } from '../types';
import '../styles/TradesList.css';

interface TradesListViewProps {
  trades: Trade[];
  isLoading: boolean;
}

export function TradesListView({ trades, isLoading }: TradesListViewProps) {
  if (isLoading && trades.length === 0) {
    return <div className="tl-loading">Loading trades...</div>;
  }

  if (trades.length === 0) {
    return <div className="tl-empty">No trades yet</div>;
  }

  return (
    <div className="tl">
      <div className="tl__header">
        <div className="tl__hcell tl__hcell--price">PRICE</div>
        <div className="tl__hcell">SIZE</div>
        <div className="tl__hcell">SIDE</div>
        <div className="tl__hcell tl__hcell--time">TIME</div>
      </div>

      <div className="tl__body">
        {trades.map((trade) => {
          const isBuy = trade.side === 'buy';
          const time = new Date(trade.timestamp).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return (
            <div key={trade.id} className="tl__row">
              <div className={`tl__cell tl__cell--price ${isBuy ? 'buy-price' : 'sell-price'}`}>
                {trade.price.toFixed(2)}
              </div>
              <div className="tl__cell">{trade.size.toFixed(3)}</div>
              <div className="tl__cell">
                <span className={`tl__side-badge ${isBuy ? 'buy' : 'sell'}`}>
                  {isBuy ? 'BUY' : 'SELL'}
                </span>
              </div>
              <div className="tl__cell tl__cell--time">{time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
