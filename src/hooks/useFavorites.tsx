
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'component-favorites';

export interface FavoriteItem {
  title: string;
  href: string;
  category: string;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites:', error);
      }
    }
  }, []);

  const addFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    const newFavorite: FavoriteItem = {
      ...item,
      addedAt: Date.now()
    };

    setFavorites(prev => {
      if (prev.some(fav => fav.href === newFavorite.href)) {
        return prev; // Already in favorites
      }
      const newFavorites = [...prev, newFavorite];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const removeFavorite = (href: string) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.href !== href);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (href: string) => {
    return favorites.some(fav => fav.href === href);
  };

  const toggleFavorite = (item: Omit<FavoriteItem, 'addedAt'>) => {
    if (isFavorite(item.href)) {
      removeFavorite(item.href);
    } else {
      addFavorite(item);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };
}
