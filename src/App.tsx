import { useState } from 'react';
import { SYMBOLS } from './config';
import { useTickerStream } from './hooks/useTickerStream';
import { useFavorites } from './hooks/useFavorites';
import { TickerTable } from './components/TickerTable';
import { ProductDetail } from './pages/ProductDetail';
import './App.css';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { tickers, candleData, isLoading } = useTickerStream(SYMBOLS);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const selectedTicker = selectedSymbol ? tickers[selectedSymbol] : undefined;
  const selectedCandle = selectedSymbol ? candleData[selectedSymbol] : undefined;

  // Filter tickers based on favorites toggle
  const displayTickers = showFavoritesOnly
    ? Object.fromEntries(
        Object.entries(tickers).filter(([symbol]) => favorites.has(symbol))
      )
    : tickers;

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 Crypto Price Tracker</h1>
        <p>Real-time cryptocurrency prices with WebSocket updates</p>
      </header>

      <main className="app-main">
        {selectedSymbol ? (
          <ProductDetail
            symbol={selectedSymbol}
            ticker={selectedTicker}
            candleData={selectedCandle}
            isFavorite={isFavorite(selectedSymbol)}
            onToggleFavorite={() => toggleFavorite(selectedSymbol)}
            onClose={() => setSelectedSymbol(null)}
          />
        ) : (
          <section className="prices-section">
            <div className="section-controls">
              <h2>Live Prices</h2>
              <button
                className={`filter-btn ${showFavoritesOnly ? 'active' : ''}`}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              >
                {showFavoritesOnly ? '★ Favorites Only' : '☆ Show All'}
              </button>
            </div>
            <TickerTable
              tickers={displayTickers}
              isLoading={isLoading}
              onSymbolClick={setSelectedSymbol}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>Data updates in real-time via WebSocket • Made with React + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
