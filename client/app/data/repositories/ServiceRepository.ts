import { Service, ServiceData, ServiceFilters, ServicesResponse } from '../models/Service'
import apiClient from '@/app/api/apiClient'

export class ServiceRepository {
  private static baseUrl = '/content/services'

  static async getServices(filters?: ServiceFilters): Promise<ServicesResponse> {
    const params = new URLSearchParams()
    
    if (filters?.search) params.append('search', filters.search)
    if (filters?.category && filters.category !== 'all') params.append('category', filters.category)
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)
    if (filters?.priceType && filters.priceType !== 'all') params.append('priceType', filters.priceType)
    if (filters?.isPopular !== undefined) params.append('isPopular', filters.isPopular.toString())
    if (filters?.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured.toString())
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    
    const queryString = params.toString()
    const url = `${this.baseUrl}${queryString ? `?${queryString}` : ''}`
    
    return apiClient.get(url)
  }

  static async getServiceById(id: string): Promise<Service> {
    return apiClient.get(`${this.baseUrl}/${id}`)
  }

  static async createService(data: ServiceData): Promise<Service> {
    return apiClient.post(this.baseUrl, data)
  }

  static async updateService(id: string, data: Partial<ServiceData>): Promise<Service> {
    return apiClient.put(`${this.baseUrl}/${id}`, data)
  }

  static async deleteService(id: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/${id}`)
  }

  static async getActiveServices(filters?: Partial<ServiceFilters>): Promise<ServicesResponse> {
    return this.getServices({
      ...filters,
      status: 'Active'
    })
  }

  static async getFeaturedServices(limit?: number): Promise<ServicesResponse> {
    return this.getServices({
      isFeatured: true,
      status: 'Active',
      limit: limit || 4,
      sortBy: 'sortOrder',
      sortOrder: 'asc'
    })
  }

  static async getPopularServices(limit?: number): Promise<ServicesResponse> {
    return this.getServices({
      isPopular: true,
      status: 'Active',
      limit: limit || 6,
      sortBy: 'sortOrder',
      sortOrder: 'asc'
    })
  }

  static async getServicesByCategory(category: string, filters?: Partial<ServiceFilters>): Promise<ServicesResponse> {
    return this.getServices({
      ...filters,
      category,
      status: 'Active'
    })
  }

  static async searchServices(query: string, filters?: Partial<ServiceFilters>): Promise<ServicesResponse> {
    return this.getServices({
      ...filters,
      search: query,
      status: 'Active'
    })
  }
}
