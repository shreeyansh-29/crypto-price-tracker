import React from 'react';
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
  onClose 
}: ProductDetailProps) {
  const { orderBook, isLoading: obLoading } = useOrderBook(symbol);
  const { trades, isLoading: tradesLoading } = useTrades(symbol);

  if (!ticker) {
    return (
      <div className="product-detail--loading">
        Loading {symbol} details...
      </div>
    );
  }

  const high24h = candleData?.high || ticker.last_price;
  const low24h = candleData?.low || ticker.last_price;

  return (
    <div className="product-detail">
      <div className="product-detail__header">
        <div>
          <h1>{SYMBOL_NAMES[symbol]}</h1>
          <p className="symbol-code">{symbol}</p>
        </div>
        <div className="header-actions">
          {onToggleFavorite && (
            <button 
              className={`fav-btn ${isFavorite ? 'active' : ''}`}
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove favorite' : 'Add favorite'}
            >
              {isFavorite ? '★' : '☆'}
            </button>
          )}
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      <div className="product-detail__main-price">
        <div className="price-display">
          <h2>${formatPrice(ticker.last_price, 2)}</h2>
          <div className={`change ${ticker.change_24h! >= 0 ? 'positive' : 'negative'}`}>
            <span>
              {ticker.change_24h! >= 0 ? '▲' : '▼'}{' '}
              ${formatPrice(Math.abs(ticker.change_24h!), 2)} ({formatPrice(Math.abs(ticker.change_24h_percent!), 2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="product-detail__grid">
        <div className="detail-card">
          <h3>Mark Price</h3>
          <p>${formatPrice(ticker.mark_price, 2)}</p>
        </div>

        <div className="detail-card">
          <h3>24h High</h3>
          <p>${formatPrice(high24h, 2)}</p>
        </div>

        <div className="detail-card">
          <h3>24h Low</h3>
          <p>${formatPrice(low24h, 2)}</p>
        </div>

        <div className="detail-card">
          <h3>24h Volume</h3>
          <p>{formatLargeNumber(ticker.volume_24h)}</p>
        </div>

        <div className="detail-card">
          <h3>24h Turnover</h3>
          <p>${formatLargeNumber(ticker.turnover_24h)}</p>
        </div>

        <div className="detail-card">
          <h3>Open Interest</h3>
          <p>{formatLargeNumber(ticker.open_interest)}</p>
        </div>

        <div className="detail-card">
          <h3>Funding Rate</h3>
          <p>{formatPrice(ticker.funding_rate * 100, 4)}%</p>
        </div>

        {candleData && (
          <>
            <div className="detail-card">
              <h3>Open (1d)</h3>
              <p>${formatPrice(candleData.open, 2)}</p>
            </div>
            <div className="detail-card">
              <h3>Close (1d)</h3>
              <p>${formatPrice(candleData.close, 2)}</p>
            </div>
          </>
        )}
      </div>

      <div className="product-detail__orderbook">
        <h2>Live Orderbook</h2>
        <OrderBookView orderBook={orderBook} isLoading={obLoading} />
      </div>

      <div className="product-detail__trades">
        <h2>Recent Trades</h2>
        <TradesListView trades={trades} isLoading={tradesLoading} />
      </div>
    </div>
  );
}
