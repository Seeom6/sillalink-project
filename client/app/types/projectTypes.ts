import { z } from 'zod';

// Enums matching backend
export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Task interface
export interface ProjectTask {
  name: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

// Base Project interface
export interface Project {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  externalLink?: string;
  startDate: string;
  endDate?: string;
  cost?: number;
  assignedEmployees: Employee[];
  technologiesUsed: Technology[];
  status: ProjectStatus;
  priority: ProjectPriority;
  isFeatured: boolean;
  isDeleted: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  tasks: ProjectTask[];

  // Legacy fields for backward compatibility
  id?: string;
  photo?: string;
  link?: string;
  mainImage?: string;
  members?: Employee[];
  technologies?: Technology[];
  executors?: Executor[];
  raised?: boolean;
}

// Employee interface (simplified for project context)
export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  employee?: {
    position?: string;
    image?: string;
  };
}

// Technology interface (simplified for project context)
export interface Technology {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  image?: string;

  // Legacy fields
  id?: string;
  color?: string;
}

// Legacy Executor interface for backward compatibility
export interface Executor {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  photo?: string;
  position?: string;
}

// Form data interfaces
export interface ProjectFormData {
  name: string;
  description?: string;
  images?: string[];
  externalLink?: string;
  startDate: string;
  endDate?: string;
  cost?: number;
  assignedEmployees?: string[];
  technologiesUsed?: string[];
  status: ProjectStatus;
  priority: ProjectPriority;
  isFeatured?: boolean;
  tasks?: ProjectTask[];

  // Legacy fields for backward compatibility
  photo?: string;
  link?: string;
  technologies?: string[];
  executors?: string[];
  raised?: boolean;
}

// API Response interfaces
export interface ProjectResponse {
  success: boolean;
  data: Project;
  message?: string;
}

