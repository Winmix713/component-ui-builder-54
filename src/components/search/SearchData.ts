
export interface SearchResult {
  title: string;
  href: string;
  category: string;
  description?: string;
}

export const searchData: SearchResult[] = [
  // Components
  { title: "Accordion", href: "/components/accordion", category: "Layout", description: "Collapsible content sections" },
  { title: "Alert", href: "/components/alert", category: "Layout", description: "Important notifications" },
  { title: "Avatar", href: "/components/avatar", category: "Layout", description: "User profile images" },
  { title: "Badge", href: "/components/badge", category: "Layout", description: "Status indicators" },
  { title: "Button", href: "/components/button", category: "Layout", description: "Interactive buttons" },
  { title: "Card", href: "/components/card", category: "Layout", description: "Content containers" },
  { title: "Checkbox", href: "/components/checkbox", category: "Forms", description: "Boolean input controls" },
  { title: "Input", href: "/components/input", category: "Forms", description: "Text input fields" },
  { title: "Select", href: "/components/select", category: "Forms", description: "Dropdown selections" },
  { title: "Breadcrumb", href: "/components/breadcrumb", category: "Navigation", description: "Navigation trail" },
  { title: "Tabs", href: "/components/tabs", category: "Navigation", description: "Tabbed content" },
  // Docs
  { title: "Installation", href: "/installation", category: "Docs", description: "Getting started guide" },
  { title: "Theming", href: "/theming", category: "Docs", description: "Customize appearance" },
  { title: "Typography", href: "/typography", category: "Docs", description: "Text styling guide" },
];

export const categories = ['All', 'Layout', 'Forms', 'Navigation', 'Data Display', 'Feedback', 'Docs'];
