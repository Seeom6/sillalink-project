"use client"

import { Card } from "@/app/shared/ui/Card"

interface LoadingStateProps {
  variant?: "admin" | "main"
  type?: "grid" | "table" | "card" | "list"
  count?: number
  className?: string
}

export const LoadingState = ({
  variant = "main",
  type = "grid",
  count = 6,
  className = ""
}: LoadingStateProps) => {
  const renderGridSkeleton = () => (
    <div className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${variant === "admin" ? "xl:grid-cols-4" : ""} gap-4 sm:gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
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
  )

  const renderCardSkeleton = () => (
    <Card className={`p-4 sm:p-6 animate-pulse ${className}`}>
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </Card>
  )

  const renderListSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border animate-pulse">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderTableSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border animate-pulse">
          <div className="w-12 h-8 bg-gray-200 rounded"></div>
          <div className="w-16 h-12 bg-gray-200 rounded"></div>
          <div className="flex-1 h-4 bg-gray-200 rounded"></div>
          <div className="w-20 h-4 bg-gray-200 rounded"></div>
          <div className="w-16 h-6 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  )

  switch (type) {
    case "grid":
      return renderGridSkeleton()
    case "card":
      return renderCardSkeleton()
    case "list":
      return renderListSkeleton()
    case "table":
      return renderTableSkeleton()
    default:
      return renderGridSkeleton()
  }
}
