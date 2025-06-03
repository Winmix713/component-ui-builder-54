
import { useState, useCallback, useEffect } from 'react';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

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

  const toggleFavorite = useCallback((componentId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId];

      localStorage.setItem('component-favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((componentId: string) => {
    return favorites.includes(componentId);
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
