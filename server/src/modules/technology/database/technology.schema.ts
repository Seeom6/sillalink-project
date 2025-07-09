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
    required: true,
    default: TechnologyStatus.ACTIVE
  })
  status: TechnologyStatus;

  @Prop({
    type: String,
    enum: DifficultyLevel,
    required: true,
    default: DifficultyLevel.BEGINNER
  })
  difficultyLevel: DifficultyLevel;

  @Prop({ type: String, default: '' })
  icon: string;

  @Prop({ type: String, default: '' })
  image: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, trim: true })
  officialWebsite?: string;

  @Prop({ type: String, trim: true })
  documentation?: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  relatedTechnologies: string[];

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  proficiencyLevel: number;

  @Prop({ type: Number, default: 0 })
  estimatedLearningHours: number;

  @Prop({ type: [String], default: [] })
  prerequisites: string[];

  @Prop({ type: [String], default: [] })
  learningResources: string[];

  @Prop({ type: String, trim: true })
  notes?: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: String, trim: true })
  version?: string;

  @Prop({ type: Date })
  lastUsed?: Date;

  @Prop({ type: Number, default: 0 })
  projectsUsedIn: number;

  @Prop({ type: String, trim: true })
  createdBy?: string;

  @Prop({ type: String, trim: true })
  updatedBy?: string;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);

// Add indexes for better query performance
TechnologySchema.index({ name: 1 });
TechnologySchema.index({ category: 1 });
TechnologySchema.index({ status: 1 });
TechnologySchema.index({ difficultyLevel: 1 });
TechnologySchema.index({ tags: 1 });
TechnologySchema.index({ isDeleted: 1 });
TechnologySchema.index({ isFeatured: 1 });

// Add text index for search functionality
TechnologySchema.index({ 
  name: 'text', 
  description: 'text', 
  longDescription: 'text',
  tags: 'text'
});

// Pre-save middleware to handle image URLs
TechnologySchema.pre('save', function(next) {
  if (this.image && !this.image.startsWith('http')) {
    this.image = `${process.env.BASE_URL}/${this.image}`;
  }
  
  if (this.images && this.images.length > 0) {
    this.images = this.images.map(img => 
      img.startsWith('http') ? img : `${process.env.BASE_URL}/${img}`
    );
  }
  
  next();
});

// Post-find middleware to handle image URLs
TechnologySchema.post(['find', 'findOne'], function(docs) {
  if (!docs) return;
  
  const handleDoc = (doc: any) => {
    if (doc.image && !doc.image.startsWith('http')) {
      doc.image = `${process.env.BASE_URL}/${doc.image}`;
    }
    
    if (doc.images && doc.images.length > 0) {
      doc.images = doc.images.map((img: string) => 
        img.startsWith('http') ? img : `${process.env.BASE_URL}/${img}`
      );
    }
  };

  if (Array.isArray(docs)) {
    docs.forEach(handleDoc);
  } else {
    handleDoc(docs);
  }
});
