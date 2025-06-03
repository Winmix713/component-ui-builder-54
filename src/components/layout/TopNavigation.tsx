
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopNavigationProps {
  onMenuClick: () => void;
}

const navigationItems = [
  { title: "Overview", href: "/" },
  { title: "Activity", href: "/activity" },
  { title: "Settings", href: "/settings" },
  { title: "Collaborators", href: "/collaborators" },
  { title: "Notifications", href: "/notifications" }
];

export const TopNavigation: React.FC<TopNavigationProps> = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenuClick}
          className="lg:hidden mr-2"
        >
          <Menu className="h-4 w-4" />
        </Button>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigationItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <span className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {item.title}
              </span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">View feedback</span>
          <Button>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </div>
    </header>
  );
};
