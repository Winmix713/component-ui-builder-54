
import { useCallback } from 'react';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { toast } from '@/hooks/use-toast';
import { generateCodeFromProps } from '@/utils/codeGeneration';

interface UsePlaygroundActionsProps {
  componentType: string;
  initialCode: string;
  state: any;
  updateCode: (code: string) => void;
  updateProps: (props: Record<string, any>) => void;
  setRunning: (running: boolean) => void;
  clearRenderErrors: () => void;
  setExecutionTime: (time: number) => void;
  addCustomVariation: (variation: any) => void;
  reset: () => void;
}

export const usePlaygroundActions = ({
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
}: UsePlaygroundActionsProps) => {
  const { announceToScreenReader } = useAccessibility();

  const handleCodeChange = useCallback((newCode: string | undefined) => {
    if (newCode !== undefined) {
      updateCode(newCode);
      announceToScreenReader('Code updated');
    }
  }, [updateCode, announceToScreenReader]);

  const handlePropsChange = useCallback((newProps: Record<string, any>) => {
    updateProps(newProps);
    const generatedCode = generateCodeFromProps(componentType, newProps, initialCode);
    updateCode(generatedCode);
    announceToScreenReader('Component props updated');
  }, [componentType, initialCode, updateCode, updateProps, announceToScreenReader]);

  const handleReset = useCallback(() => {
    reset();
    announceToScreenReader('Playground reset to initial state');
    toast({
      title: "Reset successful",
      description: "Playground has been reset to initial state",
    });
  }, [reset, announceToScreenReader]);

  const handleRun = useCallback(() => {
    const startTime = performance.now();
    setRunning(true);
    clearRenderErrors();
    announceToScreenReader('Running component code');
    
    setTimeout(() => {
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setRunning(false);
      announceToScreenReader('Component code execution completed');
    }, 500);
  }, [setRunning, clearRenderErrors, setExecutionTime, announceToScreenReader]);

  const handleCopy = useCallback(() => {
    announceToScreenReader('Code copied to clipboard');
  }, [announceToScreenReader]);

  const handleSaveAsVariation = useCallback(() => {
    const name = prompt('Enter variation name:');
    if (name) {
      addCustomVariation({
        name,
        description: `Custom ${name} variation`,
        props: state.props,
        category: 'custom'
      });
      toast({
        title: "Variation saved",
        description: `${name} variation has been saved`,
      });
    }
  }, [addCustomVariation, state.props]);

  const handleVariationSelect = useCallback((variation: any) => {
    updateProps(variation.props);
    const generatedCode = generateCodeFromProps(componentType, variation.props, initialCode);
    updateCode(generatedCode);
    announceToScreenReader(`Applied ${variation.name} variation`);
    toast({
      title: "Variation applied",
      description: `${variation.name} variation has been applied`,
    });
  }, [componentType, initialCode, updateCode, updateProps, announceToScreenReader]);

  return {
    handleCodeChange,
    handlePropsChange,
    handleReset,
    handleRun,
    handleCopy,
    handleSaveAsVariation,
    handleVariationSelect
  };
};
