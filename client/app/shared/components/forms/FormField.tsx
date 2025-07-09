"use client"

import { ReactNode, forwardRef } from "react"
import { Card } from "@/app/shared/ui/Card"

interface FormFieldProps {
  label: string
  children: ReactNode
  error?: string
  required?: boolean
  description?: string
  variant?: "admin" | "main"
  className?: string
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(({
  label,
  children,
  error,
  required = false,
  description,
  variant = "main",
  className = ""
}, ref) => {
  const labelStyles = {
    admin: "block text-sm font-medium text-gray-700 mb-2",
    main: "block text-base font-medium text-gray-800 mb-3"
  }

  const descriptionStyles = {
    admin: "text-xs text-gray-500 mt-1",
    main: "text-sm text-gray-600 mt-2"
  }

  const errorStyles = {
    admin: "text-xs text-red-600 mt-1",
    main: "text-sm text-red-600 mt-2"
  }

  return (
    <div ref={ref} className={`space-y-1 ${className}`}>
      <label className={labelStyles[variant]}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {children}
      
      {description && (
        <p className={descriptionStyles[variant]}>
          {description}
        </p>
      )}
      
      {error && (
        <p className={errorStyles[variant]}>
          {error}
        </p>
      )}
    </div>
  )
})

FormField.displayName = "FormField"

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  variant?: "admin" | "main"
  className?: string
}

export const FormSection = ({
  title,
  description,
  children,
  variant = "main",
  className = ""
}: FormSectionProps) => {
  const titleStyles = {
    admin: "text-base sm:text-lg font-semibold mb-4",
    main: "text-lg sm:text-xl font-bold mb-6"
  }

  const descriptionStyles = {
    admin: "text-sm text-gray-600 mb-4",
    main: "text-base text-gray-600 mb-6"
  }

  const cardStyles = {
    admin: "p-4 sm:p-6",
    main: "p-6 sm:p-8"
  }

  return (
    <Card className={`${cardStyles[variant]} ${className}`}>
      <h3 className={titleStyles[variant]}>{title}</h3>
      {description && (
        <p className={descriptionStyles[variant]}>{description}</p>
      )}
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </Card>
  )
}
