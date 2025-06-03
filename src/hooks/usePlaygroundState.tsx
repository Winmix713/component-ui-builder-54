
import { useState, useCallback, useMemo } from 'react';

interface PlaygroundState {
  code: string;
  props: Record<string, any>;
  isRunning: boolean;
  isLoading: boolean;
  renderErrors: Error[];
  lastExecutionTime: number | null;
  isEditorReady: boolean;
}

interface UsePlaygroundStateProps {
  componentType: string;
  initialCode: string;
}

export const usePlaygroundState = ({ componentType, initialCode }: UsePlaygroundStateProps) => {
  const [state, setState] = useState<PlaygroundState>(() => ({
    code: initialCode,
    props: {},
    isRunning: false,
    isLoading: false,
    renderErrors: [],
    lastExecutionTime: null,
    isEditorReady: false
  }));

  const updateCode = useCallback((code: string) => {
    setState(prev => ({ ...prev, code }));
  }, []);

  const updateProps = useCallback((props: Record<string, any>) => {
    setState(prev => ({ ...prev, props }));
  }, []);

  const setRunning = useCallback((isRunning: boolean) => {
    setState(prev => ({
      ...prev,
      isRunning,
      lastExecutionTime: isRunning ? null : Date.now()
    }));
  }, []);

  const addError = useCallback((error: Error) => {
    setState(prev => ({
      ...prev,
      renderErrors: [...prev.renderErrors, error]
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, renderErrors: [] }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  }, []);

  const setEditorReady = useCallback((isEditorReady: boolean) => {
    setState(prev => ({ ...prev, isEditorReady }));
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      ...prev,
      code: initialCode,
      props: {},
      renderErrors: [],
      isRunning: false
    }));
  }, [initialCode]);

  const actions = useMemo(() => ({
    updateCode,
    updateProps,
    setRunning,
    addError,
    clearErrors,
    setLoading,
    setEditorReady,
    reset
  }), [updateCode, updateProps, setRunning, addError, clearErrors, setLoading, setEditorReady, reset]);

  return {
    state,
    ...actions
  };
};
