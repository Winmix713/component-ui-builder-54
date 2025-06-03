
import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  isSearching: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function SearchInput({ value, onChange, onKeyDown, isSearching, inputRef }: SearchInputProps) {
  return (
    <div className="flex items-center border-b pb-3">
      {isSearching ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin opacity-50" />
      ) : (
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      )}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Search components and docs..."
        className="border-0 p-0 text-sm focus-visible:ring-0 shadow-none"
        autoFocus
      />
    </div>
  );
}
