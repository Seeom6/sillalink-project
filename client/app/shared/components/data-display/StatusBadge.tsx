"use client"

import { Badge } from "@/app/shared/ui/badge"

interface StatusBadgeProps {
  status: string
  variant?: "admin" | "main"
  type?: "status" | "difficulty" | "category" | "priority"
  className?: string
}

export const StatusBadge = ({
  status,
  variant = "main",
  type = "status",
  className = ""
}: StatusBadgeProps) => {
  const getStatusColor = (status: string, type: string) => {
    const statusLower = status.toLowerCase()
    
    switch (type) {
      case "status":
        switch (statusLower) {
          case "active":
          case "published":
          case "completed":
            return "bg-green-100 text-green-800"
          case "inactive":
          case "draft":
          case "pending":
            return "bg-yellow-100 text-yellow-800"
          case "archived":
          case "cancelled":
            return "bg-red-100 text-red-800"
          default:
            return "bg-gray-100 text-gray-800"
        }
      
      case "difficulty":
        switch (statusLower) {
          case "beginner":
          case "easy":
            return "bg-green-100 text-green-800"
          case "intermediate":
          case "medium":
            return "bg-yellow-100 text-yellow-800"
          case "advanced":
          case "hard":
            return "bg-orange-100 text-orange-800"
          case "expert":
          case "very hard":
            return "bg-red-100 text-red-800"
          default:
            return "bg-gray-100 text-gray-800"
        }
      
      case "priority":
        switch (statusLower) {
          case "high":
          case "urgent":
            return "bg-red-100 text-red-800"
          case "medium":
          case "normal":
            return "bg-yellow-100 text-yellow-800"
          case "low":
            return "bg-green-100 text-green-800"
          default:
            return "bg-gray-100 text-gray-800"
        }
      
      case "category":
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const sizeStyles = {
    admin: "text-xs px-2 py-1",
    main: "text-sm px-3 py-1"
  }

  const colorClass = getStatusColor(status, type)

  return (
    <Badge
      variant="secondary"
      className={`${colorClass} ${sizeStyles[variant]} ${className}`}
    >
      {status}
    </Badge>
  )
}
