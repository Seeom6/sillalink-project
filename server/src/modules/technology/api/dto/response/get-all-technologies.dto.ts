import { TechnologyDocument } from '../../../database/technology.schema';

export class GetAllTechnologiesResponseDto {
  _id: string;
  name: string;
  description: string;
  longDescription?: string;
  category: string;
  status: string;
  difficultyLevel: string;
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

  constructor(technology: TechnologyDocument) {
    this._id = technology._id.toString();
    this.name = technology.name;
    this.description = technology.description;
    this.longDescription = technology.longDescription;
    this.category = technology.category;
    this.status = technology.status;
    this.difficultyLevel = technology.difficultyLevel;
    this.icon = technology.icon;
    this.image = technology.image;
    this.images = technology.images;
    this.officialWebsite = technology.officialWebsite;
    this.documentation = technology.documentation;
    this.tags = technology.tags;
    this.relatedTechnologies = technology.relatedTechnologies;
    this.proficiencyLevel = technology.proficiencyLevel;
    this.estimatedLearningHours = technology.estimatedLearningHours;
    this.prerequisites = technology.prerequisites;
    this.learningResources = technology.learningResources;
    this.notes = technology.notes;
    this.isFeatured = technology.isFeatured;
    this.version = technology.version;
    this.lastUsed = technology.lastUsed;
    this.projectsUsedIn = technology.projectsUsedIn;
    this.createdAt = (technology as any).createdAt;
    this.updatedAt = (technology as any).updatedAt;
  }
}
