"use client"

import { ReactNode } from "react"

interface ContainerProps {
  children: ReactNode
  variant?: "admin" | "main"
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

export const Container = ({
  children,
  variant = "main",
  size = "lg",
  className = ""
}: ContainerProps) => {
  const baseStyles = "mx-auto px-3 sm:px-4 lg:px-6 xl:px-8"
  
  const sizeStyles = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full"
  }

  const variantStyles = {
    admin: "py-4 sm:py-6 lg:py-8 xl:py-10",
    main: "py-6 sm:py-8 lg:py-12 xl:py-16"
  }

  const paddingStyles = variant === "admin" 
    ? "safe-area-padding" 
    : ""

  return (
    <div className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${paddingStyles} ${className}`}>
      {children}
    </div>
  )
}
