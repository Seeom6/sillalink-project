"use client"

import { PenTool, Code, BarChart3, Lightbulb } from "lucide-react"
import { Container } from "../layout/Container"
import { PageHeader } from "../layout/PageHeader"
import { ContentGrid } from "../content/ContentGrid"
import { ServiceCard } from "../content/ServiceCard"
import { LoadingState } from "../data-display/LoadingState"
import { EmptyState } from "../data-display/EmptyState"
import { useFeaturedServices } from "@/app/shared/hooks/useServices"
import { Service } from "@/app/data/models/Service"

interface ServicesSectionProps {
  variant?: "admin" | "main"
  title?: string
  description?: string
  showHeader?: boolean
  limit?: number
  className?: string
}

// Icon mapping for services
const getServiceIcon = (iconName?: string) => {
  const iconMap = {
    "PenTool": <PenTool className="w-8 h-8 text-white" />,
    "Code": <Code className="w-8 h-8 text-white" />,
    "BarChart3": <BarChart3 className="w-8 h-8 text-white" />,
    "Lightbulb": <Lightbulb className="w-8 h-8 text-white" />,
  }
  
  return iconMap[iconName as keyof typeof iconMap] || <Code className="w-8 h-8 text-white" />
}

export const ServicesSection = ({
  variant = "main",
  title = "Our Services",
  description = "We provide comprehensive solutions to help your business grow",
  showHeader = true,
  limit = 4,
  className = ""
}: ServicesSectionProps) => {
  const { data: servicesResponse, isLoading, error } = useFeaturedServices(limit)

  const services = servicesResponse?.data || []

  const handleServiceEdit = (service: Service) => {
    // Admin-specific edit functionality - implement navigation to edit page
    if (variant === "admin") {
      // Navigate to edit page or open edit modal
    }
  }

  const handleServiceDelete = (service: Service) => {
    // Admin-specific delete functionality - implement delete confirmation
    if (variant === "admin") {
      // Show delete confirmation dialog
    }
  }

  const handleServiceView = (service: Service) => {
    // Could open a modal or navigate to service details
    if (variant === "admin") {
      // Navigate to service details page
    }
  }

  const sectionStyles = {
    admin: "py-6 sm:py-8",
    main: "py-12 sm:py-16 lg:py-20 bg-gray-50"
  }

  if (error) {
    return (
      <section className={`${sectionStyles[variant]} ${className}`}>
        <Container variant={variant}>
          <div className="text-center text-red-600">
            Error loading services. Please try again later.
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className={`${sectionStyles[variant]} ${className}`}>
      <Container variant={variant}>
        {showHeader && (
          <PageHeader
            title={title}
            description={description}
            variant={variant}
          />
        )}

        {isLoading ? (
          <LoadingState
            variant={variant}
            type="grid"
            count={limit}
          />
        ) : services.length === 0 ? (
          <EmptyState
            title="No services found"
            description="There are no services to display at the moment."
            variant={variant}
          />
        ) : (
          <ContentGrid
            variant={variant}
            columns={{
              mobile: 1,
              tablet: 2,
              desktop: variant === "admin" ? 3 : 2,
              large: variant === "admin" ? 4 : 4
            }}
            gap={variant === "admin" ? "md" : "lg"}
          >
            {services.map((service) => {
              // Add icon component to service
              const serviceWithIcon = {
                ...service,
                iconComponent: getServiceIcon(service.icon)
              }

              return (
                <ServiceCard
                  key={service.id}
                  service={serviceWithIcon}
                  variant={variant}
                  onEdit={variant === "admin" ? handleServiceEdit : undefined}
                  onDelete={variant === "admin" ? handleServiceDelete : undefined}
                  onView={handleServiceView}
                />
              )
            })}
          </ContentGrid>
        )}
      </Container>
    </section>
  )
}
