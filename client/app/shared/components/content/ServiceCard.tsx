"use client"

import { useState, ReactNode } from "react"
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Card } from "@/app/shared/ui/Card"
import Button from "@/app/shared/ui/button"
import { StatusBadge } from "../data-display/StatusBadge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu"

interface Service {
  id: string
  title: string
  description: string
  icon?: ReactNode
  status?: string
  category?: string
  price?: string
  features?: string[]
  delay?: number
}

interface ServiceCardProps {
  service: Service
  variant?: "admin" | "main"
  onEdit?: (service: Service) => void
  onDelete?: (service: Service) => void
  onView?: (service: Service) => void
  className?: string
}

export const ServiceCard = ({
  service,
  variant = "main",
  onEdit,
  onDelete,
  onView,
  className = ""
}: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const cardStyles = {
    admin: "p-4 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-none bg-white",
    main: "p-6 sm:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white group relative overflow-hidden"
  }

  const iconContainerStyles = {
    admin: "w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 flex-shrink-0",
    main: "w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
  }

  const titleStyles = {
    admin: "font-semibold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2",
    main: "font-bold text-gray-900 text-xl sm:text-2xl mb-4 line-clamp-2"
  }

  const descriptionStyles = {
    admin: "text-gray-600 text-sm line-clamp-3 mb-3",
    main: "text-gray-600 text-base line-clamp-4 mb-6 leading-relaxed"
  }

  const handleCardClick = () => {
    if (onView) {
      onView(service)
    }
  }

  return (
    <Card 
      className={`${cardStyles[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{
        animationDelay: variant === "main" && service.delay ? `${service.delay}s` : undefined
      }}
    >
      {/* Background decoration for main variant */}
      {variant === "main" && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500" />
      )}

      <div className="relative z-10">
        {/* Header with icon and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className={iconContainerStyles[variant]}>
            {service.icon}
          </div>
          
          {variant === "admin" && (
            <div className="flex items-center gap-2">
              {service.status && (
                <StatusBadge status={service.status} variant="admin" type="status" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-gray-600 p-1 h-8 w-8"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(service)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(service)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Service
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(service)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Service
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className={titleStyles[variant]}>
            {service.title}
          </h3>

          <p className={descriptionStyles[variant]}>
            {service.description}
          </p>

          {/* Features */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-2 mb-4">
              {service.features.slice(0, variant === "admin" ? 3 : 4).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
              {service.features.length > (variant === "admin" ? 3 : 4) && (
                <div className="text-xs text-gray-500">
                  +{service.features.length - (variant === "admin" ? 3 : 4)} more features
                </div>
              )}
            </div>
          )}

          {/* Price for main variant */}
          {variant === "main" && service.price && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Starting at</span>
                <span className="text-lg font-bold text-primary">{service.price}</span>
              </div>
            </div>
          )}

          {/* Admin metadata */}
          {variant === "admin" && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
              {service.category && (
                <span>Category: {service.category}</span>
              )}
              {service.price && (
                <span>Price: {service.price}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
