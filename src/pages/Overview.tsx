
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Package, Zap, Shield, Code, Palette, Sparkles } from 'lucide-react';

export const Overview: React.FC = () => {
  return (
    <div className="space-y-16 relative">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-16">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold tracking-tight">
            <span className="gradient-text">Modern UI</span>
            <br />
            <span className="text-white">Components</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Build beautiful, accessible, and performant applications with our comprehensive collection of 
            premium React components designed for the modern web.
          </p>
        </div>
        
        <div className="flex justify-center gap-4 pt-8">
          <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-8 py-6 text-lg">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/5 px-8 py-6 text-lg">
            View Components
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold gradient-text">50+</div>
          <div className="text-muted-foreground">Premium Components</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold gradient-text">99.9%</div>
          <div className="text-muted-foreground">Uptime Guarantee</div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold gradient-text">10k+</div>
          <div className="text-muted-foreground">Happy Developers</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-white">50+ Components</CardTitle>
            <CardDescription className="text-muted-foreground">
              A comprehensive set of components for building modern applications with consistent design patterns.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-white">Lightning Fast</CardTitle>
            <CardDescription className="text-muted-foreground">
              Optimized for performance with minimal bundle size and lightning-fast load times.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-white">Fully Accessible</CardTitle>
            <CardDescription className="text-muted-foreground">
              Built with accessibility in mind, following WCAG guidelines and best practices.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-white">Developer Friendly</CardTitle>
            <CardDescription className="text-muted-foreground">
              Clean APIs, TypeScript support, and comprehensive documentation for seamless integration.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Palette className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-white">Customizable</CardTitle>
            <CardDescription className="text-muted-foreground">
              Easily customizable with CSS variables, theme tokens, and flexible styling options.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-white">Modern Design</CardTitle>
            <CardDescription className="text-muted-foreground">
              Contemporary design language with subtle animations and premium visual effects.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Code Example */}
      <Card className="glass-card border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            Quick Example
          </CardTitle>
          <CardDescription>
            Here's how easy it is to use our components in your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-black/40 p-6 rounded-lg overflow-x-auto border border-white/10">
            <code className="text-sm text-gray-300">{`import { Button, Card } from '@ui/components'

function App() {
  return (
    <Card className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Welcome to Modern UI
      </h1>
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </Card>
  )
}`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center py-16 space-y-8">
        <h2 className="text-4xl font-bold">
          Ready to build something <span className="gradient-text">amazing?</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Join thousands of developers who are already building beautiful applications with our component library.
        </p>
        <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-12 py-6 text-lg">
          Start Building Today
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
