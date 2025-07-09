"use client"

import { ReactNode } from "react"
import { Plus } from "lucide-react"
import Button from "@/app/shared/ui/button"
import { Card } from "@/app/shared/ui/Card"

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  variant?: "admin" | "main"
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState = ({
  title,
  description,
  icon,
  variant = "main",
  actionLabel,
  onAction,
  className = ""
}: EmptyStateProps) => {
  const containerStyles = {
    admin: "p-6 sm:p-12 text-center border-dashed border-2 border-gray-300",
    main: "p-8 sm:p-16 text-center"
  }

  const iconStyles = {
    admin: "w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center",
    main: "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center"
  }

  const titleStyles = {
    admin: "text-base sm:text-lg font-semibold text-gray-900 mb-2",
    main: "text-xl sm:text-2xl font-bold text-gray-900 mb-4"
  }

  const descriptionStyles = {
    admin: "text-sm sm:text-base text-gray-600 mb-6 leading-relaxed",
    main: "text-base sm:text-lg text-gray-600 mb-8 leading-relaxed"
  }

  const buttonStyles = {
    admin: "bg-primary hover:bg-primary/90 text-white flex items-center gap-2 mx-auto h-12 px-6 text-base touch-manipulation",
    main: "bg-primary hover:bg-primary/90 text-white flex items-center gap-2 mx-auto h-14 px-8 text-lg touch-manipulation"
  }

  return (
    <Card className={`${containerStyles[variant]} ${className}`}>
      <div className="max-w-md mx-auto">
        {icon && (
          <div className={iconStyles[variant]}>
            {icon}
          </div>
        )}
        
        <h3 className={titleStyles[variant]}>
          {title}
        </h3>
        
        <p className={descriptionStyles[variant]}>
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            className={buttonStyles[variant]}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>{actionLabel}</span>
          </Button>
        )}
      </div>
    </Card>
  )
}
