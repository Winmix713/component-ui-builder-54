
import { useRef } from 'react';
import { usePlaygroundState } from './usePlaygroundState';
import { usePlaygroundActions } from './usePlaygroundActions';
import { useComponentVariations } from './useComponentVariations';
import { useFocusManagement } from './useFocusManagement';
import { usePerformanceMonitor } from './usePerformance';

interface UsePlaygroundLogicProps {
  componentType: string;
  title: string;
  initialCode: string;
}

export const usePlaygroundLogic = ({ componentType, title, initialCode }: UsePlaygroundLogicProps) => {
  usePerformanceMonitor(`ComponentPlayground-${componentType}`);

  const containerRef = useRef<HTMLDivElement>(null);
  const { state, updateCode, updateProps, setRunning, addError, clearErrors } = usePlaygroundState({
    componentType,
    initialCode
  });

  const { variations, activeVariation, variationHandlers } = useComponentVariations(componentType);

  const handlers = usePlaygroundActions({
    state,
    updateCode,
    updateProps,
    setRunning,
    addError,
    clearErrors,
    componentType,
    initialCode,
    variations,
    variationHandlers
  });

  useFocusManagement(containerRef);

  const handleVariationSelectWithActiveState = (variation: any) => {
    variationHandlers.setActiveVariation(variation.id);
    handlers.handleVariationSelect(variation);
  };

  return {
    state,
    handlers: {
      ...handlers,
      handleVariationSelectWithActiveState
    },
    variations,
    activeVariation,
    variationHandlers,
    containerRef
  };
};
