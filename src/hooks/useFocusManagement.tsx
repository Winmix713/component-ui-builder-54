
import { useEffect, useRef, useCallback } from 'react';

interface FocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export const useFocusManagement = (options: FocusManagementOptions = {}) => {
  const { trapFocus = false, restoreFocus = false, autoFocus = false } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(containerRef.current.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!trapFocus || event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [trapFocus, getFocusableElements]);

  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement;
    }

    if (autoFocus && containerRef.current) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (trapFocus) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      
      if (restoreFocus && previousActiveElement.current) {
        (previousActiveElement.current as HTMLElement).focus();
      }
    };
  }, [trapFocus, autoFocus, restoreFocus, handleKeyDown, getFocusableElements]);

  return {
    containerRef,
    focusFirst: () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    },
    focusLast: () => {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
    }
  };
};
