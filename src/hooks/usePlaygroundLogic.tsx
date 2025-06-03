import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { usePerformanceMonitor } from '@/hooks/usePerformance';
import { useFocusManagement } from '@/hooks/useFocusManagement';
import { useComponentVariations } from '@/hooks/useComponentVariations';
import { usePlaygroundState } from '@/hooks/usePlaygroundState';
import { usePlaygroundActions } from '@/hooks/usePlaygroundActions';
import { usePlaygroundShortcuts } from '@/hooks/useKeyboardShortcuts';
import { toast } from '@/hooks/use-toast';
import { generateCodeFromProps } from '@/utils/codeGeneration';

interface UsePlaygroundLogicProps {
  componentType: string;
  title: string;
  initialCode: string;
}

interface PlaygroundState {
  code: string;
  props: Record<string, any>;
  isRunning: boolean;
  errors: string[];
  isEditorReady: boolean;
}

export const usePlaygroundLogic = ({ componentType, title, initialCode }: UsePlaygroundLogicProps) => {
  const [state, setState] = useState<PlaygroundState>(() => ({
    code: initialCode,
    props: {},
    isRunning: false,
    errors: [],
    isEditorReady: false
  }));

  // Memoized selectors to prevent unnecessary re-renders
  const memoizedState = useMemo(() => ({
    code: state.code,
    props: state.props,
    isRunning: state.isRunning,
    errors: state.errors,
    isEditorReady: state.isEditorReady,
    errorCount: state.errors.length
  }), [state]);

  usePerformanceMonitor('ComponentPlayground');
  const { containerRef } = useFocusManagement({ autoFocus: false });

  const {
    updateCode: updatePlaygroundStateCode,
    updateProps: updatePlaygroundStateProps,
    setRunning: setPlaygroundStateRunning,
    setLoading,
    addRenderError,
    clearRenderErrors,
    setExecutionTime,
    reset
  } = usePlaygroundState(initialCode);


  const {
    variations,
    activeVariation,
    setActiveVariation,
    addCustomVariation,
    removeVariation
  } = useComponentVariations(componentType);

  const updateCode = useCallback((newCode: string) => {
    setState(prev => prev.code !== newCode ? { ...prev, code: newCode } : prev);
  }, []);

  const updateProps = useCallback((newProps: Record<string, any>) => {
    setState(prev => {
      const hasChanged = JSON.stringify(prev.props) !== JSON.stringify(newProps);
      return hasChanged ? { ...prev, props: newProps } : prev;
    });
  }, []);

  const addError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      errors: prev.errors.includes(error) ? prev.errors : [...prev.errors, error]
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => prev.errors.length > 0 ? { ...prev, errors: [] } : prev);
  }, []);

  const setRunning = useCallback((running: boolean) => {
    setState(prev => prev.isRunning !== running ? { ...prev, isRunning: running } : prev);
  }, []);

  const setEditorReady = useCallback((ready: boolean) => {
    setState(prev => prev.isEditorReady !== ready ? { ...prev, isEditorReady: ready } : prev);
  }, []);

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
    updateCode: updatePlaygroundStateCode,
    updateProps: updatePlaygroundStateProps,
    setRunning: setPlaygroundStateRunning,
    clearRenderErrors,
    setExecutionTime,
    addCustomVariation,
    reset
  });

  const handleRenderError = useCallback((error: Error) => {
    addRenderError(error);
  }, [addRenderError]);

  const handleFormat = useCallback(() => {
    const formatted = state.code
      .split('\n')
      .map(line => line.trim())
      .join('\n');
    updateCode(formatted);
  }, [state.code, updateCode]);

  const handleVariationSelectWithActiveState = useCallback((variation: any) => {
    setActiveVariation(variation.id);
    handleVariationSelect(variation);
  }, [setActiveVariation, handleVariationSelect]);

  // Set up keyboard shortcuts
  usePlaygroundShortcuts({
    onRun: handleRun,
    onCopy: handleCopy,
    onReset: handleReset,
  });

  return useMemo(() => ({
    ...memoizedState,
    updateCode,
    updateProps,
    addError,
    clearErrors,
    setRunning,
    setEditorReady,
    containerRef,
    variations,
    activeVariation,
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
  }), [memoizedState, updateCode, updateProps, addError, clearErrors, setRunning, setEditorReady, containerRef, variations, activeVariation, handleCodeChange, handlePropsChange, handleReset, handleRun, handleCopy, handleSaveAsVariation, handleVariationSelectWithActiveState, handleRenderError, handleFormat, removeVariation]);
};