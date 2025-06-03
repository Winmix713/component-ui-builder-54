
import React, { useState } from 'react';
import { EnhancedSearch } from './EnhancedSearch';

export const QuickSearch: React.FC = () => {
  const [open, setOpen] = useState(false);

  return <EnhancedSearch open={open} onOpenChange={setOpen} />;
};
