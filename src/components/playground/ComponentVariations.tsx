import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Palette, Star, Settings, Trash2 } from 'lucide-react';
import { ComponentVariation } from '@/hooks/useComponentVariations';

interface ComponentVariationsProps {
  variations: ComponentVariation[];
  activeVariation: string | null;
  onVariationSelect: (variation: ComponentVariation) => void;
  onVariationRemove?: (id: string) => void;
}

const categoryColors = {
  default: 'bg-blue-500/10 text-blue-700 border-blue-200',
  state: 'bg-green-500/10 text-green-700 border-green-200',
  size: 'bg-orange-500/10 text-orange-700 border-orange-200',
  style: 'bg-purple-500/10 text-purple-700 border-purple-200',
  custom: 'bg-gray-500/10 text-gray-700 border-gray-200'
};

const categoryIcons = {
  default: Star,
  state: Settings,
  size: Settings,
  style: Palette,
  custom: Star
};

export const ComponentVariations: React.FC<ComponentVariationsProps> = ({
  variations,
  activeVariation,
  onVariationSelect,
  onVariationRemove
}) => {
  const groupedVariations = variations.reduce((acc, variation) => {
    if (!acc[variation.category]) {
      acc[variation.category] = [];
    }
    acc[variation.category].push(variation);
    return acc;
  }, {} as Record<string, ComponentVariation[]>);

  if (variations.length === 0) {
    return (
      <Card className="glass-card backdrop-blur-md border-border/20">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Palette className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center text-sm">
            No variations available for this component
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Component Variations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {Object.entries(groupedVariations).map(([category, categoryVariations]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium capitalize text-muted-foreground">
                      {category}
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {categoryVariations.map((variation) => (
                      <div
                        key={variation.id}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-all duration-200
                          ${activeVariation === variation.id 
                            ? 'bg-primary/10 border-primary/30 shadow-sm' 
                            : 'bg-muted/20 border-border/20 hover:bg-muted/40'
                          }
                        `}
                        onClick={() => onVariationSelect(variation)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-sm font-medium">{variation.name}</h5>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${categoryColors[variation.category]}`}
                              >
                                {variation.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {variation.description}
                            </p>
                          </div>
                          {variation.category === 'custom' && onVariationRemove && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onVariationRemove(variation.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {category !== Object.keys(groupedVariations)[Object.keys(groupedVariations).length - 1] && (
                    <Separator className="mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};