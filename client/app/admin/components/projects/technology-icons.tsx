import Image from "next/image"
import { memo } from "react"
import type { Technology } from "@/app/types/projectTypes"

interface TechnologyIconsProps {
  technologies: Technology[]
  maxVisible?: number
  className?: string
}

export const TechnologyIcons = memo(({ technologies, maxVisible = 6, className }: TechnologyIconsProps) => {
  const visibleTechs = technologies.slice(0, maxVisible)
  const remainingCount = technologies.length - maxVisible

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visibleTechs.map((tech) => (
        <div
          key={tech.id}
          className="w-6 h-6 rounded-sm overflow-hidden bg-gray-100 flex items-center justify-center"
          title={tech.name}
        >
          <Image
            src={tech.icon || "/placeholder.svg?height=24&width=24"}
            alt={tech.name}
            width={20}
            height={20}
            className="object-contain"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-6 h-6 rounded-sm bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
          +{remainingCount}
        </div>
      )}
    </div>
  )
})

TechnologyIcons.displayName = "TechnologyIcons"
