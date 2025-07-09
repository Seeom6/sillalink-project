"use client"

import { Plus, Code } from "lucide-react"
import Button from "@/app/shared/ui/button"
import { Card } from "@/app/shared/ui/Card"

interface EmptyStateProps {
  onAddTechnique: () => void
}

export const EmptyState = ({ onAddTechnique }: EmptyStateProps) => {
  return (
    <Card className="p-6 sm:p-12 text-center border-dashed border-2 border-gray-300">
      <div className="max-w-md mx-auto">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Code className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          No techniques found
        </h3>

        <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
          Get started by adding your first work technique. You can organize and manage
          all your development methodologies and best practices here.
        </p>

        <Button
          onClick={onAddTechnique}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 mx-auto h-12 px-6 text-base touch-manipulation"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span>Add Your First Technique</span>
        </Button>
      </div>
    </Card>
  )
}
