
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Clock, Star, Zap } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

interface QuickComponent {
  id: string;
  name: string;
  category: string;
  usage: number;
  rating: number;
}

const topRatedComponents: QuickComponent[] = [
  { id: 'button', name: 'Button', category: 'Form', usage: 98, rating: 4.9 },
  { id: 'card', name: 'Card', category: 'Layout', usage: 87, rating: 4.8 },
  { id: 'dialog', name: 'Dialog', category: 'Overlay', usage: 76, rating: 4.7 }
];

export const QuickActionsPanel: React.FC = () => {
  const { favorites } = useFavorites();
  const { recentItems } = useRecentlyViewed();

  const handleComponentClick = (componentId: string) => {
    window.location.href = `/components/${componentId}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Favorites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Heart className="h-4 w-4 text-red-500" />
            <span>Favorites</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {favorites.slice(0, 3).map((fav) => (
            <Button
              key={fav.href}
              variant="ghost"
              size="sm"
              onClick={() => handleComponentClick(fav.href.split('/').pop() || '')}
              className="w-full justify-start"
            >
              <span className="truncate">{fav.title}</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {fav.category}
              </Badge>
            </Button>
          ))}
          {favorites.length === 0 && (
            <p className="text-sm text-muted-foreground">No favorites yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-blue-500" />
            <span>Recently Viewed</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentItems.slice(0, 3).map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              onClick={() => handleComponentClick(item.href.split('/').pop() || '')}
              className="w-full justify-start"
            >
              <span className="truncate">{item.title}</span>
              <Badge variant="outline" className="ml-auto text-xs">
                {item.category}
              </Badge>
            </Button>
          ))}
          {recentItems.length === 0 && (
            <p className="text-sm text-muted-foreground">No recent items</p>
          )}
        </CardContent>
      </Card>

      {/* Top Rated */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-sm">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>Top Rated</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topRatedComponents.map((component) => (
            <Button
              key={component.id}
              variant="ghost"
              size="sm"
              onClick={() => handleComponentClick(component.id)}
              className="w-full justify-between"
            >
              <span className="truncate">{component.name}</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                <span className="text-xs">{component.rating}</span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
