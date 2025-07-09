"use client"

import { memo } from "react"
import errorImage from "@/public/assets/errorDash.png"
interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = memo(
  ({
    title = "No Data Available",
    description = "No employees available at the moment. Use the button above to create one.",
    actionLabel = "Add Employee",
    onAction,
  }: EmptyStateProps) => {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-6">
          <img src={errorImage.src} alt="No data available" className="w-64 h-auto" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
        {onAction && (
          <button
            onClick={onAction}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    )
  },
)

EmptyState.displayName = "EmptyState"
