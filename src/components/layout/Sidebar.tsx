import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, ChevronDown, ChevronRight, Heart, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedSearch } from '@/components/search/EnhancedSearch';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { useFavorites } from '@/hooks/useFavorites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      { title: "Accordion", href: "/components/accordion", status: "updated" },
      { title: "Alert", href: "/components/alert" },
      { title: "AspectRatio", href: "/components/aspect-ratio" },
      { title: "Avatar", href: "/components/avatar" },
      { title: "Badge", href: "/components/badge", status: "popular" },
      { title: "Button", href: "/components/button", status: "popular" },
      { title: "Card", href: "/components/card", status: "popular" },
      { title: "Collapsible", href: "/components/collapsible" }
    ]
  },
  {
    title: "Forms",
    items: [
      { title: "Checkbox", href: "/components/checkbox", status: "popular" },
      { title: "Command", href: "/components/command" },
      { title: "DatePicker", href: "/components/date-picker", status: "new" },
      { title: "Dialog", href: "/components/dialog" },
      { title: "Dropdown", href: "/components/dropdown" },
      { title: "Form", href: "/components/form" },
      { title: "Input", href: "/components/input", status: "popular" },
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

const getStatusBadge = (status?: string) => {
  switch (status) {
    case 'new':
      return <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">New</Badge>;
    case 'updated':
      return <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Updated</Badge>;
    case 'popular':
      return <Sparkles className="h-3 w-3 text-yellow-500" />;
    default:
      return null;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    "Getting Started": true,
    "Layout": true,
    "Forms": false,
    "Navigation": false,
    "Data Display": false,
    "Feedback": false
  });
  const [activeTab, setActiveTab] = useState('components');
  
  const location = useLocation();
  const { recentItems } = useRecentlyViewed();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const isActiveLink = (href: string) => location.pathname === href;

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-card border-r border-border/20 transition-transform duration-200 ease-in-out backdrop-blur-md ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/20">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-primary-foreground text-sm font-bold glow-text">
              C
            </div>
            <span className="text-lg font-semibold gradient-text">Components</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <EnhancedSearch placeholder="Search components..." />
        </div>

        {/* Navigation Tabs */}
        <div className="px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="components" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">Recent</TabsTrigger>
              <TabsTrigger value="favorites" className="text-xs">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="components" className="mt-4">
              <nav className="space-y-2 overflow-y-auto sidebar-scrollbar max-h-[calc(100vh-300px)]">
                {navigationSections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.title)}
                      className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors"
                    >
                      <span>{section.title}</span>
                      {expandedSections[section.title] ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </button>
                    
                    {expandedSections[section.title] && (
                      <ul className="space-y-1 pl-2">
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <Link to={item.href}>
                              <div className={`group flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer ${
                                isActiveLink(item.href)
                                  ? 'bg-primary/20 text-primary font-medium border border-primary/30 shadow-lg shadow-primary/20 glow-text'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  <span>{item.title}</span>
                                  {getStatusBadge((item as any).status)}
                                </div>
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {isFavorite(item.href) && (
                                    <Heart className="h-3 w-3 fill-current text-red-500" />
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      toggleFavorite({
                                        title: item.title,
                                        href: item.href,
                                        category: section.title
                                      });
                                    }}
                                  >
                                    <Heart className={`h-3 w-3 ${isFavorite(item.href) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                                  </Button>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </nav>
            </TabsContent>
            
            <TabsContent value="recent" className="mt-4">
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto sidebar-scrollbar">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Recently Viewed</span>
                </div>
                {recentItems.length > 0 ? (
                  recentItems.map((item) => (
                    <Link key={item.href} to={item.href}>
                      <div className="group flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white/5">
                        <span>{item.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item);
                          }}
                        >
                          <Heart className={`h-3 w-3 ${isFavorite(item.href) ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-4 text-center">
                    No recent components
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites" className="mt-4">
              <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto sidebar-scrollbar">
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Favorites</span>
                </div>
                {favorites.length > 0 ? (
                  favorites.map((item) => (
                    <Link key={item.href} to={item.href}>
                      <div className="group flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer text-muted-foreground hover:text-foreground hover:bg-white/5">
                        <div className="flex items-center space-x-2">
                          <span>{item.title}</span>
                          <Heart className="h-3 w-3 fill-current text-red-500" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(item);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-4 text-center">
                    No favorite components yet
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </aside>
  );
};
