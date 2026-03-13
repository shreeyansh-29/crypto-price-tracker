import React from 'react';
import { SYMBOL_NAMES, formatPrice, formatLargeNumber } from '../config';
import type { CryptoData } from '../types';
import '../styles/TickerTable.css';

interface TickerTableProps {
  tickers: Record<string, CryptoData>;
  onSymbolClick?: (symbol: string) => void;
  onToggleFavorite?: (symbol: string) => void;
  favorites?: Set<string>;
  isLoading: boolean;
}

export function TickerTable({ 
  tickers, 
  onSymbolClick, 
  onToggleFavorite,
  favorites = new Set(),
  isLoading 
}: TickerTableProps) {
  if (isLoading) {
    return <div className="ticker-table--loading">Loading crypto prices...</div>;
  }

  const tickersArray = Object.values(tickers).sort((a, b) =>
    SYMBOL_NAMES[a.symbol].localeCompare(SYMBOL_NAMES[b.symbol])
  );

  if (tickersArray.length === 0) {
    return <div className="ticker-table--empty">No data available</div>;
  }

  return (
    <div className="ticker-table">
      <table>
        <thead>
          <tr>
            <th>Fav</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>24h Change %</th>
            <th>24h Volume</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickersArray.map((ticker) => (
            <tr key={ticker.symbol} className="ticker-row">
              <td className="favorite">
                {onToggleFavorite && (
                  <button
                    className={`fav-btn ${favorites.has(ticker.symbol) ? 'active' : ''}`}
                    onClick={() => onToggleFavorite(ticker.symbol)}
                    title={favorites.has(ticker.symbol) ? 'Remove favorite' : 'Add favorite'}
                  >
                    {favorites.has(ticker.symbol) ? '★' : '☆'}
                  </button>
                )}
              </td>
              <td className="symbol">
                <strong>{SYMBOL_NAMES[ticker.symbol]}</strong>
                <br />
                <small>{ticker.symbol}</small>
              </td>
              <td className="price">${formatPrice(ticker.last_price, 2)}</td>
              <td className={`change ${ticker.change_24h! >= 0 ? 'positive' : 'negative'}`}>
                {ticker.change_24h! >= 0 ? '+' : ''}${formatPrice(ticker.change_24h!, 2)}
              </td>
              <td className={`change-percent ${ticker.change_24h_percent! >= 0 ? 'positive' : 'negative'}`}>
                {ticker.change_24h_percent! >= 0 ? '+' : ''}
                {formatPrice(ticker.change_24h_percent!, 2)}%
              </td>
              <td className="volume">{formatLargeNumber(ticker.volume_24h)}</td>
              <td>
                <button
                  className="btn-view-details"
                  onClick={() => onSymbolClick?.(ticker.symbol)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
