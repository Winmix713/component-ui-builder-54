
import React from 'react';
import { Button } from '@/components/ui/button';

export const SkipNavigation: React.FC = () => {
  const skipToMain = () => {
    const mainContent = document.getElementById('main-content') || document.querySelector('main');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  const skipToNav = () => {
    const navigation = document.getElementById('navigation') || document.querySelector('nav');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView();
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:top-2 focus-within:left-2 focus-within:z-50 focus-within:bg-background focus-within:p-2 focus-within:rounded-md focus-within:border focus-within:shadow-lg">
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={skipToMain}
          className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={skipToNav}
          className="focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to navigation
        </Button>
      </div>
    </div>
  );
};
