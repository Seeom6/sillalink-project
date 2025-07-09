"use client"

import { memo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import  Button  from "@/app/shared/ui/button"

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const TablePagination = memo(({ currentPage, totalPages, onPageChange }: TablePaginationProps) => {
  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button variant="outline" size="sm" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <Button
          key={index}
          size="sm"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={typeof page !== "number"}
          className={page === currentPage ? "bg-purple-600 hover:bg-purple-700" : ""}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
})

TablePagination.displayName = "TablePagination"
