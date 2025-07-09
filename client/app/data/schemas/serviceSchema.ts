import { z } from 'zod'
import { SERVICE_CATEGORIES, SERVICE_STATUSES, PRICE_TYPES } from '../models/Service'

export const serviceSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  
  longDescription: z.string()
    .max(2000, 'Long description must be less than 2000 characters')
    .optional(),
  
  icon: z.string()
    .optional(),
  
  image: z.union([z.string().url(), z.instanceof(File)])
    .optional(),
  
  status: z.enum(SERVICE_STATUSES),
  
  category: z.enum(SERVICE_CATEGORIES),
  
  price: z.string()
    .max(50, 'Price must be less than 50 characters')
    .optional(),
  
  priceType: z.enum(PRICE_TYPES)
    .optional(),
  
  features: z.array(z.string())
    .min(1, 'At least one feature is required'),
  
  benefits: z.array(z.string())
    .optional(),
  
  deliverables: z.array(z.string())
    .optional(),
  
  timeline: z.string()
    .max(100, 'Timeline must be less than 100 characters')
    .optional(),
  
  technologies: z.array(z.string())
    .optional(),
  
  requirements: z.array(z.string())
    .optional(),
  
  isPopular: z.boolean(),
  
  isFeatured: z.boolean(),
  
  sortOrder: z.number()
    .min(0, 'Sort order must be positive')
    .optional()
})

export const serviceFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  priceType: z.string().optional(),
  isPopular: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  technologies: z.array(z.string()).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(['title', 'price', 'category', 'sortOrder', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export type ServiceFormData = z.infer<typeof serviceSchema>
export type ServiceFiltersData = z.infer<typeof serviceFiltersSchema>
