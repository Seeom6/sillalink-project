import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechnologyDocument = Technology & Document;

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

@Schema({ timestamps: true })
export class Technology {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  description: string;

  @Prop({ type: String, trim: true })
  longDescription?: string;

  @Prop({ 
    type: String, 
    enum: TechnologyCategory, 
    required: true,
    default: TechnologyCategory.OTHER 
  })
  category: TechnologyCategory;

  @Prop({ 
    type: String, 
    enum: TechnologyStatus, 
    default: TechnologyStatus.ACTIVE 
  })
  status: TechnologyStatus;

  @Prop({ 
    type: String, 
    enum: DifficultyLevel, 
    default: DifficultyLevel.BEGINNER 
  })
  difficultyLevel: DifficultyLevel;

  @Prop({ type: String, default: '' })
  icon: string;

  @Prop({ type: String, default: '' })
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String })
  officialWebsite?: string;

  @Prop({ type: String })
  documentation?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  relatedTechnologies: string[];

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  proficiencyLevel: number;

  @Prop({ type: Number, min: 0, default: 0 })
  estimatedLearningHours: number;

  @Prop({ type: [String], default: [] })
  prerequisites: string[];

  @Prop({ type: [String], default: [] })
  learningResources: string[];

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: String })
  version?: string;

  @Prop({ type: Date })
  lastUsed?: Date;

  @Prop({ type: Number, default: 0 })
  projectsUsedIn: number;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);

// Index for better search performance
TechnologySchema.index({ name: 'text', description: 'text', tags: 'text' });
TechnologySchema.index({ category: 1, status: 1 });
TechnologySchema.index({ isFeatured: 1, isDeleted: 1 });
