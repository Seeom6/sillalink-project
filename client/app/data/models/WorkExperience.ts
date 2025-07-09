export interface WorkExperience {
  id: string
  title: string
  company: string
  companyUrl?: string
  location: string
  locationType: "Remote" | "On-site" | "Hybrid"
  employmentType: "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship"
  description: string
  responsibilities: string[]
  achievements: string[]
  technologies: string[]
  startDate: string
  endDate?: string // null means current position
  isCurrent: boolean
  logo?: string
  industry?: string
  teamSize?: number
  projects?: string[] // Project IDs or names
  skills?: string[]
  isPublic: boolean
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export interface WorkExperienceData {
  title: string
  company: string
  companyUrl?: string
  location: string
  locationType: "Remote" | "On-site" | "Hybrid"
  employmentType: "Full-time" | "Part-time" | "Contract" | "Freelance" | "Internship"
  description: string
  responsibilities: string[]
  achievements: string[]
  technologies: string[]
  startDate: string
  endDate?: string
  isCurrent: boolean
  logo?: File | string
  industry?: string
  teamSize?: number
  projects?: string[]
  skills?: string[]
  isPublic: boolean
  sortOrder?: number
}

export interface WorkExperienceFilters {
  search?: string
  company?: string
  employmentType?: string
  locationType?: string
  industry?: string
  technologies?: string[]
  isCurrent?: boolean
  isPublic?: boolean
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: "startDate" | "endDate" | "company" | "title" | "sortOrder"
  sortOrder?: "asc" | "desc"
}

export interface WorkExperienceResponse {
  data: WorkExperience[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Location types
export const LOCATION_TYPES = [
  "Remote",
  "On-site", 
  "Hybrid"
] as const

// Employment types
export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship"
] as const

// Common industries
export const INDUSTRIES = [
  "Technology",
  "Software Development",
  "Web Development",
  "Mobile Development",
  "E-commerce",
  "Fintech",
  "Healthcare",
  "Education",
  "Media & Entertainment",
  "Gaming",
  "SaaS",
  "Consulting",
  "Startup",
  "Enterprise",
  "Government",
  "Non-profit",
  "Other"
] as const

// Common skills/technologies
export const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Node.js",
  "Python",
  "PHP",
  "Java",
  "C#",
  "Go",
  "Rust",
  "HTML",
  "CSS",
  "Sass",
  "Tailwind CSS",
  "Bootstrap",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
  "Git",
  "CI/CD",
  "Agile",
  "Scrum",
  "Project Management",
  "Team Leadership",
  "Mentoring"
] as const
