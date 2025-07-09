"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Container } from "../layout/Container"
import { PageHeader } from "../layout/PageHeader"
import { ContentGrid } from "../content/ContentGrid"
import { ProjectCard } from "../content/ProjectCard"
import { LoadingState } from "../data-display/LoadingState"
import { EmptyState } from "../data-display/EmptyState"
import Button from "@/app/shared/ui/button"
import { useFeaturedProjects } from "@/app/shared/hooks/useProjects"
import { Project } from "@/app/data/models/Project"

interface ProjectsSectionProps {
  variant?: "admin" | "main"
  title?: string
  description?: string
  showHeader?: boolean
  limit?: number
  showViewAll?: boolean
  onViewAll?: () => void
  className?: string
}

export const ProjectsSection = ({
  variant = "main",
  title = "Featured Projects",
  description = "Explore our latest work and creative solutions",
  showHeader = true,
  limit = 6,
  showViewAll = true,
  onViewAll,
  className = ""
}: ProjectsSectionProps) => {
  const { data: projectsResponse, isLoading, error } = useFeaturedProjects(limit)
  const [currentSlide, setCurrentSlide] = useState(0)

  const projects = projectsResponse?.data || []
  const totalSlides = Math.ceil(projects.length / (variant === "main" ? 3 : 4))

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getVisibleProjects = () => {
    const itemsPerSlide = variant === "main" ? 3 : 4
    const startIndex = currentSlide * itemsPerSlide
    return projects.slice(startIndex, startIndex + itemsPerSlide)
  }

  const handleProjectEdit = (project: Project) => {
    // Admin-specific edit functionality - implement navigation to edit page
    if (variant === "admin") {
      // Navigate to edit page or open edit modal
    }
  }

  const handleProjectDelete = (project: Project) => {
    // Admin-specific delete functionality - implement delete confirmation
    if (variant === "admin") {
      // Show delete confirmation dialog
    }
  }

  const handleProjectView = (project: Project) => {
    if (variant === "main" && project.liveUrl) {
      window.open(project.liveUrl, '_blank')
    } else if (variant === "admin") {
      // Navigate to project details page
    }
  }

  const sectionStyles = {
    admin: "py-6 sm:py-8",
    main: "py-12 sm:py-16 lg:py-20"
  }

  const headerActions = showViewAll && onViewAll ? (
    <Button
      variant="outline"
      onClick={onViewAll}
      className="flex items-center gap-2"
    >
      View All Projects
      <ExternalLink className="w-4 h-4" />
    </Button>
  ) : undefined

  if (error) {
    return (
      <section className={`${sectionStyles[variant]} ${className}`}>
        <Container variant={variant}>
          <div className="text-center text-red-600">
            Error loading projects. Please try again later.
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
            actions={headerActions}
          />
        )}

        {isLoading ? (
          <LoadingState
            variant={variant}
            type="grid"
            count={limit}
          />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="There are no featured projects to display at the moment."
            variant={variant}
          />
        ) : (
          <div className="relative">
            {/* Projects Grid/Slider */}
            {variant === "main" && projects.length > 3 ? (
              // Slider for main variant when there are many projects
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <ContentGrid
                        variant={variant}
                        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                        gap="lg"
                      >
                        {projects
                          .slice(slideIndex * 3, (slideIndex + 1) * 3)
                          .map((project) => (
                            <ProjectCard
                              key={project.id}
                              project={project}
                              variant={variant}
                              onView={handleProjectView}
                            />
                          ))}
                      </ContentGrid>
                    </div>
                  ))}
                </div>

                {/* Slider Controls */}
                {totalSlides > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-shadow"
                      aria-label="Previous projects"
                    >
                      <ChevronLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:shadow-xl transition-shadow"
                      aria-label="Next projects"
                    >
                      <ChevronRight className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Slide Indicators */}
                    <div className="flex justify-center mt-8 gap-2">
                      {Array.from({ length: totalSlides }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentSlide ? 'bg-primary' : 'bg-gray-300'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              // Grid for admin variant or when there are few projects
              <ContentGrid
                variant={variant}
                columns={{
                  mobile: 1,
                  tablet: 2,
                  desktop: variant === "admin" ? 3 : 3,
                  large: variant === "admin" ? 4 : 3
                }}
                gap={variant === "admin" ? "md" : "lg"}
              >
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    variant={variant}
                    onEdit={variant === "admin" ? handleProjectEdit : undefined}
                    onDelete={variant === "admin" ? handleProjectDelete : undefined}
                    onView={handleProjectView}
                  />
                ))}
              </ContentGrid>
            )}
          </div>
        )}
      </Container>
    </section>
  )
}
