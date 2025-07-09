"use client"

import { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import Button from "@/app/shared/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  variant?: "admin" | "main"
  showBackButton?: boolean
  backUrl?: string
  actions?: ReactNode
  className?: string
}

export const PageHeader = ({
  title,
  description,
  variant = "main",
  showBackButton = false,
  backUrl,
  actions,
  className = ""
}: PageHeaderProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl)
    } else {
      router.back()
    }
  }

  const baseStyles = "mb-6 sm:mb-8 xl:mb-10"
  const variantStyles = {
    admin: "border-b border-gray-200 pb-4 sm:pb-6",
    main: ""
  }

  const titleStyles = {
    admin: "text-xl sm:text-2xl xl:text-3xl font-bold text-gray-900",
    main: "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
  }

  const descriptionStyles = {
    admin: "text-sm sm:text-base xl:text-lg text-gray-600 mt-1",
    main: "text-base sm:text-lg lg:text-xl text-gray-600 mt-2 sm:mt-4"
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {showBackButton && (
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-4 text-gray-600 hover:text-gray-900 h-10 sm:h-auto px-3 sm:px-4 touch-manipulation"
        >
          <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>Back</span>
        </Button>
      )}
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="flex-1">
          <h1 className={titleStyles[variant]}>{title}</h1>
          {description && (
            <p className={descriptionStyles[variant]}>{description}</p>
          )}
        </div>
        
        {actions && (
          <div className="flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
