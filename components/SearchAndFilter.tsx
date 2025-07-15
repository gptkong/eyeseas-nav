'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';

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
        <div className="form-control">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search navigation links..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-base-content/60" />
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${currentCategory === 'all' ? 'tab-active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All
          </button>
          <button
            className={`tab ${currentCategory === 'internal' ? 'tab-active' : ''}`}
            onClick={() => handleCategoryChange('internal')}
          >
            Internal
          </button>
          <button
            className={`tab ${currentCategory === 'external' ? 'tab-active' : ''}`}
            onClick={() => handleCategoryChange('external')}
          >
            External
          </button>
        </div>
      </div>
    </div>
  );
}
