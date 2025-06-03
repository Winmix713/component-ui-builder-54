
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BreadcrumbNavigation } from '@/components/navigation/BreadcrumbNavigation';

export const DocsPage: React.FC = () => {
  const location = useLocation();
  const page = location.pathname.slice(1); // Remove leading slash
  
  const pageTitle = page
    ? page.charAt(0).toUpperCase() + page.slice(1)
    : 'Documentation';

  const getPageContent = () => {
    switch (page) {
      case 'installation':
        return {
          title: 'Installation',
          description: 'Get started with our component library',
          content: (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Install the package</h3>
              <pre className="bg-muted p-4 rounded-md">
                <code>npm install @ui/components</code>
              </pre>
              <h3 className="text-lg font-semibold">Import components</h3>
              <pre className="bg-muted p-4 rounded-md">
                <code>{`import { Button } from '@ui/components'`}</code>
              </pre>
            </div>
          )
        };
      case 'theming':
        return {
          title: 'Theming',
          description: 'Customize the appearance of components',
          content: (
            <div className="space-y-4">
              <p>Our components are built with CSS variables for easy theming.</p>
              <h3 className="text-lg font-semibold">CSS Variables</h3>
              <pre className="bg-muted p-4 rounded-md">
                <code>{`:root {
  --primary: 210 40% 98%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
}`}</code>
              </pre>
            </div>
          )
        };
      case 'typography':
        return {
          title: 'Typography',
          description: 'Typography scale and font usage',
          content: (
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <h2 className="text-3xl font-semibold">Heading 2</h2>
              <h3 className="text-2xl font-semibold">Heading 3</h3>
              <h4 className="text-xl font-semibold">Heading 4</h4>
              <p className="text-base">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-sm text-muted-foreground">Small text - Secondary information</p>
            </div>
          )
        };
      default:
        return {
          title: pageTitle,
          description: 'Documentation page',
          content: <p>Documentation content for {pageTitle}</p>
        };
    }
  };

  const pageContent = getPageContent();

  return (
    <div className="space-y-6">
      <BreadcrumbNavigation />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{pageContent.title}</h1>
        <p className="text-muted-foreground mt-2">{pageContent.description}</p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {pageContent.content}
        </CardContent>
      </Card>
    </div>
  );
};
