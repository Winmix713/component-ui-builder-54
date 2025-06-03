
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, Zap, Star } from 'lucide-react';

interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
}

const templates: CodeTemplate[] = [
  {
    id: 'basic-button',
    name: 'Basic Button',
    description: 'Simple interactive button with variants',
    category: 'Form',
    complexity: 'Simple',
    code: `const ComponentDemo = () => {
  return (
    <div className="space-y-4">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  );
};`
  },
  {
    id: 'form-card',
    name: 'Form Card',
    description: 'Card with form inputs and validation',
    category: 'Form',
    complexity: 'Medium',
    code: `const ComponentDemo = () => {
  const [email, setEmail] = useState('');
  
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button className="w-full">Submit</Button>
      </CardContent>
    </Card>
  );
};`
  },
  {
    id: 'data-table',
    name: 'Data Table',
    description: 'Interactive table with sorting and filtering',
    category: 'Data',
    complexity: 'Complex',
    code: `const ComponentDemo = () => {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map(user => (
            <div key={user.id} className="flex justify-between p-2 border rounded">
              <span>{user.name}</span>
              <Badge>{user.email}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};`
  }
];

interface CodeTemplatesLibraryProps {
  onTemplateSelect: (template: CodeTemplate) => void;
}

export const CodeTemplatesLibrary: React.FC<CodeTemplatesLibraryProps> = ({
  onTemplateSelect
}) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'default';
      case 'Medium': return 'secondary';
      case 'Complex': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="h-5 w-5" />
          <span>Code Templates</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {templates.map((template) => (
          <div key={template.id} className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{template.name}</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
                <Badge variant={getComplexityColor(template.complexity)} className="text-xs">
                  {template.complexity}
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{template.description}</p>
            
            <Button
              size="sm"
              onClick={() => onTemplateSelect(template)}
              className="w-full"
            >
              <Zap className="h-4 w-4 mr-2" />
              Use Template
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
