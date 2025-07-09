"use client"

import { useState, useCallback } from "react"
import { MoreHorizontal, Info, Trash2, Plus } from "lucide-react"
import { useGetTechniques } from "@/app/hooks/technique/useTechnique"
import { Technique } from "@/app/types/techniqueTypes"
import { TechniqueCard } from "./technique-card"
import { TechniqueFilters } from "./technique-filters"
import { TechniquePagination } from "./technique-pagination"
import { EmptyState } from "./technique-empty-state"
import Button from "@/app/shared/ui/button"
import { Card } from "@/app/shared/ui/Card"

interface TechniquesTableProps {
  onAddTechnique?: () => void
  onEditTechnique?: (technique: Technique) => void
  onDeleteTechnique?: (technique: Technique) => void
  onViewTechnique?: (technique: Technique) => void
}

export const TechniquesTable = ({
  onAddTechnique = () => {},
  onEditTechnique = (technique) => {},
  onDeleteTechnique = (technique) => {},
  onViewTechnique = (technique) => {},
}: TechniquesTableProps) => {
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    difficulty: "all",
    status: "all",
    page: 1,
    limit: 12,
  })

  const { data: techniques, isLoading, error } = useGetTechniques(filters)

  const handleSearchChange = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, category, page: 1 }))
  }, [])

  const handleDifficultyChange = useCallback((difficulty: string) => {
    setFilters((prev) => ({ ...prev, difficulty, page: 1 }))
  }, [])

  const handleStatusChange = useCallback((status: string) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          Error loading techniques: {error.message}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">Work Techniques</h2>
          <p className="text-gray-600 mt-1">
            {techniques?.total || 0} techniques found
          </p>
        </div>
        <Button
          onClick={onAddTechnique}
          className="bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] px-4 py-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">Add Work Techniques</span>
        </Button>
      </div>

      {/* Filters */}
      <TechniqueFilters
        search={filters.search}
        category={filters.category}
        difficulty={filters.difficulty}
        status={filters.status}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onDifficultyChange={handleDifficultyChange}
        onStatusChange={handleStatusChange}
      />

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="p-4 sm:p-6 animate-pulse">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : techniques?.data?.length === 0 ? (
        <EmptyState onAddTechnique={onAddTechnique} />
      ) : (
        <>
          {/* Techniques Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 xl:gap-8">
            {techniques?.data?.map((technique: Technique) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                onEdit={() => onEditTechnique(technique)}
                onDelete={() => onDeleteTechnique(technique)}
                onView={() => onViewTechnique(technique)}
              />
            ))}
          </div>

          {/* Pagination */}
          {techniques && techniques.total > filters.limit && (
            <TechniquePagination
              currentPage={filters.page}
              totalPages={Math.ceil(techniques.total / filters.limit)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}
