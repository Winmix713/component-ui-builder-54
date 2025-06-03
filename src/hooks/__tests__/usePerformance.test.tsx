
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePerformanceMonitor, useWebVitals } from '../usePerformance';

describe('Performance Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  describe('usePerformanceMonitor', () => {
    it('monitors component render time', () => {
      const { unmount } = renderHook(() => usePerformanceMonitor('TestComponent'));
      
      // Simulate slow render
      vi.spyOn(performance, 'now')
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(150);
      
      unmount();
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('TestComponent took')
      );
    });
  });

  describe('useWebVitals', () => {
    it('sets up performance observer when available', () => {
      const mockObserver = {
        observe: vi.fn(),
        disconnect: vi.fn()
      };
      
      vi.stubGlobal('PerformanceObserver', vi.fn(() => mockObserver));
      
      const { unmount } = renderHook(() => useWebVitals());
      
      expect(mockObserver.observe).toHaveBeenCalled();
      
      unmount();
      expect(mockObserver.disconnect).toHaveBeenCalled();
    });
  });
});
