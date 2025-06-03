
import React, { createContext, useContext, useState, useCallback } from 'react';

interface AccessibilityContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  announcements: string[];
  reducedMotion: boolean;
  highContrast: boolean;
  setReducedMotion: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [reducedMotion, setReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [highContrast, setHighContrast] = useState(false);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message]);
    
    // Clean up old announcements after a delay
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(announcement => announcement !== message));
    }, 1000);
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    announceToScreenReader,
    announcements,
    reducedMotion,
    highContrast,
    setReducedMotion,
    setHighContrast,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      {/* Screen reader announcement region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcements.map((announcement, index) => (
          <div key={index}>{announcement}</div>
        ))}
      </div>
    </AccessibilityContext.Provider>
  );
};
