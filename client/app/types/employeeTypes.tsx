export interface Employee {
  id: string
  name: string
  username: string
  email: string
  position: string
  status: "Active" | "Offline" | "Wait"
  date: string
  avatar?: string
}

export interface EmployeeData {
  firstName: string
  lastName: string
  email: string
  password: string
  position: string
  images: File[]
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
