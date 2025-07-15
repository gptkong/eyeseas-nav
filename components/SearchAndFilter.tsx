'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onCategoryChange: (category: 'all' | 'internal' | 'external') => void;
  currentCategory: 'all' | 'internal' | 'external';
}

export function SearchAndFilter({ onSearch, onCategoryChange, currentCategory }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleCategoryChange = (category: 'all' | 'internal' | 'external') => {
    onCategoryChange(category);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search navigation links..."
            className="pl-10"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <div className="flex rounded-lg border p-1">
          <Button
            variant={currentCategory === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleCategoryChange('all')}
            className={cn(
              "rounded-md",
              currentCategory === 'all' ? '' : 'hover:bg-muted'
            )}
          >
            All
          </Button>
          <Button
            variant={currentCategory === 'internal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleCategoryChange('internal')}
            className={cn(
              "rounded-md",
              currentCategory === 'internal' ? '' : 'hover:bg-muted'
            )}
          >
            Internal
          </Button>
          <Button
            variant={currentCategory === 'external' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleCategoryChange('external')}
            className={cn(
              "rounded-md",
              currentCategory === 'external' ? '' : 'hover:bg-muted'
            )}
          >
            External
          </Button>
        </div>
      </div>
    </div>
  );
}
