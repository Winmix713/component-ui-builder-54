
import { useState } from 'react';

export interface PlaygroundState {
  code: string;
  props: Record<string, any>;
  isRunning: boolean;
  isLoading: boolean;
  renderErrors: Error[];
  lastExecutionTime: number;
}

export const usePlaygroundState = (initialCode: string) => {
  const [state, setState] = useState<PlaygroundState>({
    code: initialCode,
    props: {},
    isRunning: false,
    isLoading: false,
    renderErrors: [],
    lastExecutionTime: 0
  });

  const updateCode = (newCode: string) => {
    setState(prev => ({ ...prev, code: newCode }));
  };

  const updateProps = (newProps: Record<string, any>) => {
    setState(prev => ({ ...prev, props: newProps }));
  };

  const setRunning = (isRunning: boolean) => {
    setState(prev => ({ ...prev, isRunning }));
  };

  const setLoading = (isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading }));
  };

  const addRenderError = (error: Error) => {
    setState(prev => ({ 
      ...prev, 
      renderErrors: [...prev.renderErrors, error] 
    }));
  };

  const clearRenderErrors = () => {
    setState(prev => ({ ...prev, renderErrors: [] }));
  };

  const setExecutionTime = (time: number) => {
    setState(prev => ({ ...prev, lastExecutionTime: time }));
  };

  const reset = () => {
    setState({
      code: initialCode,
      props: {},
      isRunning: false,
      isLoading: false,
      renderErrors: [],
      lastExecutionTime: 0
    });
  };

  return {
    state,
    updateCode,
    updateProps,
    setRunning,
    setLoading,
    addRenderError,
    clearRenderErrors,
    setExecutionTime,
    reset
  };
};
