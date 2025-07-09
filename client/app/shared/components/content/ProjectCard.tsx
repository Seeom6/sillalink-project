"use client"

import { useState } from "react"
import { MoreHorizontal, ExternalLink, Edit, Trash2, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Card } from "@/app/shared/ui/Card"
import Button from "@/app/shared/ui/button"
import { StatusBadge } from "../data-display/StatusBadge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu"

interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  status?: string
  liveUrl?: string
  githubUrl?: string
  category?: string
  startDate?: string
  endDate?: string
}

interface ProjectCardProps {
  project: Project
  variant?: "admin" | "main"
  onEdit?: (project: Project) => void
  onDelete?: (project: Project) => void
  onView?: (project: Project) => void
  className?: string
}

export const ProjectCard = ({
  project,
  variant = "main",
  onEdit,
  onDelete,
  onView,
  className = ""
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  const cardStyles = {
    admin: "p-4 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-none bg-white",
    main: "p-6 sm:p-8 hover:shadow-xl transition-all duration-300 cursor-pointer bg-white group"
  }

  const imageStyles = {
    admin: "w-full h-32 sm:h-40 object-cover rounded-lg mb-4",
    main: "w-full h-48 sm:h-56 object-cover rounded-xl mb-6 group-hover:scale-105 transition-transform duration-300"
  }

  const titleStyles = {
    admin: "font-semibold text-gray-900 text-base sm:text-lg mb-2 line-clamp-2",
    main: "font-bold text-gray-900 text-xl sm:text-2xl mb-4 line-clamp-2"
  }

  const descriptionStyles = {
    admin: "text-gray-600 text-sm line-clamp-2 mb-3",
    main: "text-gray-600 text-base line-clamp-3 mb-6"
  }

  const techStyles = {
    admin: "flex flex-wrap gap-1.5 mb-3",
    main: "flex flex-wrap gap-2 mb-6"
  }

  const techBadgeStyles = {
    admin: "px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs",
    main: "px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
  }

  const handleCardClick = () => {
    if (variant === "main" && project.liveUrl) {
      window.open(project.liveUrl, '_blank')
    } else if (onView) {
      onView(project)
    }
  }

  return (
    <Card 
      className={`${cardStyles[variant]} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Project Image */}
      {project.image && (
        <div className="relative overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            width={400}
            height={300}
            className={imageStyles[variant]}
          />
          {variant === "admin" && project.status && (
            <div className="absolute top-2 left-2">
              <StatusBadge status={project.status} variant="admin" type="status" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <h3 className={titleStyles[variant]}>
            {project.title}
          </h3>
          
          {variant === "admin" && (
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
                  <DropdownMenuItem onClick={() => onView(project)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                )}
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={() => onDelete(project)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <p className={descriptionStyles[variant]}>
          {project.description}
        </p>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className={techStyles[variant]}>
            {project.technologies.slice(0, variant === "admin" ? 3 : 4).map((tech, index) => (
              <span key={index} className={techBadgeStyles[variant]}>
                {tech}
              </span>
            ))}
            {project.technologies.length > (variant === "admin" ? 3 : 4) && (
              <span className={techBadgeStyles[variant]}>
                +{project.technologies.length - (variant === "admin" ? 3 : 4)} more
              </span>
            )}
          </div>
        )}

        {/* Actions for main variant */}
        {variant === "main" && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            {project.liveUrl && (
              <Button
                variant="primary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.liveUrl, '_blank')
                }}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </Button>
            )}
            {project.githubUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(project.githubUrl, '_blank')
                }}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                GitHub
              </Button>
            )}
          </div>
        )}

        {/* Admin metadata */}
        {variant === "admin" && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
            {project.category && (
              <span>Category: {project.category}</span>
            )}
            {project.startDate && (
              <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
