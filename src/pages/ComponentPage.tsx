
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Copy, Check, ChevronLeft, ChevronRight, Heart, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Component metadata
const componentData = {
  card: {
    title: 'Card',
    description: 'The Card component is a versatile & interactive component that acts as a container for your content and can be used for everything from simple information cards to complex interactive elements.',
    installation: 'npx shadcn-ui@latest add card',
    imports: `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"`,
    example: `export function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  )
}`,
    apiProps: [
      { prop: 'className', type: 'string', default: '-', description: 'Additional CSS classes to apply to the card' },
      { prop: 'children', type: 'ReactNode', default: '-', description: 'The content to be rendered inside the card' }
    ],
    prev: 'button',
    next: 'checkbox'
  },
  button: {
    title: 'Button',
    description: 'Displays a button or a component that looks like a button.',
    installation: 'npx shadcn-ui@latest add button',
    imports: `import { Button } from "@/components/ui/button"`,
    example: `export function ButtonDemo() {
  return <Button>Button</Button>
}`,
    apiProps: [
      { prop: 'variant', type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', default: '"default"', description: 'The visual style variant of the button' },
      { prop: 'size', type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: 'The size of the button' },
      { prop: 'asChild', type: 'boolean', default: 'false', description: 'Change the default rendered element for the one passed as a child' }
    ],
    prev: 'badge',
    next: 'card'
  },
  checkbox: {
    title: 'Checkbox',
    description: 'A control that allows the user to toggle between checked and not checked.',
    installation: 'npx shadcn-ui@latest add checkbox',
    imports: `import { Checkbox } from "@/components/ui/checkbox"`,
    example: `export function CheckboxDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms">Accept terms and conditions</label>
    </div>
  )
}`,
    apiProps: [
      { prop: 'checked', type: 'boolean', default: 'false', description: 'The checked state of the checkbox' },
      { prop: 'onCheckedChange', type: '(checked: boolean) => void', default: '-', description: 'Event handler called when the checked state changes' },
      { prop: 'disabled', type: 'boolean', default: 'false', description: 'When true, prevents the user from interacting with the checkbox' }
    ],
    prev: 'card',
    next: 'input'
  },
  input: {
    title: 'Input',
    description: 'Displays a form input field or a component that looks like an input field.',
    installation: 'npx shadcn-ui@latest add input',
    imports: `import { Input } from "@/components/ui/input"`,
    example: `export function InputDemo() {
  return <Input type="email" placeholder="Email" />
}`,
    apiProps: [
      { prop: 'type', type: 'string', default: '"text"', description: 'The type of input' },
      { prop: 'placeholder', type: 'string', default: '-', description: 'Placeholder text for the input' },
      { prop: 'disabled', type: 'boolean', default: 'false', description: 'When true, prevents the user from interacting with the input' }
    ],
    prev: 'checkbox',
    next: 'label'
  }
};

const CopyButton: React.FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={`glass-card ${className}`}
      onClick={handleCopy}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
};

const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = "tsx" }) => {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="glass-card bg-muted/50 backdrop-blur-md rounded-lg p-6 text-sm font-mono overflow-x-auto border border-border/20">
        <code className="text-foreground">{code}</code>
      </pre>
    </div>
  );
};

const AccessibilityItem: React.FC<{ text: string }> = ({ text }) => (
  <li className="flex items-start gap-3">
    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
    <span className="text-muted-foreground">{text}</span>
  </li>
);

export const ComponentPage: React.FC = () => {
  const { component } = useParams<{ component: string }>();
  
  if (!component || !componentData[component as keyof typeof componentData]) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Component Not Found</h1>
          <p className="text-muted-foreground mt-2">
            The requested component documentation could not be found.
          </p>
        </div>
      </div>
    );
  }

  const data = componentData[component as keyof typeof componentData];

  return (
    <div className="space-y-12 max-w-4xl">
      {/* Component Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full glow-text"></div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">{data.title}</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          {data.description}
        </p>
      </div>

      {/* Installation Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Installation</h2>
        <CodeBlock code={data.installation} language="bash" />
      </section>

      {/* Import Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Import</h2>
        <CodeBlock code={data.imports} />
      </section>

      {/* Preview Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Preview</h2>
          <Badge variant="secondary" className="glass-card">
            {data.title}
          </Badge>
        </div>
        
        <Card className="glass-card backdrop-blur-md border-border/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Example</CardTitle>
              <CopyButton text={data.example} />
            </div>
            <CardDescription>
              Basic usage of the {data.title.toLowerCase()} component.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 border rounded-md bg-muted/20 backdrop-blur-sm flex items-center justify-center min-h-[200px]">
              {component === 'card' && (
                <Card className="w-80 glass-card backdrop-blur-md border-border/20">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-primary">Latest One</span>
                    </div>
                    <div className="w-full h-40 bg-muted/50 rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">Image Placeholder</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="mb-2">Pipeline 1a</CardTitle>
                    <CardDescription className="mb-4">
                      Embark on a quest to the ancient lost temple where mysterious ancient guardians guard questions concerning adventures.
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>18</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>5</span>
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {component === 'button' && (
                <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Button
                </Button>
              )}
              {component === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="demo-checkbox" className="rounded border-border" />
                  <label htmlFor="demo-checkbox" className="text-sm">Accept terms and conditions</label>
                </div>
              )}
              {component === 'input' && (
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Code Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Code</h2>
        <CodeBlock code={data.example} />
      </section>

      {/* API Reference Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">API Reference</h2>
        <Card className="glass-card backdrop-blur-md border-border/20">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prop</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.apiProps.map((prop, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm text-primary">{prop.prop}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{prop.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground font-mono">{prop.default}</TableCell>
                    <TableCell className="text-sm">{prop.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Accessibility Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Accessibility</h2>
        <Card className="glass-card backdrop-blur-md border-border/20 bg-muted/10">
          <CardContent className="p-6">
            <ul className="space-y-3">
              <AccessibilityItem text="Component includes proper semantic structure with appropriate ARIA labels" />
              <AccessibilityItem text="Interactive elements support keyboard navigation and focus management" />
              <AccessibilityItem text="Color contrast ratios meet WCAG 2.1 AA standards" />
              <AccessibilityItem text="Screen readers can properly announce component content and interactions" />
            </ul>
          </CardContent>
        </Card>
      </section>

      <Separator className="bg-border/20" />

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-6">
        {data.prev && (
          <Button
            variant="ghost"
            className="flex items-center text-primary hover:text-primary/80 transition-colors glass-card"
            onClick={() => window.location.href = `/components/${data.prev}`}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            <span className="text-sm capitalize">{data.prev}</span>
          </Button>
        )}
        
        {data.next && (
          <Button
            variant="ghost"
            className="flex items-center text-primary hover:text-primary/80 transition-colors glass-card ml-auto"
            onClick={() => window.location.href = `/components/${data.next}`}
          >
            <span className="text-sm capitalize">{data.next}</span>
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
