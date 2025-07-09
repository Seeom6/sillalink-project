import { TechniqueData, TechniqueFilters } from "@/app/types/techniqueTypes"
import apiClient from "../apiClient"

export const techniqueApi = {
  createTechnique: async (payload: TechniqueData) => {
    return apiClient.post("/admin/technique", payload)
  },
  
  getTechniques: async (filters?: TechniqueFilters) => {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append("search", filters.search)
    if (filters?.category && filters.category !== "all") params.append("category", filters.category)
    if (filters?.difficulty && filters.difficulty !== "all") params.append("difficulty", filters.difficulty)
    if (filters?.status && filters.status !== "all") params.append("status", filters.status)
    if (filters?.page) params.append("page", filters.page.toString())
    if (filters?.limit) params.append("limit", filters.limit.toString())
    
    const queryString = params.toString()
    return apiClient.get(`/admin/technique${queryString ? `?${queryString}` : ""}`)
  },
  
  getTechniqueById: async (id: string) => {
    return apiClient.get(`/admin/technique/${id}`)
  },
  
  updateTechnique: async (id: string, payload: Partial<TechniqueData>) => {
    return apiClient.put(`/admin/technique/${id}`, payload)
  },
  
  deleteTechnique: async (id: string) => {
    return apiClient.delete(`/admin/technique/${id}`)
  }
}
