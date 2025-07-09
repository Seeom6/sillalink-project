export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image?: string
  images?: string[]
  technologies: string[]
  status: "Active" | "Completed" | "On Hold" | "Cancelled" | "Draft"
  category: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  startDate: string
  endDate?: string
  liveUrl?: string
  githubUrl?: string
  clientName?: string
  teamMembers?: string[]
  budget?: number
  progress?: number
  features?: string[]
  challenges?: string[]
  learnings?: string[]
  tags?: string[]
  isPublic: boolean
  isFeatured: boolean
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export interface ProjectData {
  title: string
  description: string
  longDescription?: string
  image?: File | string
  images?: (File | string)[]
  technologies: string[]
  status: "Active" | "Completed" | "On Hold" | "Cancelled" | "Draft"
  category: string
  priority: "Low" | "Medium" | "High" | "Urgent"
  startDate: string
  endDate?: string
  liveUrl?: string
  githubUrl?: string
  clientName?: string
  teamMembers?: string[]
  budget?: number
  progress?: number
  features?: string[]
  challenges?: string[]
  learnings?: string[]
  tags?: string[]
  isPublic: boolean
  isFeatured: boolean
  sortOrder?: number
}

export interface ProjectFilters {
  search?: string
  category?: string
  status?: string
  priority?: string
  isPublic?: boolean
  isFeatured?: boolean
  startDate?: string
  endDate?: string
  technologies?: string[]
  page?: number
  limit?: number
  sortBy?: "title" | "startDate" | "endDate" | "priority" | "progress" | "sortOrder"
  sortOrder?: "asc" | "desc"
}

export interface ProjectsResponse {
  data: Project[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Project categories
export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Desktop Application",
  "API Development",
  "Database Design",
  "UI/UX Design",
  "DevOps",
  "Data Analysis",
  "Machine Learning",
  "E-commerce",
  "CMS",
  "Portfolio",
  "Landing Page",
  "Dashboard",
  "Other"
] as const

// Project statuses
export const PROJECT_STATUSES = [
  "Active",
  "Completed", 
  "On Hold",
  "Cancelled",
  "Draft"
] as const

// Priority levels
export const PROJECT_PRIORITIES = [
  "Low",
  "Medium",
  "High", 
  "Urgent"
] as const

// Common technologies
export const COMMON_TECHNOLOGIES = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  "Python",
  "Django",
  "Flask",
  "PHP",
  "Laravel",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "AWS",
  "Vercel",
  "Netlify",
  "Tailwind CSS",
  "Bootstrap",
  "Sass",
  "Figma",
  "Adobe XD"
] as const
