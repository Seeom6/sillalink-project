export interface Project {
  id: string
  name: string
  photo: string
  link: string
  technologies: Technology[]
  description: string
  executors: Executor[]
  raised: boolean
  createdAt: string
  updatedAt: string
}

export interface Technology {
  id: string
  name: string
  icon: string
  color?: string
}

export interface Executor {
  id: string
  name: string
  avatar: string
  role?: string
}

export interface ProjectsResponse {
  data: Project[]
  total: number
  page: number
  limit: number
}

export interface ProjectFilters {
  search?: string
  technologies?: string[]
  raised?: boolean
  page?: number
  limit?: number
}
