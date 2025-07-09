"use client";

import { useState } from "react";
import { X, RotateCcw } from "lucide-react";
import {
  TechnologyFilters as TechnologyFiltersType,
  TechnologyCategory,
  TechnologyStatus,
  DifficultyLevel,
  TECHNOLOGY_CATEGORIES,
  TECHNOLOGY_STATUSES,
  DIFFICULTY_LEVELS
} from "@/app/types/technologyTypes";
import Button from "@/app/shared/ui/button";
import { Input } from "@/app/shared/ui/input";
import { Label } from "@/app/shared/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select";
import { Checkbox } from "@/app/shared/ui/checkbox";
import { Slider } from "@/app/shared/ui/slider";

interface TechnologyFiltersProps {
  filters: TechnologyFiltersType;
  onFiltersChange: (filters: Partial<TechnologyFiltersType>) => void;
  onReset: () => void;
}

export const TechnologyFilters = ({
  filters,
  onFiltersChange,
  onReset
}: TechnologyFiltersProps) => {
  const [localTags, setLocalTags] = useState<string>(
    filters.tags?.join(", ") || ""
  );
  const [proficiencyRange, setProficiencyRange] = useState<[number, number]>([
    filters.proficiencyLevel?.min || 0,
    filters.proficiencyLevel?.max || 100
  ]);

  const handleCategoryChange = (value: string) => {
    const updates: Partial<TechnologyFiltersType> = {};
    if (value !== "all") {
      updates.category = value as TechnologyCategory;
    }
    onFiltersChange(updates);
  };

  const handleStatusChange = (value: string) => {
    const updates: Partial<TechnologyFiltersType> = {};
    if (value !== "all") {
      updates.status = value as TechnologyStatus;
    }
    onFiltersChange(updates);
  };

  const handleDifficultyChange = (value: string) => {
    const updates: Partial<TechnologyFiltersType> = {};
    if (value !== "all") {
      updates.difficultyLevel = value as DifficultyLevel;
    }
    onFiltersChange(updates);
  };

  const handleFeaturedChange = (checked: boolean) => {
    const updates: Partial<TechnologyFiltersType> = {};
    if (checked) {
      updates.isFeatured = true;
    }
    onFiltersChange(updates);
  };

  const handleSortByChange = (value: string) => {
    onFiltersChange({
      sortBy: value as keyof TechnologyFiltersType
    });
  };

  const handleSortOrderChange = (value: string) => {
    onFiltersChange({
      sortOrder: value as "asc" | "desc"
    });
  };

  const handleTagsChange = (value: string) => {
    setLocalTags(value);
    const tags = value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const updates: Partial<TechnologyFiltersType> = {};
    if (tags.length > 0) {
      updates.tags = tags;
    }
    onFiltersChange(updates);
  };

  const handleProficiencyChange = (value: number | number[]) => {
    const values = Array.isArray(value) ? value : [value];
    const [min, max] = values;
    if (min !== undefined && max !== undefined) {
      setProficiencyRange([min, max]);

      const proficiencyLevel: { min?: number; max?: number } = {};
      if (min > 0) {
        proficiencyLevel.min = min;
      }
      if (max < 100) {
        proficiencyLevel.max = max;
      }

      onFiltersChange({
        proficiencyLevel
      });
    }
  };

  const handleLimitChange = (value: string) => {
    onFiltersChange({
      limit: parseInt(value)
    });
  };

  const handleReset = () => {
    setLocalTags("");
    setProficiencyRange([0, 100]);
    onReset();
  };

  const hasActiveFilters = 
    filters.category ||
    filters.status ||
    filters.difficultyLevel ||
    filters.isFeatured ||
    (filters.tags && filters.tags.length > 0) ||
    (filters.proficiencyLevel?.min && filters.proficiencyLevel.min > 0) ||
    (filters.proficiencyLevel?.max && filters.proficiencyLevel.max < 100);

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All
          </Button>
        )}
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {TECHNOLOGY_CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {TECHNOLOGY_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Difficulty Filter */}
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={filters.difficultyLevel || "all"}
            onValueChange={handleDifficultyChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {DIFFICULTY_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sortBy">Sort By</Label>
          <Select
            value={filters.sortBy || "createdAt"}
            onValueChange={handleSortByChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="updatedAt">Updated Date</SelectItem>
              <SelectItem value="proficiencyLevel">Proficiency Level</SelectItem>
              <SelectItem value="projectsUsedIn">Projects Used In</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Select
            value={filters.sortOrder || "desc"}
            onValueChange={handleSortOrderChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items Per Page */}
        <div className="space-y-2">
          <Label htmlFor="limit">Items Per Page</Label>
          <Select
            value={filters.limit?.toString() || "12"}
            onValueChange={handleLimitChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="space-y-4 pt-4 border-t">
        {/* Featured Checkbox */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={filters.isFeatured || false}
            onCheckedChange={handleFeaturedChange}
          />
          <Label htmlFor="featured">Show only featured technologies</Label>
        </div>

        {/* Proficiency Range */}
        <div className="space-y-3">
          <Label>Proficiency Level Range</Label>
          <div className="px-3">
            <Slider
              value={proficiencyRange}
              onValueChange={handleProficiencyChange}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{proficiencyRange[0]}%</span>
              <span>{proficiencyRange[1]}%</span>
            </div>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            placeholder="e.g. javascript, react, frontend"
            value={localTags}
            onChange={(e) => handleTagsChange(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Enter tags separated by commas to filter technologies
          </p>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Active filters:</span>
            {filters.category && (
              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Category: {TECHNOLOGY_CATEGORIES.find(c => c.value === filters.category)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleCategoryChange("all")} />
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Status: {TECHNOLOGY_STATUSES.find(s => s.value === filters.status)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleStatusChange("all")} />
              </span>
            )}
            {filters.difficultyLevel && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                Difficulty: {DIFFICULTY_LEVELS.find(d => d.value === filters.difficultyLevel)?.label}
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleDifficultyChange("all")} />
              </span>
            )}
            {filters.isFeatured && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                Featured Only
                <X className="w-3 h-3 cursor-pointer" onClick={() => handleFeaturedChange(false)} />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
