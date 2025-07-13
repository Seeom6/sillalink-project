// Admin-specific project types
// Re-exports from main project types for admin components

export type {
  Project,
  ProjectFormData,
  ProjectResponse,
  ProjectsResponse,
  ProjectStatsResponse,
  ProjectQueryParams,
  ProjectFilters,
  CreateProjectPayload,
  UpdateProjectPayload,
  ProjectFormSchema,
  ProjectFilterSchema,
  ProjectError,
  ProjectValidationErrors
} from './projectTypes';

export {
  ProjectStatus,
  ProjectPriority,
  projectFormSchema,
  projectFilterSchema,
  PROJECT_STATUS_LABELS,
  PROJECT_PRIORITY_LABELS,
  PROJECT_STATUS_COLORS,
  PROJECT_PRIORITY_COLORS,
  DEFAULT_PROJECT_FORM_VALUES,
  DEFAULT_PROJECT_QUERY_PARAMS
} from './projectTypes';

// Admin-specific project interface (extends base Project)
export interface AdminProject {
  _id: string;
  name: string;
  description?: string;
  images: string[];
  externalLink?: string;
  startDate: string;
  endDate?: string;
  cost?: number;
  assignedEmployees: string[];
  technologiesUsed: string[];
  status: ProjectStatus;
  priority: ProjectPriority;
  isFeatured: boolean;
  isPublic: boolean;
  tasks: Array<{
    name: string;
    description?: string;
    assignee?: string;
    dueDate?: string;
    status: string;
    priority: string;
  }>;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Constants for admin components
export const PROJECT_STATUSES = [
  { value: 'planning', label: 'Planning' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' }
];

export const PROJECT_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'JPY', label: 'JPY (¥)' }
];

// Admin project form data interface
export interface AdminProjectData {
  name: string;
  description?: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget: {
    amount: number;
    currency: string;
  };
  client: {
    name: string;
    email: string;
    phone: string;
    company: string;
  };
  assignedEmployees: string[];
  managerId: string;
  priority: string;
  progress: number;
  tags: string[];
  attachments: string[];
}

// Admin project form props interface
export interface AdminProjectFormProps {
  onSubmit: (data: AdminProjectData) => void;
  onCancel: () => void;
  initialData?: Partial<AdminProjectData>;
  isLoading?: boolean;
}

// Admin-specific filter interface
export interface AdminProjectFilters {
  search?: string;
  status?: string;
  priority?: string;
  assignedEmployee?: string;
  technology?: string;
  isFeatured?: boolean;
  isPublic?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Bulk operations interfaces
export interface BulkDeleteRequest {
  projectIds: string[];
}

export interface BulkUpdateStatusRequest {
  projectIds: string[];
  status: ProjectStatus;
}

export interface BulkUpdatePriorityRequest {
  projectIds: string[];
  priority: ProjectPriority;
}
