import { useCallback, useEffect, useState } from 'react';
import { FAVORITES_STORAGE_KEY } from '../config';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return new Set(stored ? JSON.parse(stored) : []);
    } catch {
      return new Set();
    }
  });

  const toggleFavorite = useCallback((symbol: string) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(symbol)) {
        updated.delete(symbol);
      } else {
        updated.add(symbol);
      }
      // Persist to localStorage
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(updated)));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
      return updated;
    });
  }, []);

  const isFavorite = useCallback((symbol: string) => {
    return favorites.has(symbol);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
