import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import Button from "@/app/shared/ui/button"
import { Input } from "@/app/shared/ui/input"
import { PROJECT_STATUSES, PROJECT_PRIORITIES } from "@/app/types/adminProjectTypes"

interface ProjectFiltersProps {
  filters: {
    search: string
    status: string
    priority: string
    managerId: string
    page: number
    limit: number
  }
  onFilterChange: (filters: Partial<ProjectFiltersProps['filters']>) => void
  totalCount: number
}

export const ProjectFilters = ({ filters, onFilterChange, totalCount }: ProjectFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearchChange = (value: string) => {
    onFilterChange({ search: value })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value })
  }

  const handlePriorityChange = (value: string) => {
    onFilterChange({ priority: value })
  }

  const handleManagerChange = (value: string) => {
    onFilterChange({ managerId: value })
  }

  const handleClearFilters = () => {
    onFilterChange({
      search: "",
      status: "all",
      priority: "all",
      managerId: "all",
    })
  }

  const hasActiveFilters = filters.search || 
    filters.status !== "all" || 
    filters.priority !== "all" || 
    filters.managerId !== "all"

  return (
    <div className="space-y-4">
      {/* Main Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
        >
          <option value="all">All Statuses</option>
          {PROJECT_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-40"
        >
          <option value="all">All Priorities</option>
          {PROJECT_PRIORITIES.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex items-center gap-2 text-gray-600"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Manager Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Manager
              </label>
              <select
                value={filters.managerId}
                onChange={(e) => handleManagerChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="all">All Managers</option>
                {/* TODO: Add dynamic manager options */}
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items per page
              </label>
              <select
                value={filters.limit.toString()}
                onChange={(e) => onFilterChange({ limit: parseInt(e.target.value) })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {Math.min(filters.limit, totalCount)} of {totalCount} projects
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600">
            Filters applied
          </span>
        )}
      </div>
    </div>
  )
}
