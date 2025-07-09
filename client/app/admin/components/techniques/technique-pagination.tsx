"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Button from "@/app/shared/ui/button"

interface TechniquePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const TechniquePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: TechniquePaginationProps) => {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 mt-6 sm:mt-8">
      {/* Mobile: Page Info */}
      <div className="text-sm text-gray-600 sm:hidden">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 h-10 px-3 sm:px-4 touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>

        {/* Page Numbers - Hidden on very small screens */}
        <div className="hidden xs:flex items-center gap-1">
          {getVisiblePages().map((page, index) => (
            <div key={index}>
              {page === "..." ? (
                <span className="px-2 sm:px-3 py-2 text-gray-500 text-sm">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 p-0 text-sm touch-manipulation ${
                    currentPage === page
                      ? "bg-primary text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 h-10 px-3 sm:px-4 touch-manipulation"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
