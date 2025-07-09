"use client"

import { Search, Filter } from "lucide-react"
import { TECHNIQUE_CATEGORIES, DIFFICULTY_LEVELS, TECHNIQUE_STATUS } from "@/app/types/techniqueTypes"
import Button from "@/app/shared/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select"

interface TechniqueFiltersProps {
  search: string
  category: string
  difficulty: string
  status: string
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  onDifficultyChange: (difficulty: string) => void
  onStatusChange: (status: string) => void
}

export const TechniqueFilters = ({
  search,
  category,
  difficulty,
  status,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onStatusChange,
}: TechniqueFiltersProps) => {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 space-y-4">
      <div className="flex flex-col gap-4">
        {/* Search */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search techniques..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-base sm:text-sm"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-3">
          {/* Category Filter */}
          <div className="flex-1 sm:flex-none sm:min-w-[200px] lg:min-w-[220px]">
            <Select value={category} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {TECHNIQUE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex-1 sm:flex-none sm:min-w-[160px] lg:min-w-[180px]">
            <Select value={difficulty} onValueChange={onDifficultyChange}>
              <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex-1 sm:flex-none sm:min-w-[140px] lg:min-w-[160px]">
            <Select value={status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full h-12 sm:h-10 text-base sm:text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {TECHNIQUE_STATUS.map((stat) => (
                  <SelectItem key={stat} value={stat}>
                    {stat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Button */}
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 whitespace-nowrap h-12 sm:h-10 px-4 lg:px-6 text-base sm:text-sm min-w-[100px] sm:min-w-auto lg:min-w-[120px]"
          >
            <Filter className="w-4 h-4 flex-shrink-0" />
            <span>Filter</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
