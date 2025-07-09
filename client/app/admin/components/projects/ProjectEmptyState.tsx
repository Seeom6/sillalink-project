import { FolderOpen, Plus } from "lucide-react"
import Button from "@/app/shared/ui/button"

interface ProjectEmptyStateProps {
  onAddProject: () => void
}

export const ProjectEmptyState = ({ onAddProject }: ProjectEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FolderOpen className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No projects found
      </h3>
      
      <p className="text-gray-500 text-center mb-6 max-w-md">
        Get started by creating your first project. You can manage project details, 
        assign team members, and track progress all in one place.
      </p>
      
      <Button
        onClick={onAddProject}
        className="flex items-center gap-2 bg-[#2496ED] hover:bg-[#1976D2] text-white"
      >
        <Plus className="w-4 h-4" />
        Create Your First Project
      </Button>
    </div>
  )
}
