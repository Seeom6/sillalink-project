import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '../../../database/technology.schema';

export class GetAllTechnologiesDto {
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
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'proficiencyLevel' | 'projectsUsedIn';
  sortOrder?: 'asc' | 'desc';
}
