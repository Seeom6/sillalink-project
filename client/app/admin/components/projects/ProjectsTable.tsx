"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { MoreHorizontal, Info, Trash2, Calendar, Users, DollarSign } from "lucide-react"
import { useGetProjects, useDeleteProject, useBulkDeleteProjects } from "@/app/hooks/project/useProject"
import { AdminProject } from "@/app/types/adminProjectTypes"
import { ProjectStatusBadge } from "./ProjectStatusBadge"
import { ProjectPriorityBadge } from "./ProjectPriorityBadge"
import { ProjectFilters } from "./ProjectFilters"
import { ProjectPagination } from "./ProjectPagination"
import { ProjectEmptyState } from "./ProjectEmptyState"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/shared/ui/table"
import { Checkbox } from "@/app/shared/ui/checkbox"
import Button from "@/app/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/shared/ui/dropdown-menu"
import { Badge } from "@/app/shared/ui/badge"

interface ProjectsTableProps {
  onAddProject?: () => void
  onEditProject?: (project: AdminProject) => void
  onDeleteProject?: (project: AdminProject) => void
  onViewProject?: (project: AdminProject) => void
}

export const ProjectsTable = ({
  onAddProject = () => {},
  onEditProject = (project) => {},
  onDeleteProject = (project) => {},
  onViewProject = (project) => {},
}: ProjectsTableProps) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
    managerId: "all",
    page: 1,
    limit: 10,
  })
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  // Use React Query with proper authentication handling
  const { data: projects, isLoading, error, refetch } = useGetProjects(filters)
  const { mutate: deleteProject } = useDeleteProject()
  const { mutate: bulkDeleteProjects } = useBulkDeleteProjects()

  // Handle authentication errors
  useEffect(() => {
    if (error && (error as any)?.response?.status === 401) {
      // Redirect to unified login if unauthorized
      window.location.href = '/login';
    }
  }, [error]);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const handlePageChange = useCallback((page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked && projects?.data) {
      setSelectedProjects(projects.data.map(project => project._id))
    } else {
      setSelectedProjects([])
    }
  }, [projects?.data])

  const handleSelectProject = useCallback((projectId: string, checked: boolean) => {
    setSelectedProjects(prev => 
      checked 
        ? [...prev, projectId]
        : prev.filter(id => id !== projectId)
    )
  }, [])

  const handleBulkDelete = useCallback(() => {
    if (selectedProjects.length > 0) {
      bulkDeleteProjects(selectedProjects, {
        onSuccess: () => {
          setSelectedProjects([])
        }
      })
    }
  }, [selectedProjects, bulkDeleteProjects])

  const handleDelete = useCallback((project: AdminProject) => {
    deleteProject(project._id)
  }, [deleteProject])

  const isAllSelected = useMemo(() => {
    return projects?.data?.length > 0 && selectedProjects.length === projects.data.length
  }, [projects?.data?.length, selectedProjects.length])

  const isIndeterminate = useMemo(() => {
    return selectedProjects.length > 0 && selectedProjects.length < (projects?.data?.length || 0)
  }, [selectedProjects.length, projects?.data?.length])

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2496ED]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load projects</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!projects?.data?.length) {
    return <ProjectEmptyState onAddProject={onAddProject} />
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <ProjectFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        totalCount={projects?.total || 0}
      />

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm text-blue-700">
            {selectedProjects.length} project{selectedProjects.length > 1 ? 's' : ''} selected
          </span>
          <Button
            onClick={handleBulkDelete}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate ? true : undefined}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Assigned</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.data.map((project) => (
              <TableRow key={project._id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedProjects.includes(project._id)}
                    onCheckedChange={(checked) => 
                      handleSelectProject(project._id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {project.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <ProjectStatusBadge status={project.status} />
                </TableCell>
                <TableCell>
                  <ProjectPriorityBadge priority={project.priority} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.startDate)}
                  </div>
                </TableCell>
                <TableCell>
                  {project.endDate ? (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.endDate)}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {project.budget ? (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(project.budget.amount, project.budget.currency)}
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-3 w-3" />
                    {project.assignedEmployees?.length || 0}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#2496ED] h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewProject(project)}>
                        <Info className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEditProject(project)}>
                        <Info className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(project)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <ProjectPagination
        currentPage={filters.page}
        totalPages={Math.ceil((projects?.total || 0) / filters.limit)}
        onPageChange={handlePageChange}
        totalItems={projects?.total || 0}
        itemsPerPage={filters.limit}
      />
    </div>
  )
}
