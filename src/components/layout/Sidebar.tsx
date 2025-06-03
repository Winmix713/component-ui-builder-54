
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationSections = [
  {
    title: "Getting Started",
    items: [
      { title: "Installation", href: "/installation" },
      { title: "Theming", href: "/theming" },
      { title: "Typography", href: "/typography" }
    ]
  },
  {
    title: "Layout",
    items: [
      { title: "Accordion", href: "/components/accordion" },
      { title: "Alert", href: "/components/alert" },
      { title: "AspectRatio", href: "/components/aspect-ratio" },
      { title: "Avatar", href: "/components/avatar" },
      { title: "Badge", href: "/components/badge" },
      { title: "Button", href: "/components/button" },
      { title: "Card", href: "/components/card" },
      { title: "Collapsible", href: "/components/collapsible" }
    ]
  },
  {
    title: "Forms",
    items: [
      { title: "Checkbox", href: "/components/checkbox" },
      { title: "Command", href: "/components/command" },
      { title: "DatePicker", href: "/components/date-picker" },
      { title: "Dialog", href: "/components/dialog" },
      { title: "Dropdown", href: "/components/dropdown" },
      { title: "Form", href: "/components/form" },
      { title: "Input", href: "/components/input" },
      { title: "Label", href: "/components/label" },
      { title: "Select", href: "/components/select" },
      { title: "Textarea", href: "/components/textarea" }
    ]
  },
  {
    title: "Navigation",
    items: [
      { title: "Breadcrumb", href: "/components/breadcrumb" },
      { title: "NavigationMenu", href: "/components/navigation-menu" },
      { title: "Pagination", href: "/components/pagination" },
      { title: "Tabs", href: "/components/tabs" }
    ]
  },
  {
    title: "Data Display",
    items: [
      { title: "Calendar", href: "/components/calendar" },
      { title: "DataTable", href: "/components/data-table" },
      { title: "HoverCard", href: "/components/hover-card" },
      { title: "Progress", href: "/components/progress" },
      { title: "Separator", href: "/components/separator" },
      { title: "Table", href: "/components/table" },
      { title: "Tooltip", href: "/components/tooltip" }
    ]
  },
  {
    title: "Feedback",
    items: [
      { title: "AlertDialog", href: "/components/alert-dialog" },
      { title: "Popover", href: "/components/popover" },
      { title: "Sheet", href: "/components/sheet" },
      { title: "Skeleton", href: "/components/skeleton" },
      { title: "Toast", href: "/components/toast" }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  const filteredSections = navigationSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const isActiveLink = (href: string) => location.pathname === href;

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-200 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-sm font-bold">
              C
            </div>
            <span className="text-lg font-semibold">Components</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto sidebar-scrollbar">
          {filteredSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href}>
                      <span className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                        isActiveLink(item.href)
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}>
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
