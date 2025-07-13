"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "@/app/shared/ui/button"
import { ArrowLeft, FolderOpen } from "lucide-react"
import AddProjectForm from "./add-project-form"
import type { AdminProjectData } from "@/app/types/adminProjectTypes"

export default function AddProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => {
    router.push('/admin/projects')
  }

  const handleSubmit = async (data: AdminProjectData) => {
    setIsLoading(true)

    try {
      // TODO: Replace with actual API call
      console.log('Project data to submit:', data)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Project created successfully')
      router.push('/admin/projects')
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
          <p className="text-gray-600 mt-1">
            Create a new project and assign team members
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <AddProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
