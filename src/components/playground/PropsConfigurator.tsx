
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface PropConfig {
  name: string;
  type: 'string' | 'boolean' | 'select' | 'number';
  options?: string[];
  defaultValue: any;
}

interface PropsConfiguratorProps {
  componentType: string;
  onPropsChange: (props: Record<string, any>) => void;
  currentProps: Record<string, any>;
}

const componentPropConfigs: Record<string, PropConfig[]> = {
  button: [
    { name: 'variant', type: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], defaultValue: 'default' },
    { name: 'size', type: 'select', options: ['default', 'sm', 'lg', 'icon'], defaultValue: 'default' },
    { name: 'disabled', type: 'boolean', defaultValue: false },
    { name: 'children', type: 'string', defaultValue: 'Button' }
  ],
  card: [
    { name: 'title', type: 'string', defaultValue: 'Card Title' },
    { name: 'description', type: 'string', defaultValue: 'Card Description' },
    { name: 'content', type: 'string', defaultValue: 'Card Content' }
  ],
  input: [
    { name: 'type', type: 'select', options: ['text', 'email', 'password', 'number'], defaultValue: 'text' },
    { name: 'placeholder', type: 'string', defaultValue: 'Enter text...' },
    { name: 'disabled', type: 'boolean', defaultValue: false }
  ],
  checkbox: [
    { name: 'checked', type: 'boolean', defaultValue: false },
    { name: 'disabled', type: 'boolean', defaultValue: false },
    { name: 'label', type: 'string', defaultValue: 'Accept terms and conditions' }
  ]
};

export const PropsConfigurator: React.FC<PropsConfiguratorProps> = ({
  componentType,
  onPropsChange,
  currentProps
}) => {
  const propConfigs = componentPropConfigs[componentType] || [];

  const handlePropChange = (propName: string, value: any) => {
    const newProps = { ...currentProps, [propName]: value };
    onPropsChange(newProps);
  };

  if (propConfigs.length === 0) {
    return null;
  }

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <CardTitle className="text-lg">Props Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {propConfigs.map((config) => (
          <div key={config.name} className="space-y-2">
            <Label htmlFor={config.name} className="text-sm font-medium">
              {config.name}
            </Label>
            
            {config.type === 'string' && (
              <Input
                id={config.name}
                value={currentProps[config.name] || config.defaultValue}
                onChange={(e) => handlePropChange(config.name, e.target.value)}
                className="bg-white/5 border-white/10"
              />
            )}
            
            {config.type === 'boolean' && (
              <div className="flex items-center space-x-2">
                <Switch
                  id={config.name}
                  checked={currentProps[config.name] || config.defaultValue}
                  onCheckedChange={(value) => handlePropChange(config.name, value)}
                />
                <Label htmlFor={config.name} className="text-sm text-muted-foreground">
                  {currentProps[config.name] ? 'true' : 'false'}
                </Label>
              </div>
            )}
            
            {config.type === 'select' && config.options && (
              <Select
                value={currentProps[config.name] || config.defaultValue}
                onValueChange={(value) => handlePropChange(config.name, value)}
              >
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
