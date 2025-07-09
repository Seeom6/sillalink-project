"use client"

import { ReactNode } from "react"
import Button from "@/app/shared/ui/button"

interface FormActionsProps {
  variant?: "admin" | "main"
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  primaryType?: "button" | "submit"
  secondaryType?: "button" | "submit"
  isLoading?: boolean
  disabled?: boolean
  children?: ReactNode
  className?: string
}

export const FormActions = ({
  variant = "main",
  primaryLabel = "Submit",
  secondaryLabel = "Cancel",
  onPrimary,
  onSecondary,
  primaryType = "submit",
  secondaryType = "button",
  isLoading = false,
  disabled = false,
  children,
  className = ""
}: FormActionsProps) => {
  const containerStyles = {
    admin: "flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200",
    main: "flex flex-col sm:flex-row gap-4 pt-6"
  }

  const buttonStyles = {
    admin: {
      primary: "w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-12 px-6 text-base touch-manipulation order-2 sm:order-1",
      secondary: "w-full sm:w-auto h-12 px-6 text-base touch-manipulation order-1 sm:order-2"
    },
    main: {
      primary: "w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg touch-manipulation",
      secondary: "w-full sm:w-auto h-14 px-8 text-lg touch-manipulation"
    }
  }

  if (children) {
    return (
      <div className={`${containerStyles[variant]} ${className}`}>
        {children}
      </div>
    )
  }

  return (
    <div className={`${containerStyles[variant]} ${className}`}>
      <Button
        type={primaryType}
        onClick={onPrimary}
        disabled={disabled || isLoading}
        className={buttonStyles[variant].primary}
      >
        {isLoading ? "Loading..." : primaryLabel}
      </Button>
      
      {onSecondary && (
        <Button
          type={secondaryType}
          variant="outline"
          onClick={onSecondary}
          disabled={isLoading}
          className={buttonStyles[variant].secondary}
        >
          {secondaryLabel}
        </Button>
      )}
    </div>
  )
}
