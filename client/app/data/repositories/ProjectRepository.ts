import { Project, ProjectData, ProjectFilters, ProjectsResponse } from '../models/Project'
import apiClient from '@/app/api/apiClient'

export class ProjectRepository {
  private static baseUrl = '/content/projects'

  static async getProjects(filters?: ProjectFilters): Promise<ProjectsResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters?.priority && filters.priority !== 'all') params.append('priority', filters.priority)
    if (filters?.isPublic !== undefined) params.append('isPublic', filters.isPublic.toString())
    if (filters?.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString())
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    const queryString = params.toString()
    const url = `${this.baseUrl}${queryString ? `?${queryString}` : ''}`
    
    return apiClient.get(url)
  }

  static async getProjectById(id: string): Promise<Project> {
    return apiClient.get(`${this.baseUrl}/${id}`)
  }

  static async createProject(data: ProjectData): Promise<Project> {
    return apiClient.post(this.baseUrl, data)
  }

  static async updateProject(id: string, data: Partial<ProjectData>): Promise<Project> {
    return apiClient.put(`${this.baseUrl}/${id}`, data)
  }

  static async deleteProject(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  static async getPublicProjects(filters?: Partial<ProjectFilters>): Promise<ProjectsResponse> {
    return this.getProjects({
      ...filters,
      isPublic: true
    })
  }

  static async getFeaturedProjects(limit?: number): Promise<ProjectsResponse> {
    return this.getProjects({
      isFeatured: true,
      isPublic: true,
      limit: limit || 6,
      sortBy: 'sortOrder',
      sortOrder: 'asc'
    })
  }

  static async getProjectsByCategory(category: string, filters?: Partial<ProjectFilters>): Promise<ProjectsResponse> {
    return this.getProjects({
      ...filters,
      category,
      isPublic: true
    })
  }

  static async getProjectsByTechnology(technology: string, filters?: Partial<ProjectFilters>): Promise<ProjectsResponse> {
    return this.getProjects({
      ...filters,
      technologies: [technology],
      isPublic: true
    })
  }

  static async searchProjects(query: string, filters?: Partial<ProjectFilters>): Promise<ProjectsResponse> {
    return this.getProjects({
      ...filters,
      search: query,
      isPublic: true
    })
  }
}
