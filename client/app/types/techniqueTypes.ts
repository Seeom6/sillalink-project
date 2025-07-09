export interface Technique {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  icon: string
  image?: string
  technologies: string[]
  status: "Active" | "Inactive" | "Draft"
  createdAt: string
  updatedAt: string
}

export interface TechniqueData {
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  icon: string
  image?: File | string
  technologies: string[]
  status: "Active" | "Inactive" | "Draft"
}

export interface TechniquesResponse {
  data: Technique[]
  total: number
  page: number
  limit: number
}

export interface TechniqueFilters {
  search?: string
  category?: string
  difficulty?: string
  status?: string
  page?: number
  limit?: number
}

export interface TechniqueFormProps {
  onSubmit?: (data: TechniqueData) => void
  onCancel?: () => void
  initialData?: Partial<TechniqueData>
  isLoading?: boolean
}

export interface TechniquesTableProps {
  onAddTechnique?: () => void
  onEditTechnique?: (technique: Technique) => void
  onDeleteTechnique?: (technique: Technique) => void
  onViewTechnique?: (technique: Technique) => void
}

// Categories for techniques
export const TECHNIQUE_CATEGORIES = [
  "UI/UX Design",
  "Software Development", 
  "Data & AI Solutions",
  "DevOps & Infrastructure",
  "Mobile Development",
  "Web Development",
  "Database Management",
  "Testing & QA"
] as const

// Difficulty levels
export const DIFFICULTY_LEVELS = [
  "Beginner",
  "Intermediate", 
  "Advanced",
  "Expert"
] as const

// Status options
export const TECHNIQUE_STATUS = [
  "Active",
  "Inactive",
  "Draft"
] as const
