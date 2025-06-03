
import { useState, useCallback } from 'react';

export interface ComponentVariation {
  id: string;
  name: string;
  description: string;
  props: Record<string, any>;
  category: 'default' | 'state' | 'size' | 'style' | 'custom';
}

interface UseComponentVariationsReturn {
  variations: ComponentVariation[];
  activeVariation: string | null;
  setActiveVariation: (id: string | null) => void;
  addCustomVariation: (variation: Omit<ComponentVariation, 'id'>) => void;
  removeVariation: (id: string) => void;
}

const defaultVariations: Record<string, ComponentVariation[]> = {
  button: [
    { id: 'default', name: 'Default', description: 'Standard button', props: { variant: 'default', size: 'default', children: 'Button' }, category: 'default' },
    { id: 'primary', name: 'Primary', description: 'Primary action button', props: { variant: 'default', size: 'default', children: 'Primary Action' }, category: 'style' },
    { id: 'secondary', name: 'Secondary', description: 'Secondary button', props: { variant: 'secondary', size: 'default', children: 'Secondary' }, category: 'style' },
    { id: 'destructive', name: 'Destructive', description: 'Dangerous action', props: { variant: 'destructive', size: 'default', children: 'Delete' }, category: 'style' },
    { id: 'outline', name: 'Outline', description: 'Outlined button', props: { variant: 'outline', size: 'default', children: 'Outline' }, category: 'style' },
    { id: 'ghost', name: 'Ghost', description: 'Minimal button', props: { variant: 'ghost', size: 'default', children: 'Ghost' }, category: 'style' },
    { id: 'small', name: 'Small', description: 'Compact size', props: { variant: 'default', size: 'sm', children: 'Small' }, category: 'size' },
    { id: 'large', name: 'Large', description: 'Large size', props: { variant: 'default', size: 'lg', children: 'Large Button' }, category: 'size' },
    { id: 'disabled', name: 'Disabled', description: 'Disabled state', props: { variant: 'default', size: 'default', children: 'Disabled', disabled: true }, category: 'state' },
  ],
  card: [
    { id: 'default', name: 'Default', description: 'Basic card', props: { title: 'Card Title', description: 'Card Description', content: 'Card Content' }, category: 'default' },
    { id: 'simple', name: 'Simple', description: 'Just content', props: { title: 'Simple Card', content: 'This card has minimal content.' }, category: 'style' },
    { id: 'detailed', name: 'Detailed', description: 'Rich content', props: { title: 'Feature Card', description: 'This card showcases a new feature', content: 'Detailed explanation of the feature with multiple benefits and use cases.' }, category: 'style' },
  ],
  input: [
    { id: 'default', name: 'Default', description: 'Text input', props: { type: 'text', placeholder: 'Enter text...' }, category: 'default' },
    { id: 'email', name: 'Email', description: 'Email input', props: { type: 'email', placeholder: 'your@email.com' }, category: 'style' },
    { id: 'password', name: 'Password', description: 'Password input', props: { type: 'password', placeholder: 'Your password' }, category: 'style' },
    { id: 'disabled', name: 'Disabled', description: 'Disabled state', props: { type: 'text', placeholder: 'Disabled input', disabled: true }, category: 'state' },
  ],
  checkbox: [
    { id: 'default', name: 'Default', description: 'Basic checkbox', props: { checked: false, label: 'Accept terms and conditions' }, category: 'default' },
    { id: 'checked', name: 'Checked', description: 'Pre-checked', props: { checked: true, label: 'Subscribe to newsletter' }, category: 'state' },
    { id: 'disabled', name: 'Disabled', description: 'Disabled state', props: { checked: false, label: 'Unavailable option', disabled: true }, category: 'state' },
  ]
};

export const useComponentVariations = (componentType: string): UseComponentVariationsReturn => {
  const [variations, setVariations] = useState<ComponentVariation[]>(
    defaultVariations[componentType] || []
  );
  const [activeVariation, setActiveVariation] = useState<string | null>(null);

  const addCustomVariation = useCallback((variation: Omit<ComponentVariation, 'id'>) => {
    const newVariation: ComponentVariation = {
      ...variation,
      id: `custom-${Date.now()}`,
      category: 'custom'
    };
    setVariations(prev => [...prev, newVariation]);
  }, []);

  const removeVariation = useCallback((id: string) => {
    setVariations(prev => prev.filter(v => v.id !== id && !v.id.startsWith('custom-')));
  }, []);

  return {
    variations,
    activeVariation,
    setActiveVariation,
    addCustomVariation,
    removeVariation
  };
};
