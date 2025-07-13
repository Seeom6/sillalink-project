import { ServiceCategory, ServiceStatus } from '../../../database/schemas/service.schema';

export class UpdateServiceDto {
  name?: string;
  description?: string;
  longDescription?: string;
  category?: ServiceCategory;
  status?: ServiceStatus;
  image?: string;
  images?: string[];
  icon?: string;
  price?: number;
  currency?: string;
  pricingModel?: string;
  features?: string[];
  technologies?: string[];
  estimatedDuration?: number;
  deliverables?: string;
  tags?: string[];
  isFeatured?: boolean;
  isActive?: boolean;
  orderCount?: number;
  rating?: number;
  reviewCount?: number;
  contactEmail?: string;
  contactPhone?: string;
  externalLink?: string;
}
