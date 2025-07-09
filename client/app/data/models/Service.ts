import { ReactNode } from "react"

export interface Service {
  id: string
  title: string
  description: string
  longDescription?: string
  icon?: string // Icon name or path
  iconComponent?: ReactNode // For React components
  image?: string
  status: "Active" | "Inactive" | "Draft"
  category: string
  price?: string
  priceType?: "Fixed" | "Hourly" | "Project" | "Monthly"
  features: string[]
  benefits?: string[]
  deliverables?: string[]
  timeline?: string
  technologies?: string[]
  requirements?: string[]
  isPopular: boolean
  isFeatured: boolean
  sortOrder?: number
  delay?: number // For animations
  createdAt: string
  updatedAt: string
}

export interface ServiceData {
  title: string
  description: string
  longDescription?: string
  icon?: string
  image?: File | string
  status: "Active" | "Inactive" | "Draft"
  category: string
  price?: string
  priceType?: "Fixed" | "Hourly" | "Project" | "Monthly"
  features: string[]
  benefits?: string[]
  deliverables?: string[]
  timeline?: string
  technologies?: string[]
  requirements?: string[]
  isPopular: boolean
  isFeatured: boolean
  sortOrder?: number
}

export interface ServiceFilters {
  search?: string
  category?: string
  status?: string
  priceType?: string
  isPopular?: boolean
  isFeatured?: boolean
  technologies?: string[]
  page?: number
  limit?: number
  sortBy?: "title" | "price" | "category" | "sortOrder" | "createdAt"
  sortOrder?: "asc" | "desc"
}

export interface ServicesResponse {
  data: Service[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Service categories
export const SERVICE_CATEGORIES = [
  "UI/UX Design",
  "Web Development",
  "Mobile Development",
  "Software Development",
  "Data Analysis",
  "Project Consulting",
  "DevOps & Infrastructure",
  "Database Management",
  "API Development",
  "E-commerce Solutions",
  "CMS Development",
  "Maintenance & Support",
  "SEO & Marketing",
  "Training & Workshops"
] as const

// Service statuses
export const SERVICE_STATUSES = [
  "Active",
  "Inactive",
  "Draft"
] as const

// Price types
export const PRICE_TYPES = [
  "Fixed",
  "Hourly",
  "Project",
  "Monthly"
] as const

// Common service icons (Lucide icon names)
export const SERVICE_ICONS = [
  "PenTool",
  "Code",
  "Smartphone",
  "Monitor",
  "BarChart3",
  "Lightbulb",
  "Server",
  "Database",
  "Zap",
  "ShoppingCart",
  "FileText",
  "Settings",
  "Search",
  "Users"
] as const
