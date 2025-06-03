
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ComponentCardProps {
  name: string;
  description: string;
  href: string;
}

export const ComponentCard: React.FC<ComponentCardProps> = ({ name, description, href }) => {
  return (
    <Card className="glass-card backdrop-blur-md border-border/20 hover:border-border/40 transition-all duration-200 group">
      <CardHeader>
        <CardTitle className="text-lg">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">{description}</p>
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          <Link to={href} className="flex items-center justify-between">
            View Component
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};
