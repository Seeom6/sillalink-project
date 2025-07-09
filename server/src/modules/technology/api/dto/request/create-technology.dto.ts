import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '../../../database/technology.schema';

export class CreateTechnologyDto {
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
