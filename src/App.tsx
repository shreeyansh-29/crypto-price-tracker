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
  const [searchQuery, setSearchQuery] = useState('');
  const { tickers, candleData, isLoading } = useTickerStream(SYMBOLS);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const selectedTicker = selectedSymbol ? tickers[selectedSymbol] : undefined;
  const selectedCandle = selectedSymbol ? candleData[selectedSymbol] : undefined;

  const displayTickers = Object.fromEntries(
    Object.entries(tickers).filter(([symbol]) => {
      if (showFavoritesOnly && !favorites.has(symbol)) return false;
      return true;
    })
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-heading">Crypto Price Tracker</h1>
        <p className="app-subheading">Real-time prices with live WebSocket updates</p>
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
          <div className="markets-container">
            <div className="markets-card">
              <h2 className="markets-title">Markets</h2>

              <div className="markets-tabs">
                <button
                  className={`markets-tab ${!showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(false)}
                >
                  All
                </button>
                <button
                  className={`markets-tab ${showFavoritesOnly ? 'active' : ''}`}
                  onClick={() => setShowFavoritesOnly(true)}
                >
                  ★ Favorites
                </button>
              </div>

              <div className="markets-search">
                <input
                  type="text"
                  placeholder="Search by name or symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <TickerTable
                tickers={displayTickers}
                isLoading={isLoading}
                onSymbolClick={setSelectedSymbol}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
                searchQuery={searchQuery}
              />

              <div className="markets-footer">
                Data from mock server · See server/README.md
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
