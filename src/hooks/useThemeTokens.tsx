
import { useState, useEffect, useCallback } from 'react';
import { ThemeVariation, themeVariations } from '@/tokens/design-tokens';

interface UseThemeTokensReturn {
  currentVariation: ThemeVariation | null;
  setThemeVariation: (variation: ThemeVariation | null) => void;
  availableVariations: ThemeVariation[];
  applyThemeVariation: (variation: ThemeVariation | null) => void;
  resetToDefault: () => void;
}

export const useThemeTokens = (): UseThemeTokensReturn => {
  const [currentVariation, setCurrentVariation] = useState<ThemeVariation | null>(null);

  const availableVariations = Object.keys(themeVariations) as ThemeVariation[];

  const applyThemeVariation = useCallback((variation: ThemeVariation | null) => {
    const root = document.documentElement;
    
    // Reset to default first
    Object.keys(themeVariations).forEach((key) => {
      root.style.removeProperty(`--${key}`);
    });
    
    // Apply new variation if provided
    if (variation && themeVariations[variation]) {
      Object.entries(themeVariations[variation]).forEach(([property, value]) => {
        root.style.setProperty(`--${property}`, value);
      });
    }
    
    setCurrentVariation(variation);
    
    // Store preference
    if (variation) {
      localStorage.setItem('theme-variation', variation);
    } else {
      localStorage.removeItem('theme-variation');
    }
  }, []);

  const setThemeVariation = useCallback((variation: ThemeVariation | null) => {
    applyThemeVariation(variation);
  }, [applyThemeVariation]);

  const resetToDefault = useCallback(() => {
    applyThemeVariation(null);
  }, [applyThemeVariation]);

  // Load saved theme variation on mount
  useEffect(() => {
    const savedVariation = localStorage.getItem('theme-variation') as ThemeVariation | null;
    if (savedVariation && availableVariations.includes(savedVariation)) {
      applyThemeVariation(savedVariation);
    }
  }, [applyThemeVariation, availableVariations]);

  return {
    currentVariation,
    setThemeVariation,
    availableVariations,
    applyThemeVariation,
    resetToDefault,
  };
};
