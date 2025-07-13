import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance',
  DEPRECATED = 'deprecated'
}

export enum ServiceCategory {
  WEB_DEVELOPMENT = 'web_development',
  MOBILE_DEVELOPMENT = 'mobile_development',
  DESIGN = 'design',
  CONSULTING = 'consulting',
  MAINTENANCE = 'maintenance',
  TRAINING = 'training',
  OTHER = 'other'
}

@Schema({ timestamps: true })
export class Service {
    @Prop({ type: String, required: true, trim: true })
    name: string;

    @Prop({ type: String, required: true, trim: true })
    description: string;

    @Prop({ type: String, trim: true })
    longDescription?: string;

    @Prop({ 
      type: String, 
      enum: ServiceCategory, 
      default: ServiceCategory.OTHER 
    })
    category: ServiceCategory;

    @Prop({ 
      type: String, 
      enum: ServiceStatus, 
      default: ServiceStatus.ACTIVE 
    })
    status: ServiceStatus;

    @Prop({ type: String, default: null })
    image: string;

    @Prop({ type: [String], default: [] })
    images: string[];

    @Prop({ type: String })
    icon?: string;

    @Prop({ type: Number, min: 0 })
    price?: number;

    @Prop({ type: String, default: 'USD' })
    currency: string;

    @Prop({ type: String })
    pricingModel?: string; // 'fixed', 'hourly', 'monthly', 'custom'

    @Prop({ type: [String], default: [] })
    features: string[];

    @Prop({ type: [String], default: [] })
    technologies: string[];

    @Prop({ type: Number, min: 1, max: 10 })
    estimatedDuration?: number; // in weeks

    @Prop({ type: String })
    deliverables?: string;

    @Prop({ type: [String], default: [] })
    tags: string[];

    @Prop({ type: Boolean, default: false })
    isFeatured: boolean;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @Prop({ type: Number, default: 0 })
    orderCount: number;

    @Prop({ type: Number, min: 0, max: 5, default: 0 })
    rating: number;

    @Prop({ type: Number, default: 0 })
    reviewCount: number;

    @Prop({ type: String })
    contactEmail?: string;

    @Prop({ type: String })
    contactPhone?: string;

    @Prop({ type: String })
    externalLink?: string;

    @Prop({ type: Date, default: null })
    deletedAt?: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

// Index for better search performance
ServiceSchema.index({ name: 'text', description: 'text', tags: 'text' });
ServiceSchema.index({ category: 1, status: 1 });
ServiceSchema.index({ isFeatured: 1, isActive: 1 });
