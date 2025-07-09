import { z } from 'zod'
import { PROJECT_CATEGORIES, PROJECT_STATUSES, PROJECT_PRIORITIES } from '../models/Project'

export const projectSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  
  longDescription: z.string()
    .max(2000, 'Long description must be less than 2000 characters')
    .optional(),
  
  image: z.union([z.string().url(), z.instanceof(File)])
    .optional(),
  
  images: z.array(z.union([z.string().url(), z.instanceof(File)]))
    .optional(),
  
  technologies: z.array(z.string())
    .min(1, 'At least one technology is required'),
  
  status: z.enum(PROJECT_STATUSES),
  
  category: z.enum(PROJECT_CATEGORIES),
  
  priority: z.enum(PROJECT_PRIORITIES),
  
  startDate: z.string()
    .min(1, 'Start date is required'),
  
  endDate: z.string()
    .optional(),
  
  liveUrl: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  
  githubUrl: z.string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  
  clientName: z.string()
    .max(100, 'Client name must be less than 100 characters')
    .optional(),
  
  teamMembers: z.array(z.string())
    .optional(),
  
  budget: z.number()
    .min(0, 'Budget must be positive')
    .optional(),
  
  progress: z.number()
    .min(0, 'Progress must be between 0 and 100')
    .max(100, 'Progress must be between 0 and 100')
    .optional(),
  
  features: z.array(z.string())
    .optional(),
  
  challenges: z.array(z.string())
    .optional(),
  
  learnings: z.array(z.string())
    .optional(),
  
  tags: z.array(z.string())
    .optional(),
  
  isPublic: z.boolean(),
  
  isFeatured: z.boolean(),
  
  sortOrder: z.number()
    .min(0, 'Sort order must be positive')
    .optional()
})

export const projectFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  sortBy: z.enum(['title', 'startDate', 'endDate', 'priority', 'progress', 'sortOrder']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
})

export type ProjectFormData = z.infer<typeof projectSchema>
export type ProjectFiltersData = z.infer<typeof projectFiltersSchema>
