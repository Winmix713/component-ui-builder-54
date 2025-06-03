
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RotateCcw, Palette, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface PropConfig {
  name: string;
  type: 'string' | 'boolean' | 'select' | 'number' | 'color' | 'range';
  options?: string[];
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  category?: 'appearance' | 'behavior' | 'content';
}

interface AdvancedPropsConfiguratorProps {
  componentType: string;
  onPropsChange: (props: Record<string, any>) => void;
  currentProps: Record<string, any>;
  onReset: () => void;
}

const advancedComponentConfigs: Record<string, PropConfig[]> = {
  button: [
    { name: 'variant', type: 'select', options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'], defaultValue: 'default', category: 'appearance', description: 'Visual style variant' },
    { name: 'size', type: 'select', options: ['default', 'sm', 'lg', 'icon'], defaultValue: 'default', category: 'appearance', description: 'Button size' },
    { name: 'disabled', type: 'boolean', defaultValue: false, category: 'behavior', description: 'Disable button interaction' },
    { name: 'children', type: 'string', defaultValue: 'Button', category: 'content', description: 'Button text content' },
    { name: 'className', type: 'string', defaultValue: '', category: 'appearance', description: 'Additional CSS classes' }
  ],
  card: [
    { name: 'title', type: 'string', defaultValue: 'Card Title', category: 'content', description: 'Card header title' },
    { name: 'description', type: 'string', defaultValue: 'Card Description', category: 'content', description: 'Card header description' },
    { name: 'content', type: 'string', defaultValue: 'Card Content', category: 'content', description: 'Main card content' },
    { name: 'className', type: 'string', defaultValue: '', category: 'appearance', description: 'Additional CSS classes' }
  ],
  input: [
    { name: 'type', type: 'select', options: ['text', 'email', 'password', 'number'], defaultValue: 'text', category: 'behavior', description: 'Input type' },
    { name: 'placeholder', type: 'string', defaultValue: 'Enter text...', category: 'content', description: 'Placeholder text' },
    { name: 'disabled', type: 'boolean', defaultValue: false, category: 'behavior', description: 'Disable input' },
    { name: 'className', type: 'string', defaultValue: '', category: 'appearance', description: 'Additional CSS classes' }
  ],
  checkbox: [
    { name: 'checked', type: 'boolean', defaultValue: false, category: 'behavior', description: 'Checked state' },
    { name: 'disabled', type: 'boolean', defaultValue: false, category: 'behavior', description: 'Disable checkbox' },
    { name: 'label', type: 'string', defaultValue: 'Accept terms and conditions', category: 'content', description: 'Checkbox label' }
  ]
};

export const AdvancedPropsConfigurator: React.FC<AdvancedPropsConfiguratorProps> = ({
  componentType,
  onPropsChange,
  currentProps,
  onReset
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const propConfigs = advancedComponentConfigs[componentType] || [];

  const handlePropChange = (propName: string, value: any) => {
    const newProps = { ...currentProps, [propName]: value };
    onPropsChange(newProps);
  };

  const getConfigsByCategory = (category: string) => {
    if (category === 'all') return propConfigs;
    return propConfigs.filter(config => config.category === category);
  };

  const categories = ['all', 'appearance', 'behavior', 'content'];
  const filteredConfigs = getConfigsByCategory(activeCategory);

  if (propConfigs.length === 0) {
    return (
      <Card className="glass-card backdrop-blur-md border-border/20">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Settings className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground text-center">
            No configurable props available for this component
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card backdrop-blur-md border-border/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Props Configuration
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="glass-card"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="mt-4 space-y-4">
            {filteredConfigs.map((config, index) => (
              <div key={config.name}>
                {index > 0 && <Separator className="my-4" />}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={config.name} className="text-sm font-medium flex items-center gap-2">
                      {config.name}
                      {config.category && (
                        <Badge variant="outline" className="text-xs">
                          {config.category}
                        </Badge>
                      )}
                    </Label>
                  </div>
                  
                  {config.description && (
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                  )}
                  
                  {config.type === 'string' && (
                    <Input
                      id={config.name}
                      value={currentProps[config.name] || config.defaultValue}
                      onChange={(e) => handlePropChange(config.name, e.target.value)}
                      className="bg-white/5 border-white/10"
                      placeholder={config.defaultValue}
                    />
                  )}
                  
                  {config.type === 'boolean' && (
                    <div className="flex items-center space-x-3">
                      <Switch
                        id={config.name}
                        checked={currentProps[config.name] ?? config.defaultValue}
                        onCheckedChange={(value) => handlePropChange(config.name, value)}
                      />
                      <Label htmlFor={config.name} className="text-sm text-muted-foreground">
                        {currentProps[config.name] ?? config.defaultValue ? 'true' : 'false'}
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
                  
                  {config.type === 'range' && (
                    <div className="space-y-2">
                      <Slider
                        value={[currentProps[config.name] || config.defaultValue]}
                        onValueChange={(value) => handlePropChange(config.name, value[0])}
                        min={config.min || 0}
                        max={config.max || 100}
                        step={config.step || 1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{config.min || 0}</span>
                        <span className="font-medium">
                          {currentProps[config.name] || config.defaultValue}
                        </span>
                        <span>{config.max || 100}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
