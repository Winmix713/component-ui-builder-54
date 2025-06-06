
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Palette, RotateCcw, Check } from 'lucide-react';
import { useThemeTokens } from '@/hooks/useThemeTokens';
import { ThemeVariation } from '@/tokens/design-tokens';

export const ThemeBrowser: React.FC = () => {
  const { 
    currentVariation, 
    setThemeVariation, 
    availableVariations, 
    resetToDefault 
  } = useThemeTokens();

  const handleVariationClick = (variation: ThemeVariation) => {
    if (currentVariation === variation) {
      resetToDefault();
    } else {
      setThemeVariation(variation);
    }
  };

  const getVariationPreview = (variation: ThemeVariation) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500', 
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
    };
    return colors[variation] || 'bg-primary';
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-2">
        <Palette className="h-5 w-5" />
        <CardTitle className="text-lg">Theme Browser</CardTitle>
        {currentVariation && (
          <Badge variant="secondary" className="ml-auto">
            {currentVariation}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {availableVariations.map((variation) => (
            <Button
              key={variation}
              variant={currentVariation === variation ? "default" : "outline"}
              size="sm"
              onClick={() => handleVariationClick(variation)}
              className="flex items-center gap-2"
            >
              <div className={`w-3 h-3 rounded-full ${getVariationPreview(variation)}`} />
              <span className="capitalize">{variation}</span>
              {currentVariation === variation && <Check className="h-3 w-3" />}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToDefault}
            disabled={!currentVariation}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-3 w-3" />
            Reset to Default
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Current theme: <strong>{currentVariation || 'Default'}</strong></p>
          <p>Click a color to apply theme variation, click again to remove.</p>
        </div>
      </CardContent>
    </Card>
  );
};
