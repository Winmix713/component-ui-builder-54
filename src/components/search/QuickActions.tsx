
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, Heart, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  title: string;
  href: string;
  category: string;
  description?: string;
}

interface QuickActionsProps {
  result: SearchResult;
  onNavigate: (result: SearchResult) => void;
  onAddToFavorites?: (result: SearchResult) => void;
  isFavorite?: boolean;
}

export function QuickActions({ result, onNavigate, onAddToFavorites, isFavorite }: QuickActionsProps) {
  const { toast } = useToast();

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(window.location.origin + result.href);
      toast({
        title: "Link copied",
        description: `Link to ${result.title} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToFavorites?.(result);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${result.title} ${isFavorite ? 'removed from' : 'added to'} your favorites`,
    });
  };

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={handleCopyLink}
        title="Copy link"
      >
        <Copy className="h-3 w-3" />
      </Button>
      
      {onAddToFavorites && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={handleAddToFavorites}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
        </Button>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(result);
        }}
        title="Open in new tab"
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  );
}
