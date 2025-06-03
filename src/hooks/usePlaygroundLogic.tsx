import React, { useState, useEffect, useCallback } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformance';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import { useComponentVariations } from '@/hooks/useComponentVariations';
import { usePlaygroundState } from '@/hooks/usePlaygroundState';
import { usePlaygroundActions } from '@/hooks/usePlaygroundActions';
import { usePlaygroundShortcuts } from '@/hooks/useKeyboardShortcuts';

interface UsePlaygroundLogicProps {
  componentType: string;
  initialCode: string;
  title: string;
}

export const usePlaygroundLogic = ({
  componentType,
  initialCode,
  title
}: UsePlaygroundLogicProps) => {
  console.log('usePlaygroundLogic: Initializing with', { componentType, title, initialCodeLength: initialCode.length });

  usePerformanceMonitor('ComponentPlayground');
  const { containerRef } = useFocusManagement({ autoFocus: false });

  const {
    state,
    updateCode,
    updateProps,
    setRunning,
    setLoading,
    addRenderError,
    clearRenderErrors,
    setExecutionTime,
    reset
  } = usePlaygroundState(initialCode);

  console.log('usePlaygroundLogic: Current state', { 
    codeLength: state.code.length, 
    propsCount: Object.keys(state.props).length,
    isRunning: state.isRunning,
    errorCount: state.renderErrors.length
  });

  const {
    variations,
    activeVariation,
    setActiveVariation,
    addCustomVariation,
    removeVariation
  } = useComponentVariations(componentType);

  const {
    handleCodeChange,
    handlePropsChange,
    handleReset,
    handleRun,
    handleCopy,
    handleSaveAsVariation,
    handleVariationSelect
  } = usePlaygroundActions({
    componentType,
    initialCode,
    state,
    updateCode,
    updateProps,
    setRunning,
    clearRenderErrors,
    setExecutionTime,
    addCustomVariation,
    reset
  });

  const handleRenderError = useCallback((error: Error) => {
    console.log('usePlaygroundLogic: Render error occurred', error.message);
    addRenderError(error);
  }, [addRenderError]);

  const handleFormat = useCallback(() => {
    console.log('usePlaygroundLogic: Formatting code');
    const formatted = state.code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    updateCode(formatted);
  }, [state.code, updateCode]);

  const handleVariationSelectWithActiveState = useCallback((variation: any) => {
    console.log('usePlaygroundLogic: Selecting variation', variation.name);
    setActiveVariation(variation.id);
    handleVariationSelect(variation);
  }, [setActiveVariation, handleVariationSelect]);

  // Set up keyboard shortcuts
  usePlaygroundShortcuts({
    onRun: handleRun,
    onCopy: handleCopy,
    onReset: handleReset,
  });

  return {
    state,
    variations,
    activeVariation,
    containerRef,
    handlers: {
      handleCodeChange,
      handlePropsChange,
      handleReset,
      handleRun,
      handleCopy,
      handleSaveAsVariation,
      handleVariationSelectWithActiveState,
      handleRenderError,
      handleFormat
    },
    variationHandlers: {
      removeVariation
    }
  };
};