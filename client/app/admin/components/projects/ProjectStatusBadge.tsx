import { Badge } from "@/app/shared/ui/badge"
import { ProjectStatus } from "@/app/types/adminProjectTypes"

interface ProjectStatusBadgeProps {
  status: ProjectStatus
}

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active',
          className: 'bg-green-100 text-green-800 border-green-200'
        }
      case 'inactive':
        return {
          label: 'Inactive',
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
      case 'completed':
        return {
          label: 'Completed',
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        }
      case 'on-hold':
        return {
          label: 'On Hold',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 border-red-200'
        }
      default:
        return {
          label: status,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} font-medium`}
    >
      {config.label}
    </Badge>
  )
}
