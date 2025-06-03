
import { useState, useCallback, useEffect } from 'react';

interface FavoriteItem {
  title: string;
  href: string;
  category: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('component-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
  }, []);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.href === item.href);
      const updated = isAlreadyFavorite
        ? prev.filter(fav => fav.href !== item.href)
        : [...prev, item];

      localStorage.setItem('component-favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((href: string) => {
    return favorites.some(fav => fav.href === href);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem('component-favorites');
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
};
