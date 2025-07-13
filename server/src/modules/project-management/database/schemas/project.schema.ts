import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

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

@Schema({ _id: false })
export class ProjectTask {
  @Prop({ type: String, required: true, trim: true, minlength: 2, maxlength: 200 })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignee?: Types.ObjectId;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({ type: String, enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ type: String, enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  progress: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

@Schema({ _id: false })
export class ProjectMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  role: string;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;
}

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String, required: true, trim: true, minlength: 2, maxlength: 200 })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 2000 })
  description?: string;

  @Prop({ type: String, trim: true, maxlength: 5000 })
  longDescription?: string;

  @Prop({ type: String, enum: ProjectStatus, default: ProjectStatus.PLANNING })
  status: ProjectStatus;

  @Prop({ type: String, enum: ProjectPriority, default: ProjectPriority.MEDIUM })
  priority: ProjectPriority;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Date })
  deadline?: Date;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  progress: number;

  @Prop({ type: Number, min: 0 })
  budget?: number;

  @Prop({ type: String, default: 'USD' })
  currency: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  projectManager: Types.ObjectId;

  @Prop({ type: [ProjectMember], default: [] })
  members: ProjectMember[];

  @Prop({ type: [Types.ObjectId], ref: 'Technology', default: [] })
  technologies: Types.ObjectId[];

  @Prop({ type: [ProjectTask], default: [] })
  tasks: ProjectTask[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: String })
  mainImage?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String })
  repositoryUrl?: string;

  @Prop({ type: String })
  liveUrl?: string;

  @Prop({ type: String })
  externalLink?: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  @Prop({ type: String })
  notes?: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
export const ProjectTaskSchema = SchemaFactory.createForClass(ProjectTask);
export const ProjectMemberSchema = SchemaFactory.createForClass(ProjectMember);

// Validation middleware
ProjectSchema.pre('save', function(next) {
  // Validate end date is after start date
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    const error = new Error('End date must be after start date');
    return next(error);
  }

  // Validate external link format
  if (this.externalLink && this.externalLink.trim()) {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(this.externalLink)) {
      const error = new Error('External link must be a valid URL starting with http:// or https://');
      return next(error);
    }
  }

  next();
});
