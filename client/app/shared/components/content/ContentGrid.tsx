"use client"

import { ReactNode } from "react"

interface ContentGridProps {
  children: ReactNode
  variant?: "admin" | "main"
  columns?: {
    mobile?: number
    tablet?: number
    desktop?: number
    large?: number
  }
  gap?: "sm" | "md" | "lg"
  className?: string
}

export const ContentGrid = ({
  children,
  variant = "main",
  columns = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4
  },
  gap = "md",
  className = ""
}: ContentGridProps) => {
  const gapStyles = {
    sm: "gap-3 sm:gap-4",
    md: "gap-4 sm:gap-6",
    lg: "gap-6 sm:gap-8"
  }

  const getGridCols = () => {
    const { mobile = 1, tablet = 2, desktop = 3, large = 4 } = columns
    
    let gridClasses = `grid-cols-${mobile}`
    
    if (tablet) gridClasses += ` md:grid-cols-${tablet}`
    if (desktop) gridClasses += ` lg:grid-cols-${desktop}`
    if (large && variant === "admin") gridClasses += ` xl:grid-cols-${large}`
    
    return gridClasses
  }

  const variantStyles = {
    admin: "grid-responsive",
    main: ""
  }

  return (
    <div className={`grid ${getGridCols()} ${gapStyles[gap]} ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  )
}
