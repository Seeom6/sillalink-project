/**
 * Technology formatting utilities
 */

import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '@/app/types/technologyTypes';

/**
 * Formats a technology category for display
 * @param category - The category to format
 * @returns formatted category string
 */
export const formatCategory = (category: TechnologyCategory): string => {
  return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Formats a technology status for display
 * @param status - The status to format
 * @returns formatted status string
 */
export const formatStatus = (status: TechnologyStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Formats a difficulty level for display
 * @param difficulty - The difficulty to format
 * @returns formatted difficulty string
 */
export const formatDifficulty = (difficulty: DifficultyLevel): string => {
  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
};

/**
 * Gets the color class for a technology status
 * @param status - The technology status
 * @returns CSS color class
 */
export const getStatusColor = (status: TechnologyStatus): string => {
  const colorMap: Record<TechnologyStatus, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    deprecated: 'bg-red-100 text-red-800',
    learning: 'bg-blue-100 text-blue-800',
    expert: 'bg-purple-100 text-purple-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Gets the color class for a difficulty level
 * @param difficulty - The difficulty level
 * @returns CSS color class
 */
export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  const colorMap: Record<DifficultyLevel, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-orange-100 text-orange-800',
    expert: 'bg-red-100 text-red-800'
  };
  return colorMap[difficulty] || 'bg-gray-100 text-gray-800';
};

/**
 * Formats proficiency level as percentage
 * @param proficiency - The proficiency level (0-100)
 * @returns formatted percentage string
 */
export const formatProficiency = (proficiency: number): string => {
  return `${Math.round(proficiency)}%`;
};

/**
 * Formats learning hours with appropriate unit
 * @param hours - The number of hours
 * @returns formatted hours string
 */
export const formatLearningHours = (hours: number): string => {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours < 24) {
    return `${Math.round(hours)} hrs`;
  } else {
    const days = Math.round(hours / 24);
    return `${days} day${days > 1 ? 's' : ''}`;
  }
};

/**
 * Truncates text to specified length with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Removes undefined values from an object to satisfy exactOptionalPropertyTypes
 * This utility helps when working with TypeScript's strict optional property types
 * @param obj - The object to filter
 * @returns Object with undefined values removed
 */
export const removeUndefinedValues = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      (result as any)[key] = value;
    }
  }

  return result;
};

/**
 * Creates a filter object with conditional properties to satisfy exactOptionalPropertyTypes
 * Only includes properties that have truthy values
 * @param filters - Object with potential undefined values
 * @returns Object with only defined values
 */
export const createConditionalFilters = <T extends Record<string, any>>(filters: T): Partial<T> => {
  const result: Partial<T> = {};

  for (const [key, value] of Object.entries(filters)) {
    // Include the property only if it has a meaningful value
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      (result as any)[key] = value;
    }
  }

  return result;
};
