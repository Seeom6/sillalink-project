"use client"

import { useState } from "react"
import { Plus, Filter, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Container } from "@/app/shared/components/layout/Container"
import { PageHeader } from "@/app/shared/components/layout/PageHeader"
import { ContentGrid } from "@/app/shared/components/content/ContentGrid"
import { ProjectCard } from "@/app/shared/components/content/ProjectCard"
import { LoadingState } from "@/app/shared/components/data-display/LoadingState"
import { EmptyState } from "@/app/shared/components/data-display/EmptyState"
import Button from "@/app/shared/ui/button"
import { Card } from "@/app/shared/ui/Card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/shared/ui/select"
import { useProjects, useDeleteProject } from "@/app/shared/hooks/useProjects"
import { useFilters } from "@/app/shared/hooks/useFilters"
import { usePagination } from "@/app/shared/hooks/usePagination"
import { Project, ProjectFilters, PROJECT_CATEGORIES, PROJECT_STATUSES, PROJECT_PRIORITIES } from "@/app/data/models/Project"

export default function ProjectManager() {
  const router = useRouter()
  
  const { filters, setFilter } = useFilters<ProjectFilters>({
    search: "",
    category: "all",
    status: "all",
    priority: "all",
    page: 1,
    limit: 12,
    sortBy: "sortOrder",
    sortOrder: "asc"
  })

  const { data: projectsResponse, isLoading, error } = useProjects(filters)
  const { mutate: deleteProject } = useDeleteProject()

  const projects = projectsResponse?.data || []
  const total = projectsResponse?.total || 0

  const handleAddProject = () => {
    router.push("/projects/add-project")
  }

  const handleEditProject = (project: Project) => {
    router.push(`/projects/edit/${project.id}`)
  }

  const handleDeleteProject = (project: Project) => {
    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
      deleteProject(project.id)
    }
  }

  const handleViewProject = (project: Project) => {
    router.push(`/projects/view/${project.id}`)
  }

  const headerActions = (
    <Button
      onClick={handleAddProject}
      className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
    >
      <Plus className="w-4 h-4" />
      Add Project
    </Button>
  )

  return (
    <Container variant="admin" size="xl">
      <PageHeader
        title="Projects"
        description={`Manage your portfolio projects (${total} total)`}
        variant="admin"
        actions={headerActions}
      />

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filters.category} onValueChange={(value) => setFilter("category", value)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {PROJECT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilter("status", value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {PROJECT_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(value) => setFilter("priority", value)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {PROJECT_PRIORITIES.map((priority) => (
                  <SelectItem key={priority} value={priority}>
                    {priority}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
      </Card>

      {/* Content */}
      {error ? (
        <Card className="p-6 text-center text-red-600">
          Error loading projects: {error.message}
        </Card>
      ) : isLoading ? (
        <LoadingState variant="admin" type="grid" count={12} />
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description="Get started by adding your first project to showcase your work."
          variant="admin"
          actionLabel="Add Your First Project"
          onAction={handleAddProject}
        />
      ) : (
        <ContentGrid
          variant="admin"
          columns={{ mobile: 1, tablet: 2, desktop: 3, large: 4 }}
          gap="md"
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              variant="admin"
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onView={handleViewProject}
            />
          ))}
        </ContentGrid>
      )}

      {/* Pagination would go here */}
    </Container>
  )
}
