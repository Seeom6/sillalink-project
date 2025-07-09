import { Badge } from "@/app/shared/ui/badge"
import { ProjectPriority } from "@/app/types/adminProjectTypes"

interface ProjectPriorityBadgeProps {
  priority: ProjectPriority
}

export const ProjectPriorityBadge = ({ priority }: ProjectPriorityBadgeProps) => {
  const getPriorityConfig = (priority: ProjectPriority) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Low',
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'medium':
        return {
          label: 'Medium',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
      case 'high':
        return {
          label: 'High',
          className: 'bg-orange-100 text-orange-800 border-orange-200'
        }
      case 'critical':
        return {
          label: 'Critical',
          className: 'bg-red-100 text-red-800 border-red-200'
        }
      default:
        return {
          label: priority,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getPriorityConfig(priority)

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} font-medium`}
    >
      {config.label}
    </Badge>
  )
}
