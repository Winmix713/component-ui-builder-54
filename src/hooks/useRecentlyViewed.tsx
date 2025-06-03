
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const RECENTLY_VIEWED_KEY = 'recently-viewed-components';
const MAX_RECENT_ITEMS = 8;

export interface RecentlyViewedItem {
  title: string;
  href: string;
  category: string;
  timestamp: number;
}

export function useRecentlyViewed() {
  const [recentItems, setRecentItems] = useState<RecentlyViewedItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const savedItems = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (savedItems) {
      try {
        setRecentItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Failed to parse recently viewed items:', error);
      }
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    
    // Only track component pages
    if (path.startsWith('/components/')) {
      const componentName = path.split('/components/')[1];
      if (componentName) {
        addRecentItem({
          title: componentName.charAt(0).toUpperCase() + componentName.slice(1),
          href: path,
          category: 'Components',
          timestamp: Date.now()
        });
      }
    }
  }, [location.pathname]);

  const addRecentItem = (item: Omit<RecentlyViewedItem, 'timestamp'>) => {
    const newItem: RecentlyViewedItem = {
      ...item,
      timestamp: Date.now()
    };

    setRecentItems(prev => {
      const filtered = prev.filter(existing => existing.href !== newItem.href);
      const newItems = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearRecent = () => {
    setRecentItems([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  };

  return {
    recentItems,
    addRecentItem,
    clearRecent
  };
}
