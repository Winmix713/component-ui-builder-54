
import { useCallback, useMemo } from 'react';
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
  addError: (error: Error) => void;
  clearErrors: () => void;
  variations: any[];
  variationHandlers: any;
}

export const usePlaygroundActions = ({
  componentType,
  initialCode,
  state,
  updateCode,
  updateProps,
  setRunning,
  addError,
  clearErrors,
  variations,
  variationHandlers
}: UsePlaygroundActionsProps) => {
  const { announceToScreenReader } = useAccessibility();

  // Memoize stable values to prevent unnecessary re-renders
  const stableActions = useMemo(() => ({
    componentType,
    initialCode,
    updateCode,
    updateProps,
    setRunning,
    addError,
    clearErrors,
    announceToScreenReader
  }), [componentType, initialCode, updateCode, updateProps, setRunning, addError, clearErrors, announceToScreenReader]);

  const handleCodeChange = useCallback((newCode: string | undefined) => {
    if (newCode !== undefined && newCode !== state.code) {
      stableActions.updateCode(newCode);
      stableActions.announceToScreenReader('Code updated');
    }
  }, [state.code, stableActions]);

  const handlePropsChange = useCallback((newProps: Record<string, any>) => {
    if (JSON.stringify(newProps) !== JSON.stringify(state.props)) {
      stableActions.updateProps(newProps);
      const generatedCode = generateCodeFromProps(stableActions.componentType, newProps, stableActions.initialCode);
      stableActions.updateCode(generatedCode);
      stableActions.announceToScreenReader('Component props updated');
    }
  }, [state.props, stableActions]);

  const handleReset = useCallback(() => {
    stableActions.updateCode(stableActions.initialCode);
    stableActions.updateProps({});
    stableActions.clearErrors();
    stableActions.announceToScreenReader('Playground reset to initial state');
    toast({
      title: "Reset successful",
      description: "Playground has been reset to initial state",
    });
  }, [stableActions]);

  const handleRun = useCallback(() => {
    stableActions.setRunning(true);
    stableActions.clearErrors();
    stableActions.announceToScreenReader('Running component code');
    
    setTimeout(() => {
      stableActions.setRunning(false);
      stableActions.announceToScreenReader('Component code execution completed');
    }, 500);
  }, [stableActions]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(state.code);
    stableActions.announceToScreenReader('Code copied to clipboard');
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    });
  }, [state.code, stableActions]);

  const handleSaveAsVariation = useCallback(() => {
    const name = prompt('Enter variation name:');
    if (name) {
      variationHandlers.addCustomVariation({
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
  }, [variationHandlers, state.props]);

  const handleVariationSelect = useCallback((variation: any) => {
    stableActions.updateProps(variation.props);
    const generatedCode = generateCodeFromProps(stableActions.componentType, variation.props, stableActions.initialCode);
    stableActions.updateCode(generatedCode);
    stableActions.announceToScreenReader(`Applied ${variation.name} variation`);
    toast({
      title: "Variation applied",
      description: `${variation.name} variation has been applied`,
    });
  }, [stableActions]);

  const handleRenderError = useCallback((error: Error) => {
    stableActions.addError(error);
    console.error('Render error:', error);
    stableActions.announceToScreenReader('Component render error occurred');
  }, [stableActions]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = state.code
        .replace(/;\s*\n/g, ';\n')
        .replace(/{\s*\n/g, '{\n  ')
        .replace(/\n\s*}/g, '\n}');
      
      if (formatted !== state.code) {
        stableActions.updateCode(formatted);
        stableActions.announceToScreenReader('Code formatted');
        toast({
          title: "Code formatted",
          description: "Code has been formatted",
        });
      }
    } catch (error) {
      console.error('Format error:', error);
    }
  }, [state.code, stableActions]);

  // Return memoized handlers to prevent unnecessary re-renders
  return useMemo(() => ({
    handleCodeChange,
    handlePropsChange,
    handleReset,
    handleRun,
    handleCopy,
    handleSaveAsVariation,
    handleVariationSelect,
    handleRenderError,
    handleFormat
  }), [
    handleCodeChange,
    handlePropsChange,
    handleReset,
    handleRun,
    handleCopy,
    handleSaveAsVariation,
    handleVariationSelect,
    handleRenderError,
    handleFormat
  ]);
};
