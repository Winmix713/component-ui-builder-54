
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
    updateCode(initialCode);
    updateProps({});
    clearErrors();
    announceToScreenReader('Playground reset to initial state');
    toast({
      title: "Reset successful",
      description: "Playground has been reset to initial state",
    });
  }, [initialCode, updateCode, updateProps, clearErrors, announceToScreenReader]);

  const handleRun = useCallback(() => {
    setRunning(true);
    clearErrors();
    announceToScreenReader('Running component code');
    
    setTimeout(() => {
      setRunning(false);
      announceToScreenReader('Component code execution completed');
    }, 500);
  }, [setRunning, clearErrors, announceToScreenReader]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(state.code);
    announceToScreenReader('Code copied to clipboard');
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
    });
  }, [state.code, announceToScreenReader]);

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
    updateProps(variation.props);
    const generatedCode = generateCodeFromProps(componentType, variation.props, initialCode);
    updateCode(generatedCode);
    announceToScreenReader(`Applied ${variation.name} variation`);
    toast({
      title: "Variation applied",
      description: `${variation.name} variation has been applied`,
    });
  }, [componentType, initialCode, updateCode, updateProps, announceToScreenReader]);

  const handleRenderError = useCallback((error: Error) => {
    addError(error);
    console.error('Render error:', error);
    announceToScreenReader('Component render error occurred');
  }, [addError, announceToScreenReader]);

  const handleFormat = useCallback(() => {
    // Basic code formatting - in a real app, you might use Prettier API
    try {
      const formatted = state.code
        .replace(/;\s*\n/g, ';\n')
        .replace(/{\s*\n/g, '{\n  ')
        .replace(/\n\s*}/g, '\n}');
      updateCode(formatted);
      announceToScreenReader('Code formatted');
      toast({
        title: "Code formatted",
        description: "Code has been formatted",
      });
    } catch (error) {
      console.error('Format error:', error);
    }
  }, [state.code, updateCode, announceToScreenReader]);

  return {
    handleCodeChange,
    handlePropsChange,
    handleReset,
    handleRun,
    handleCopy,
    handleSaveAsVariation,
    handleVariationSelect,
    handleRenderError,
    handleFormat
  };
};
