"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/shared/ui/button"
import { Plus, FolderOpen } from "lucide-react"

export default function ProjectsPage() {
  const router = useRouter()

  const handleAddProject = () => {
    router.push('/admin/projects/add-project')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all company projects
          </p>
        </div>
        <Button
          onClick={handleAddProject}
          className="flex items-center gap-2 bg-[#2496ED] hover:bg-[#1976D2] text-white"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Temporary Projects Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-gray-400" />
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Project Management System
          </h3>

          <p className="text-gray-500 text-center mb-6 max-w-md">
            The comprehensive project management system is being set up.
            You can start by creating your first project.
          </p>

          <Button
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-[#2496ED] hover:bg-[#1976D2] text-white"
          >
            <Plus className="w-4 h-4" />
            Create Your First Project
          </Button>
        </div>
      </div>
    </div>
  )
}
