import { useMemo, memo } from 'react';
import type { CryptoData } from '../types';
import { useTickerStream } from '../hooks/useTickerStream';
import { SYMBOL_NAMES } from '../config';

export interface MarketsTableProps {
  symbols?: string[];
}

export function MarketsTableComponent({ symbols = [] }: MarketsTableProps) {
  const { tickers } = useTickerStream(symbols);

  const tickersList = useMemo(() => {
    return Object.values(tickers).sort((a, b) =>
      SYMBOL_NAMES[a.symbol].localeCompare(SYMBOL_NAMES[b.symbol])
    );
  }, [tickers]);

  return (
    <div className="markets-table">
      <h2>Markets</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {tickersList.map((ticker) => (
              <tr key={ticker.symbol}>
                <td>{ticker.symbol}</td>
                <td>${ticker.last_price.toFixed(2)}</td>
                <td className={ticker.change_24h_percent! >= 0 ? 'positive' : 'negative'}>
                  {ticker.change_24h_percent?.toFixed(2)}%
                </td>
                <td>{ticker.volume_24h.tolocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const MarketsTable = memo(MarketsTableComponent);

