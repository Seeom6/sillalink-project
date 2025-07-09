import { z } from 'zod';
import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '../../database/technology.schema';

// Base technology validation schema
export const technologyBaseSchema = z.object({
  name: z.string()
    .min(2, 'Technology name must be at least 2 characters')
    .max(100, 'Technology name must be less than 100 characters')
    .trim(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .trim(),
  
  longDescription: z.string()
    .max(2000, 'Long description must be less than 2000 characters')
    .trim()
    .optional(),
  
  category: z.nativeEnum(TechnologyCategory, {
    errorMap: () => ({ message: 'Invalid technology category' })
  }),
  
  status: z.nativeEnum(TechnologyStatus, {
    errorMap: () => ({ message: 'Invalid technology status' })
  }).optional(),
  
  difficultyLevel: z.nativeEnum(DifficultyLevel, {
    errorMap: () => ({ message: 'Invalid difficulty level' })
  }).optional(),
  
  icon: z.string().trim().optional(),
  
  image: z.string().trim().optional(),
  
  images: z.array(z.string().trim()).optional(),
  
  officialWebsite: z.string()
    .url('Invalid website URL')
    .trim()
    .optional()
    .or(z.literal('')),
  
  documentation: z.string()
    .url('Invalid documentation URL')
    .trim()
    .optional()
    .or(z.literal('')),
  
  tags: z.array(z.string().trim().min(1, 'Tag cannot be empty')).optional(),
  
  relatedTechnologies: z.array(z.string().trim().min(1, 'Related technology cannot be empty')).optional(),
  
  proficiencyLevel: z.number()
    .min(0, 'Proficiency level must be at least 0')
    .max(100, 'Proficiency level must be at most 100')
    .optional(),
  
  estimatedLearningHours: z.number()
    .min(0, 'Estimated learning hours must be at least 0')
    .optional(),
  
  prerequisites: z.array(z.string().trim().min(1, 'Prerequisite cannot be empty')).optional(),
  
  learningResources: z.array(z.string().trim().min(1, 'Learning resource cannot be empty')).optional(),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .trim()
    .optional(),
  
  isFeatured: z.boolean().optional(),
  
  version: z.string()
    .max(50, 'Version must be less than 50 characters')
    .trim()
    .optional(),
  
  lastUsed: z.string()
    .datetime('Invalid date format')
    .optional()
    .or(z.date().optional()),
  
  projectsUsedIn: z.number()
    .min(0, 'Projects used in must be at least 0')
    .optional()
});

// Create technology validation schema
export const createTechnologySchema = technologyBaseSchema;

// Update technology validation schema
export const updateTechnologySchema = technologyBaseSchema.partial().extend({
  id: z.string().min(1, 'Technology ID is required')
});

// Technology filters validation schema
export const technologyFiltersSchema = z.object({
  search: z.string().trim().optional(),
  
  category: z.nativeEnum(TechnologyCategory).optional(),
  
  status: z.nativeEnum(TechnologyStatus).optional(),
  
  difficultyLevel: z.nativeEnum(DifficultyLevel).optional(),
  
  isFeatured: z.boolean().optional(),
  
  tags: z.array(z.string().trim()).optional(),
  
  proficiencyLevel: z.object({
    min: z.number().min(0).max(100).optional(),
    max: z.number().min(0).max(100).optional()
  }).optional(),
  
  page: z.number().min(1, 'Page must be at least 1').optional(),
  
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit must be at most 100').optional(),
  
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'proficiencyLevel', 'projectsUsedIn']).optional(),
  
  sortOrder: z.enum(['asc', 'desc']).optional()
}).refine((data) => {
  if (data.proficiencyLevel?.min && data.proficiencyLevel?.max) {
    return data.proficiencyLevel.min <= data.proficiencyLevel.max;
  }
  return true;
}, {
  message: 'Minimum proficiency level must be less than or equal to maximum',
  path: ['proficiencyLevel']
});

// Bulk operations validation schemas
export const bulkDeleteTechnologiesSchema = z.object({
  ids: z.array(z.string().min(1, 'Technology ID cannot be empty'))
    .min(1, 'At least one technology ID is required')
    .max(50, 'Cannot delete more than 50 technologies at once')
});

export const bulkUpdateTechnologiesSchema = z.object({
  ids: z.array(z.string().min(1, 'Technology ID cannot be empty'))
    .min(1, 'At least one technology ID is required')
    .max(50, 'Cannot update more than 50 technologies at once'),
  
  updates: z.object({
    status: z.nativeEnum(TechnologyStatus).optional(),
    category: z.nativeEnum(TechnologyCategory).optional(),
    difficultyLevel: z.nativeEnum(DifficultyLevel).optional(),
    isFeatured: z.boolean().optional(),
    tags: z.array(z.string().trim()).optional()
  }).refine((data) => {
    return Object.keys(data).length > 0;
  }, {
    message: 'At least one field must be provided for update'
  })
});

// Technology import validation schema
export const importTechnologiesSchema = z.object({
  technologies: z.array(createTechnologySchema)
    .min(1, 'At least one technology is required')
    .max(100, 'Cannot import more than 100 technologies at once')
});

// Technology search validation schema
export const technologySearchSchema = z.object({
  query: z.string()
    .min(1, 'Search query is required')
    .max(100, 'Search query must be less than 100 characters')
    .trim(),
  
  filters: technologyFiltersSchema.optional()
});

// Export validation types
export type CreateTechnologyDto = z.infer<typeof createTechnologySchema>;
export type UpdateTechnologyDto = z.infer<typeof updateTechnologySchema>;
export type TechnologyFiltersDto = z.infer<typeof technologyFiltersSchema>;
export type BulkDeleteTechnologiesDto = z.infer<typeof bulkDeleteTechnologiesSchema>;
export type BulkUpdateTechnologiesDto = z.infer<typeof bulkUpdateTechnologiesSchema>;
export type ImportTechnologiesDto = z.infer<typeof importTechnologiesSchema>;
export type TechnologySearchDto = z.infer<typeof technologySearchSchema>;
