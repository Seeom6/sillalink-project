// Technology Types and Interfaces

export enum TechnologyCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  DESIGN = 'design',
  TESTING = 'testing',
  AI_ML = 'ai_ml',
  BLOCKCHAIN = 'blockchain',
  CLOUD = 'cloud',
  OTHER = 'other'
}

export enum TechnologyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DEPRECATED = 'deprecated',
  LEARNING = 'learning',
  EXPERT = 'expert'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export interface Technology {
  _id: string;
  id?: string; // Alternative ID field for compatibility
  name: string;
  description: string;
  longDescription?: string;
  category: TechnologyCategory;
  status: TechnologyStatus;
  difficultyLevel: DifficultyLevel;
  icon: string;
  image: string;
  images: string[];
  officialWebsite?: string;
  documentation?: string;
  tags: string[];
  relatedTechnologies: string[];
  proficiencyLevel: number;
  estimatedLearningHours: number;
  prerequisites: string[];
  learningResources: string[];
  notes?: string;
  isFeatured: boolean;
  version?: string;
  lastUsed?: Date;
  projectsUsedIn: number;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTechnologyData {
  name: string;
  description: string;
  longDescription?: string;
  category: TechnologyCategory;
  status?: TechnologyStatus;
  difficultyLevel?: DifficultyLevel;
  icon?: string;
  image?: string;
  images?: string[];
  officialWebsite?: string;
  documentation?: string;
  tags?: string[];
  relatedTechnologies?: string[];
  proficiencyLevel?: number;
  estimatedLearningHours?: number;
  prerequisites?: string[];
  learningResources?: string[];
  notes?: string;
  isFeatured?: boolean;
  version?: string;
  lastUsed?: Date;
  projectsUsedIn?: number;
}

export interface UpdateTechnologyData extends Partial<CreateTechnologyData> {}

export interface TechnologyFilters {
  page?: number;
  limit?: number;
  category?: TechnologyCategory;
  status?: TechnologyStatus;
  search?: string;
  isFeatured?: boolean;
  difficultyLevel?: DifficultyLevel;
  tags?: string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TechnologyListResponse {
  technologies: Technology[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TechnologyStats {
  total: number;
  active: number;
  learning: number;
  expert: number;
  featured: number;
  avgProficiency: number;
  byCategory: { [key: string]: number };
  byDifficulty: { [key: string]: number };
}

export interface CategoryOption {
  value: TechnologyCategory;
  label: string;
}

export interface StatusOption {
  value: TechnologyStatus;
  label: string;
}

export interface DifficultyOption {
  value: DifficultyLevel;
  label: string;
}

export interface FileUploadResponse {
  imageUrl?: string;
  iconUrl?: string;
  message: string;
}

// Form validation schemas
export interface TechnologyFormData {
  name: string;
  description: string;
  longDescription?: string;
  category: TechnologyCategory;
  status: TechnologyStatus;
  difficultyLevel: DifficultyLevel;
  officialWebsite?: string;
  documentation?: string;
  tags: string[];
  version?: string;
  notes?: string;
  isFeatured: boolean;
  proficiencyLevel: number;
  estimatedLearningHours: number;
  prerequisites: string[];
  learningResources: string[];
}

// API Error types
export interface TechnologyError {
  message: string;
  code: string;
  details?: any;
}

// Bulk operations
export interface BulkUpdateData {
  ids: string[];
  status?: TechnologyStatus;
}

export interface BulkDeleteData {
  ids: string[];
}

// Search and filter options
export interface SearchOptions {
  query: string;
  limit?: number;
}

export interface TagsResponse {
  tags: string[];
}

// Component props interfaces
export interface TechnologyCardProps {
  technology: Technology;
  onEdit: (technology: Technology) => void;
  onDelete: (id: string) => void;
  onView: (technology: Technology) => void;
}

export interface TechnologyModalProps {
  technology: Technology | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (technology: Technology) => void;
  onDelete: (id: string) => void;
}

export interface TechnologyFormProps {
  technology?: Technology;
  onSubmit: (data: TechnologyFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface TechnologyFiltersProps {
  filters: TechnologyFilters;
  onFiltersChange: (filters: TechnologyFilters) => void;
  categories: CategoryOption[];
  statuses: StatusOption[];
  difficulties: DifficultyOption[];
  availableTags: string[];
}

// Utility types
export type TechnologySortField = 'name' | 'createdAt' | 'updatedAt' | 'proficiencyLevel' | 'projectsUsedIn' | 'category' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  field: TechnologySortField;
  order: SortOrder;
  label: string;
}
