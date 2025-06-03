
import { useState, useCallback, useEffect } from 'react';

interface RecentlyViewedItem {
  id: string;
  name: string;
  visitedAt: Date;
}

export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('component-recently-viewed');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed.map((item: any) => ({
          ...item,
          visitedAt: new Date(item.visitedAt)
        })));
      } catch (error) {
        console.error('Failed to parse recently viewed:', error);
      }
    }
  }, []);

  const addRecentlyViewed = useCallback((componentId: string, componentName: string) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item.id !== componentId);
      const updated = [
        { id: componentId, name: componentName, visitedAt: new Date() },
        ...filtered
      ].slice(0, 20); // Keep only 20 most recent

      localStorage.setItem('component-recently-viewed', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    localStorage.removeItem('component-recently-viewed');
  }, []);

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed
  };
};
