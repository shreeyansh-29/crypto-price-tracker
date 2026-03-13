import React from 'react';
import type { Trade } from '../types';
import '../styles/TradesList.css';

interface TradesListViewProps {
  trades: Trade[];
  isLoading: boolean;
}

export function TradesListView({ trades, isLoading }: TradesListViewProps) {
  if (isLoading && trades.length === 0) {
    return <div className="trades-list--loading">Loading trades...</div>;
  }

  if (trades.length === 0) {
    return <div className="trades-list--empty">No trades yet</div>;
  }

  return (
    <div className="trades-list">
      <div className="trades-header">
        <div className="trades-col-price">Price</div>
        <div className="trades-col-size">Size</div>
        <div className="trades-col-side">Side</div>
        <div className="trades-col-time">Time</div>
      </div>
      <div className="trades-rows">
        {trades.map((trade) => {
          const time = new Date(trade.timestamp).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          return (
            <div key={trade.id} className={`trades-row trade-${trade.side}`}>
              <div className="trades-col-price">${trade.price.toFixed(2)}</div>
              <div className="trades-col-size">{trade.size.toFixed(4)}</div>
              <div className={`trades-col-side ${trade.side}`}>
                {trade.side.toUpperCase()}
              </div>
              <div className="trades-col-time">{time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
