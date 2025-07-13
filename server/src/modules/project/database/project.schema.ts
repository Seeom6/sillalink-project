import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {User} from "@Modules/user";
import {UserDocument} from "@Modules/user";
import { Technology, TechnologyDocument } from "@Modules/technology";

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

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  assignee?: mongoose.Types.ObjectId | UserDocument;

  @Prop({ type: Date })
  dueDate?: Date;

  @Prop({
    type: String,
    enum: TaskStatus,
    required: true,
    default: TaskStatus.TODO
  })
  status: TaskStatus;

  @Prop({
    type: String,
    enum: TaskPriority,
    required: true,
    default: TaskPriority.MEDIUM
  })
  priority: TaskPriority;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: String, trim: true })
  createdBy?: string;
}

export const ProjectTaskSchema = SchemaFactory.createForClass(ProjectTask);

@Schema({ timestamps: true })
export class Project {
  @Prop({ type: String, required: true, trim: true, minlength: 2, maxlength: 100 })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 1000 })
  description?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: String, trim: true })
  externalLink?: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Number, min: 0 })
  cost?: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: [] })
  assignedEmployees: mongoose.Types.ObjectId[] | UserDocument[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Technology.name, default: [] })
  technologiesUsed: mongoose.Types.ObjectId[] | TechnologyDocument[];

  @Prop({
    type: String,
    enum: ProjectStatus,
    required: true,
    default: ProjectStatus.PLANNING
  })
  status: ProjectStatus;

  @Prop({
    type: String,
    enum: ProjectPriority,
    required: true,
    default: ProjectPriority.MEDIUM
  })
  priority: ProjectPriority;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: String, trim: true })
  createdBy?: string;

  @Prop({ type: String, trim: true })
  updatedBy?: string;

  @Prop({ type: [ProjectTaskSchema], default: [] })
  tasks: ProjectTask[];

  // Legacy fields for backward compatibility
  @Prop({ type: String })
  link?: string;

  @Prop({ type: String })
  mainImage?: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: User.name })
  members?: mongoose.Types.ObjectId[] | UserDocument[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

// Add indexes for better query performance
ProjectSchema.index({ name: 1 });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ priority: 1 });
ProjectSchema.index({ startDate: 1 });
ProjectSchema.index({ endDate: 1 });
ProjectSchema.index({ assignedEmployees: 1 });
ProjectSchema.index({ technologiesUsed: 1 });
ProjectSchema.index({ isDeleted: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ createdAt: 1 });

// Add text index for search functionality
ProjectSchema.index({
  name: 'text',
  description: 'text'
});

// Add compound indexes for common queries
ProjectSchema.index({ status: 1, priority: 1 });
ProjectSchema.index({ isDeleted: 1, status: 1 });
ProjectSchema.index({ assignedEmployees: 1, status: 1 });

// Pre-save middleware to handle image URLs
ProjectSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    this.images = this.images.map(img =>
      img.startsWith('http') ? img : `${process.env.BASE_URL}/${img}`
    );
  }

  // Handle legacy mainImage field
  if (this.mainImage && !this.mainImage.startsWith('http')) {
    this.mainImage = `${process.env.BASE_URL}/${this.mainImage}`;
  }

  next();
});

// Post-find middleware to handle image URLs
ProjectSchema.post(['find', 'findOne'], function(docs) {
  if (!docs) return;

  const handleDoc = (doc: any) => {
    if (doc.images && doc.images.length > 0) {
      doc.images = doc.images.map((img: string) =>
        img.startsWith('http') ? img : `${process.env.BASE_URL}/${img}`
      );
    }

    // Handle legacy mainImage field
    if (doc.mainImage && !doc.mainImage.startsWith('http')) {
      doc.mainImage = `${process.env.BASE_URL}/${doc.mainImage}`;
    }
  };

  if (Array.isArray(docs)) {
    docs.forEach(handleDoc);
  } else {
    handleDoc(docs);
  }
});

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

ProjectSchema.post("find", function(doc: ProjectDocument) {
  doc.mainImage = `${process.env.BASE_URL}/${doc.mainImage}`
})