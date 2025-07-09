"use client"

import { memo } from "react"

interface StatusBadgeProps {
  status: "Active" | "Offline" | "Wait"
}

export const StatusBadge = memo(({ status }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Active":
        return {
          color: "bg-green-100 text-green-800",
          dot: "bg-green-500",
        }
      case "Offline":
        return {
          color: "bg-gray-100 text-gray-800",
          dot: "bg-gray-500",
        }
      case "Wait":
        return {
          color: "bg-yellow-100 text-yellow-800",
          dot: "bg-yellow-500",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          dot: "bg-gray-500",
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <span className={`w-2 h-2 rounded-full mr-1.5 ${config.dot}`}></span>
      {status}
    </span>
  )
})

StatusBadge.displayName = "StatusBadge"
