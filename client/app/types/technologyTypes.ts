// Technology enums matching backend
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

// Technology interface
export interface Technology {
  _id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

// API request/response types
export interface CreateTechnologyPayload {
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

export interface UpdateTechnologyPayload extends Partial<CreateTechnologyPayload> {
  id: string;
}

export interface TechnologyFilters {
  search?: string;
  category?: TechnologyCategory;
  status?: TechnologyStatus;
  difficultyLevel?: DifficultyLevel;
  isFeatured?: boolean;
  tags?: string[];
  proficiencyLevel?: {
    min?: number;
    max?: number;
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TechnologiesResponse {
  success: boolean;
  data: Technology[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

export interface TechnologyResponse {
  success: boolean;
  data: Technology;
  message: string;
}

export interface TechnologyStats {
  totalTechnologies: number;
  featuredCount: number;
  averageProficiencyLevel: number;
  totalLearningHours: number;
  byCategory: Record<TechnologyCategory, number>;
  byStatus: Record<TechnologyStatus, number>;
  byDifficultyLevel: Record<DifficultyLevel, number>;
}

// Form types
export interface TechnologyFormData {
  name: string;
  description: string;
  longDescription?: string;
  category: TechnologyCategory;
  status: TechnologyStatus;
  difficultyLevel: DifficultyLevel;
  icon?: string;
  image?: File | string;
  images?: string[]; // 🔧 Added missing images field
  officialWebsite?: string;
  documentation?: string;
  tags: string[];
  relatedTechnologies: string[];
  proficiencyLevel: number;
  estimatedLearningHours: number;
  projectsUsedIn: number; // 🔧 Added missing projectsUsedIn field
  prerequisites: string[];
  learningResources: string[];
  notes?: string;
  isFeatured: boolean;
  version?: string;
  lastUsed?: Date; // 🔧 Added missing lastUsed field
}

// Component props types
export interface TechnologyCardProps {
  technology: Technology;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onToggleFeatured?: (id: string) => void;
}

export interface TechnologyFormProps {
  initialData?: Partial<Technology>;
  onSubmit: (data: TechnologyFormData, imageFile?: File) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: 'create' | 'edit';
}

// Constants
export const TECHNOLOGY_CATEGORIES = [
  { value: TechnologyCategory.FRONTEND, label: 'Frontend' },
  { value: TechnologyCategory.BACKEND, label: 'Backend' },
  { value: TechnologyCategory.DATABASE, label: 'Database' },
  { value: TechnologyCategory.MOBILE, label: 'Mobile' },
  { value: TechnologyCategory.DEVOPS, label: 'DevOps' },
  { value: TechnologyCategory.DESIGN, label: 'Design' },
  { value: TechnologyCategory.TESTING, label: 'Testing' },
  { value: TechnologyCategory.AI_ML, label: 'AI/ML' },
  { value: TechnologyCategory.BLOCKCHAIN, label: 'Blockchain' },
  { value: TechnologyCategory.CLOUD, label: 'Cloud' },
  { value: TechnologyCategory.OTHER, label: 'Other' }
] as const;

export const TECHNOLOGY_STATUSES = [
  { value: TechnologyStatus.ACTIVE, label: 'Active' },
  { value: TechnologyStatus.INACTIVE, label: 'Inactive' },
  { value: TechnologyStatus.DEPRECATED, label: 'Deprecated' },
  { value: TechnologyStatus.LEARNING, label: 'Learning' },
  { value: TechnologyStatus.EXPERT, label: 'Expert' }
] as const;

export const DIFFICULTY_LEVELS = [
  { value: DifficultyLevel.BEGINNER, label: 'Beginner' },
  { value: DifficultyLevel.INTERMEDIATE, label: 'Intermediate' },
  { value: DifficultyLevel.ADVANCED, label: 'Advanced' },
  { value: DifficultyLevel.EXPERT, label: 'Expert' }
] as const;

// Utility functions
export const getCategoryLabel = (category: TechnologyCategory): string => {
  return TECHNOLOGY_CATEGORIES.find(cat => cat.value === category)?.label || category;
};

export const getStatusLabel = (status: TechnologyStatus): string => {
  return TECHNOLOGY_STATUSES.find(stat => stat.value === status)?.label || status;
};

export const getDifficultyLabel = (difficulty: DifficultyLevel): string => {
  return DIFFICULTY_LEVELS.find(diff => diff.value === difficulty)?.label || difficulty;
};

// Color mappings for UI
export const CATEGORY_COLORS: Record<TechnologyCategory, string> = {
  [TechnologyCategory.FRONTEND]: 'bg-blue-100 text-blue-800',
  [TechnologyCategory.BACKEND]: 'bg-green-100 text-green-800',
  [TechnologyCategory.DATABASE]: 'bg-purple-100 text-purple-800',
  [TechnologyCategory.MOBILE]: 'bg-pink-100 text-pink-800',
  [TechnologyCategory.DEVOPS]: 'bg-orange-100 text-orange-800',
  [TechnologyCategory.DESIGN]: 'bg-indigo-100 text-indigo-800',
  [TechnologyCategory.TESTING]: 'bg-yellow-100 text-yellow-800',
  [TechnologyCategory.AI_ML]: 'bg-red-100 text-red-800',
  [TechnologyCategory.BLOCKCHAIN]: 'bg-gray-100 text-gray-800',
  [TechnologyCategory.CLOUD]: 'bg-cyan-100 text-cyan-800',
  [TechnologyCategory.OTHER]: 'bg-slate-100 text-slate-800'
};

export const STATUS_COLORS: Record<TechnologyStatus, string> = {
  [TechnologyStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [TechnologyStatus.INACTIVE]: 'bg-gray-100 text-gray-800',
  [TechnologyStatus.DEPRECATED]: 'bg-red-100 text-red-800',
  [TechnologyStatus.LEARNING]: 'bg-yellow-100 text-yellow-800',
  [TechnologyStatus.EXPERT]: 'bg-blue-100 text-blue-800'
};

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  [DifficultyLevel.BEGINNER]: 'bg-green-100 text-green-800',
  [DifficultyLevel.INTERMEDIATE]: 'bg-yellow-100 text-yellow-800',
  [DifficultyLevel.ADVANCED]: 'bg-orange-100 text-orange-800',
  [DifficultyLevel.EXPERT]: 'bg-red-100 text-red-800'
};
