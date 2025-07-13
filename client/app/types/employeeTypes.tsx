export interface Employee {
  id?: string
  _id?: string
  firstName: string
  lastName: string
  name?: string
  username?: string
  email: string
  phone?: string
  position?: string
  role: string
  isActive: boolean
  status?: "Active" | "Offline" | "Wait"
  date?: string
  avatar?: string
  image?: string
  startDate?: string
  hireDate?: string
  createdAt?: string
  updatedAt?: string
  employee?: {
    position?: string
    startDate?: string
    endDate?: string
    image?: string
    department?: string
    employmentStatus?: string
    managerId?: string
    projectIds?: string[]
    emergencyContact?: {
      name: string
      phone: string
      relationship: string
    }
    address?: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
    salary?: {
      amount: number
      currency: string
      frequency: 'hourly' | 'monthly' | 'yearly'
    }
  }
}

export interface EmployeeData {
  firstName: string
  lastName: string
  email: string
  password: string
  position: string
  images: File[]
  department?: string
  hireDate?: string
  phone?: string
  employmentStatus?: string
  role?: string
  manager?: string
  managerId?: string
  projects?: string[]
  projectIds?: string[]
  emergencyContact?: {
    name?: string
    phone?: string
    relationship?: string
  }
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  salary?: {
    amount?: number
    currency?: string
    frequency?: string
  }
}

export interface EmployeesResponse {
  data: Employee[]
  total: number
  page: number
  limit: number
}

export interface EmployeeFilters {
  search: string
  status: string
  page: number
  limit: number
}

export interface ImageDimensions {
  width: number
  height: number
  objectFit: ObjectFitType
  aspectRatio: string
}

export type ObjectFitType = "cover" | "contain" | "fill" | "scale-down" | "none"

export interface AspectRatio {
  label: string
  value: string
  width: number
  height: number
}

export interface ObjectFitOption {
  label: string
  value: ObjectFitType
  description: string
}

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void
  maxFileSize?: number
  acceptedTypes?: string[]
  initialDimensions?: Partial<ImageDimensions>
  showSettings?: boolean
  allowMultiple?: boolean
}

export interface EmployeeFormProps {
  onSubmit?: (data: EmployeeData) => void
  onCancel?: () => void
  initialData?: Partial<EmployeeData>
  isLoading?: boolean
}

// Employment Status Constants
export const EMPLOYMENT_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'terminated', label: 'Terminated' }
] as const;

// User Roles Constants
export const USER_ROLES = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'contractor', label: 'Contractor' }
] as const;

// Positions Constants
export const POSITIONS = [
  { value: 'frontend-developer', label: 'Frontend Developer' },
  { value: 'backend-developer', label: 'Backend Developer' },
  { value: 'fullstack-developer', label: 'Fullstack Developer' },
  { value: 'ui-ux-designer', label: 'UI/UX Designer' },
  { value: 'project-manager', label: 'Project Manager' },
  { value: 'devops-engineer', label: 'DevOps Engineer' },
  { value: 'qa-engineer', label: 'QA Engineer' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'product-manager', label: 'Product Manager' }
] as const;

// Departments Constants
export const DEPARTMENTS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' }
] as const;