export interface ProjectsResponse {
  success: boolean;
  data: {
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;

  // Legacy format for backward compatibility
  projects?: Project[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProjectStatsResponse {
  success: boolean;
  data: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    onHoldProjects: number;
    featuredProjects: number;
    totalCost: number;
    averageCost: number;
    statusBreakdown: Array<{ _id: ProjectStatus; count: number }>;
    priorityBreakdown: Array<{ _id: ProjectPriority; count: number }>;
  };
  message?: string;
}

// Query parameters interface
export interface ProjectQueryParams {
  search?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  assignedEmployee?: string;
  technology?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  costMin?: number;
  costMax?: number;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Legacy ProjectFilters interface for backward compatibility
export interface ProjectFilters {
  search?: string;
  technologies?: string[];
  raised?: boolean;
  page?: number;
  limit?: number;

  // New fields
  status?: ProjectStatus;
  priority?: ProjectPriority;
  assignedEmployee?: string;
  technology?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  costMin?: number;
  costMax?: number;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Bulk operation interfaces
export interface BulkDeleteRequest {
  ids: string[];
}

export interface BulkUpdateStatusRequest {
  ids: string[];
  status: ProjectStatus;
}

export interface BulkOperationResponse {
  success: boolean;
  deletedCount?: number;
  updatedCount?: number;
  message: string;
}

// Image upload interface
export interface ImageUploadResponse {
  success: boolean;
  imageUrls: string[];
  message: string;
}

// Legacy interfaces for backward compatibility
export interface CreateProjectPayload extends Partial<ProjectFormData> {
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  id?: string;
  _id?: string;
}

// Validation schemas using Zod
export const projectFormSchema = z.object({
  name: z.string()
    .min(2, "Project name must be at least 2 characters")
    .max(100, "Project name must not exceed 100 characters")
    .trim(),

  description: z.string()
    .max(1000, "Description must not exceed 1000 characters")
    .trim()
    .optional(),

  images: z.array(z.string()).max(10, "Maximum 10 images allowed").optional(),

  externalLink: z.string()
    .url("External link must be a valid URL")
    .optional()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),

  startDate: z.string()
    .min(1, "Start date is required"),

  endDate: z.string()
    .optional()
    .or(z.literal(""))
    .transform(val => val === "" ? undefined : val),

  cost: z.number()
    .min(0, "Cost must be a positive number")
    .optional(),

  assignedEmployees: z.array(z.string()).max(20, "Maximum 20 employees can be assigned").optional(),

  technologiesUsed: z.array(z.string()).max(50, "Maximum 50 technologies can be assigned").optional(),

  status: z.nativeEnum(ProjectStatus),

  priority: z.nativeEnum(ProjectPriority),

  isFeatured: z.boolean().optional(),

  tasks: z.array(z.object({
    name: z.string()
      .min(2, "Task name must be at least 2 characters")
      .max(200, "Task name must not exceed 200 characters")
      .trim(),

    description: z.string()
      .max(1000, "Task description must not exceed 1000 characters")
      .trim()
      .optional(),

    assignee: z.string().optional(),

    dueDate: z.string().optional(),

    status: z.nativeEnum(TaskStatus),

    priority: z.nativeEnum(TaskPriority)
  })).max(50, "Maximum 50 tasks allowed").optional()
}).refine((data) => {
  if (data.endDate && data.startDate) {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"]
}).refine((data) => {
  // Require at least one task for new projects
  if (data.tasks && data.tasks.length === 0) {
    return false;
  }
  return true;
}, {
  message: "At least one task is required for new projects",
  path: ["tasks"]
});

export type ProjectFormSchema = z.infer<typeof projectFormSchema>;

// Filter form schema
export const projectFilterSchema = z.object({
  search: z.string().optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  priority: z.nativeEnum(ProjectPriority).optional(),
  assignedEmployee: z.string().optional(),
  technology: z.string().optional(),
  startDateFrom: z.string().optional(),
  startDateTo: z.string().optional(),
  endDateFrom: z.string().optional(),
  endDateTo: z.string().optional(),
  costMin: z.number().min(0).optional(),
  costMax: z.number().min(0).optional(),
  isFeatured: z.boolean().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export type ProjectFilterSchema = z.infer<typeof projectFilterSchema>;

// Constants
export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Planning',
  [ProjectStatus.IN_PROGRESS]: 'In Progress',
  [ProjectStatus.COMPLETED]: 'Completed',
  [ProjectStatus.ON_HOLD]: 'On Hold'
};

export const PROJECT_PRIORITY_LABELS: Record<ProjectPriority, string> = {
  [ProjectPriority.LOW]: 'Low',
  [ProjectPriority.MEDIUM]: 'Medium',
  [ProjectPriority.HIGH]: 'High',
  [ProjectPriority.CRITICAL]: 'Critical'
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'bg-blue-100 text-blue-800',
  [ProjectStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
  [ProjectStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [ProjectStatus.ON_HOLD]: 'bg-red-100 text-red-800'
};

export const PROJECT_PRIORITY_COLORS: Record<ProjectPriority, string> = {
  [ProjectPriority.LOW]: 'bg-gray-100 text-gray-800',
  [ProjectPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
  [ProjectPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [ProjectPriority.CRITICAL]: 'bg-red-100 text-red-800'
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'To Do',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.BLOCKED]: 'Blocked'
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.CRITICAL]: 'Critical'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: 'bg-gray-100 text-gray-800',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [TaskStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [TaskStatus.BLOCKED]: 'bg-red-100 text-red-800'
};

export const TASK_PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'bg-gray-100 text-gray-800',
  [TaskPriority.MEDIUM]: 'bg-blue-100 text-blue-800',
  [TaskPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [TaskPriority.CRITICAL]: 'bg-red-100 text-red-800'
};

// Default values
export const DEFAULT_PROJECT_FORM_VALUES: Partial<ProjectFormData> = {
  name: '',
  description: '',
  images: [],
  externalLink: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  cost: undefined,
  assignedEmployees: [],
  technologiesUsed: [],
  status: ProjectStatus.PLANNING,
  priority: ProjectPriority.MEDIUM,
  isFeatured: false,
  tasks: [{
    name: 'Initial project setup',
    description: 'Set up the basic project structure and requirements',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    assignee: 'unassigned'
  }]
};

export const DEFAULT_PROJECT_QUERY_PARAMS: ProjectQueryParams = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// Error types
export interface ProjectError {
  field?: string;
  message: string;
  code?: string;
}

export interface ProjectValidationErrors {
  [key: string]: string[];
}
