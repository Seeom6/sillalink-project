'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiX, FiRefreshCw } from 'react-icons/fi';
import { 
  TechnologyFilters, 
  TechnologyCategory, 
  TechnologyStatus, 
  DifficultyLevel 
} from '@/lib/types/technology';
// import { useTechnologyCategories, useTechnologyTags } from '@/lib/hooks/use-technologies';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface TechnologyFiltersPanelProps {
  filters: TechnologyFilters;
  onFiltersChange: (filters: Partial<TechnologyFilters>) => void;
  onReset: () => void;
}

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="space-y-3">
    <h4 className="text-sm font-medium text-primary-300">{title}</h4>
    {children}
  </div>
);

const SelectFilter: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="
      w-full px-3 py-2 bg-dark-800/50 border border-primary-500/20 rounded-lg
      text-white text-sm focus:outline-none focus:border-primary-500/50
      focus:bg-dark-800/70 transition-all duration-200
    "
  >
    <option value="">{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const TagsFilter: React.FC<{
  selectedTags: string[];
  availableTags: string[];
  onChange: (tags: string[]) => void;
}> = ({ selectedTags, availableTags, onChange }) => {
  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagToggle(tag)}
            className={`
              px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
              ${selectedTags.includes(tag)
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'bg-dark-700/50 text-primary-300 border border-primary-500/10 hover:border-primary-500/30 hover:bg-dark-700/70'
              }
            `}
          >
            {tag}
          </button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-primary-400">Selected:</span>
          {selectedTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full"
            >
              {tag}
              <button
                onClick={() => handleTagToggle(tag)}
                className="ml-1 hover:text-white"
              >
                <FiX size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export const TechnologyFiltersPanel: React.FC<TechnologyFiltersPanelProps> = ({
  filters,
  onFiltersChange,
  onReset
}) => {
  const availableTags: string[] = []; // Mock data for now

  const categoryOptions = Object.values(TechnologyCategory).map(category => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')
  }));

  const statusOptions = Object.values(TechnologyStatus).map(status => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1)
  }));

  const difficultyOptions = Object.values(DifficultyLevel).map(difficulty => ({
    value: difficulty,
    label: difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }));

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'proficiencyLevel', label: 'Proficiency Level' },
    { value: 'projectsUsedIn', label: 'Projects Used' }
  ];

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'page' || key === 'limit' || key === 'sortBy' || key === 'sortOrder') return false;
    return value !== undefined && value !== null && value !== '' && 
           (!Array.isArray(value) || value.length > 0);
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        {hasActiveFilters && (
          <EnhancedButton
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-primary-400 hover:text-white"
          >
            <FiRefreshCw size={14} />
            Reset All
          </EnhancedButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category Filter */}
        <FilterSection title="Category">
          <SelectFilter
            value={filters.category || ''}
            onChange={(value) => onFiltersChange({ category: value as TechnologyCategory })}
            options={categoryOptions}
            placeholder="All Categories"
          />
        </FilterSection>

        {/* Status Filter */}
        <FilterSection title="Status">
          <SelectFilter
            value={filters.status || ''}
            onChange={(value) => onFiltersChange({ status: value as TechnologyStatus })}
            options={statusOptions}
            placeholder="All Statuses"
          />
        </FilterSection>

        {/* Difficulty Filter */}
        <FilterSection title="Difficulty">
          <SelectFilter
            value={filters.difficultyLevel || ''}
            onChange={(value) => onFiltersChange({ difficultyLevel: value as DifficultyLevel })}
            options={difficultyOptions}
            placeholder="All Difficulties"
          />
        </FilterSection>

        {/* Sort Options */}
        <FilterSection title="Sort By">
          <div className="space-y-2">
            <SelectFilter
              value={filters.sortBy || 'createdAt'}
              onChange={(value) => onFiltersChange({ sortBy: value })}
              options={sortOptions}
              placeholder="Sort Field"
            />
            <div className="flex gap-2">
              <button
                onClick={() => onFiltersChange({ sortOrder: 'asc' })}
                className={`
                  flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200
                  ${filters.sortOrder === 'asc'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-700/50 text-primary-300 border border-primary-500/10 hover:border-primary-500/30'
                  }
                `}
              >
                Ascending
              </button>
              <button
                onClick={() => onFiltersChange({ sortOrder: 'desc' })}
                className={`
                  flex-1 px-3 py-2 text-xs rounded-lg transition-all duration-200
                  ${filters.sortOrder === 'desc'
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'bg-dark-700/50 text-primary-300 border border-primary-500/10 hover:border-primary-500/30'
                  }
                `}
              >
                Descending
              </button>
            </div>
          </div>
        </FilterSection>
      </div>

      {/* Tags Filter */}
      <FilterSection title="Tags">
        <TagsFilter
          selectedTags={filters.tags || []}
          availableTags={availableTags}
          onChange={(tags) => onFiltersChange({ tags })}
        />
      </FilterSection>

      {/* Featured Toggle */}
      <FilterSection title="Featured">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isFeatured === true}
              onChange={(e) => {
                const newFilters: Partial<TechnologyFilters> = {};
                if (e.target.checked) {
                  newFilters.isFeatured = true;
                }
                onFiltersChange(newFilters);
              }}
              className="w-4 h-4 text-primary-500 bg-dark-800 border-primary-500/30 rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm text-primary-300">Featured only</span>
          </label>
        </div>
      </FilterSection>
    </motion.div>
  );
};
