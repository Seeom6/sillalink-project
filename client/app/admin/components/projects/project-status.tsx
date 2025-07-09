import { memo } from "react"
import { Badge } from "@/app/shared/ui/badge"

interface ProjectStatusProps {
  raised: boolean
  className?: string
}

export const ProjectStatus = memo(({ raised, className }: ProjectStatusProps) => {
  return (
    <Badge
      variant={raised ? "default" : "secondary"}
      className={`${raised ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-100"} ${className}`}
    >
      {raised ? "Raised" : "Not raised"}
    </Badge>
  )
})

ProjectStatus.displayName = "ProjectStatus"
