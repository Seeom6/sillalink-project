import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '../../../database/schemas/technology.schema';

export class TechnologyResponseDto {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export class TechnologyListResponseDto {
  technologies: TechnologyResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class TechnologyStatsResponseDto {
  total: number;
  active: number;
  learning: number;
  expert: number;
  featured: number;
  avgProficiency: number;
  byCategory: { [key: string]: number };
  byDifficulty: { [key: string]: number };
}

export class FileUploadResponseDto {
  imageUrl?: string;
  iconUrl?: string;
  message: string;
}

export class CategoryResponseDto {
  value: string;
  label: string;
}

export class TagsResponseDto {
  tags: string[];
}
