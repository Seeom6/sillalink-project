"use client"

import { useState } from "react"
import { MoreHorizontal, Info, Trash2, Edit } from "lucide-react"
import { Technique } from "@/app/types/techniqueTypes"
import { Card } from "@/app/shared/ui/Card"
import Button from "@/app/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu"
import { Badge } from "@/app/shared/ui/badge"
import Image from "next/image"

interface TechniqueCardProps {
  technique: Technique
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800"
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800"
    case "Advanced":
      return "bg-orange-100 text-orange-800"
    case "Expert":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getCategoryIcon = (category: string) => {
  // Return appropriate icon based on category
  switch (category) {
    case "UI/UX Design":
      return "🎨"
    case "Software Development":
      return "💻"
    case "Data & AI Solutions":
      return "🤖"
    case "DevOps & Infrastructure":
      return "⚙️"
    case "Mobile Development":
      return "📱"
    case "Web Development":
      return "🌐"
    case "Database Management":
      return "🗄️"
    case "Testing & QA":
      return "🧪"
    default:
      return "🔧"
  }
}

export const TechniqueCard = ({
  technique,
  onEdit,
  onDelete,
  onView,
}: TechniqueCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="p-4 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer border-none bg-white touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onView}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Technique Image/Icon */}
        <div className="flex-shrink-0">
          {technique.image ? (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={technique.image}
                alt={technique.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
              <span className="text-xl sm:text-2xl">{getCategoryIcon(technique.category)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Category Icon and Name */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary"></div>
                </div>
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                  {technique.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">
                {technique.description}
              </p>

              {/* Badges */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className={`text-xs ${getDifficultyColor(technique.difficulty)} px-2 py-1`}
                >
                  {technique.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-1 truncate max-w-[120px] sm:max-w-none">
                  {technique.category}
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onView()
                }}
                className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] sm:min-h-auto sm:p-1 touch-manipulation"
              >
                <Info className="w-4 h-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="text-gray-400 hover:text-gray-600 p-2 min-h-[44px] sm:min-h-auto sm:p-1 touch-manipulation"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={onView}>
                    <Info className="w-4 h-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Technique
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Technique
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies */}
      {technique.technologies && technique.technologies.length > 0 && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs text-gray-500 flex-shrink-0">Technologies:</span>
            {technique.technologies.slice(0, 2).map((tech, index) => (
              <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5 truncate max-w-[80px] sm:max-w-none">
                {tech}
              </Badge>
            ))}
            {technique.technologies.length > 2 && (
              <Badge variant="outline" className="text-xs px-1.5 py-0.5 flex-shrink-0">
                +{technique.technologies.length - 2} more
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
