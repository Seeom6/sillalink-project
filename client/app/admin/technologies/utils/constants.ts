/**
 * Technology module constants
 */

import { TechnologyFilters } from '@/app/types/technologyTypes';

/**
 * Default pagination settings
 */
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 12,
  sortBy: 'createdAt',
  sortOrder: 'desc' as const
};

/**
 * Default technology filters
 */
export const DEFAULT_FILTERS: TechnologyFilters = {
  ...DEFAULT_PAGINATION
};

/**
 * Image upload constraints
 */
export const IMAGE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'svg']
};

/**
 * Form validation constraints
 */
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 500
  },
  LONG_DESCRIPTION: {
    MAX_LENGTH: 2000
  },
  VERSION: {
    MAX_LENGTH: 50
  },
  NOTES: {
    MAX_LENGTH: 1000
  },
  PROFICIENCY: {
    MIN: 0,
    MAX: 100
  },
  LEARNING_HOURS: {
    MIN: 0,
    MAX: 10000
  },
  PROJECTS: {
    MIN: 0,
    MAX: 1000
  }
};

/**
 * UI display constants
 */
export const DISPLAY = {
  GRID_BREAKPOINTS: {
    SM: 1,
    MD: 2,
    LG: 3,
    XL: 4
  },
  TRUNCATE_LENGTHS: {
    CARD_DESCRIPTION: 100,
    TABLE_DESCRIPTION: 80,
    CARD_TITLE: 30
  },
  LOADING_SKELETON_COUNT: 6
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_ID: 'Invalid technology ID. Please refresh the page and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  PERMISSION_ERROR: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Technology not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UPLOAD_ERROR: 'Failed to upload image. Please try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.'
};

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  CREATED: 'Technology created successfully!',
  UPDATED: 'Technology updated successfully!',
  DELETED: 'Technology deleted successfully!',
  FEATURED_TOGGLED: 'Featured status updated successfully!',
  BULK_DELETED: 'Technologies deleted successfully!',
  BULK_UPDATED: 'Technologies updated successfully!'
};
