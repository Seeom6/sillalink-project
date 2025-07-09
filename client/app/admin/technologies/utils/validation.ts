/**
 * Technology validation utilities
 */

/**
 * Validates if a technology ID is valid
 * @param id - The technology ID to validate
 * @returns boolean indicating if the ID is valid
 */
export const isValidTechnologyId = (id: string | undefined): id is string => {
  return Boolean(id && typeof id === 'string' && id !== 'undefined' && id.trim().length > 0);
};

/**
 * Validates if an image URL is valid and not undefined
 * @param imageUrl - The image URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidImageUrl = (imageUrl: string | undefined): imageUrl is string => {
  return Boolean(
    imageUrl && 
    typeof imageUrl === 'string' && 
    imageUrl !== 'undefined' && 
    imageUrl.trim().length > 0 &&
    !imageUrl.includes('/undefined')
  );
};

/**
 * Sanitizes an image URL to prevent undefined values
 * @param imageUrl - The image URL to sanitize
 * @returns sanitized URL or null
 */
export const sanitizeImageUrl = (imageUrl: string | undefined): string | null => {
  if (!isValidImageUrl(imageUrl)) {
    return null;
  }
  return imageUrl;
};

/**
 * Validates technology form data
 * @param data - The form data to validate
 * @returns validation result with errors
 */
export const validateTechnologyData = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.description || data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (data.proficiencyLevel < 0 || data.proficiencyLevel > 100) {
    errors.proficiencyLevel = 'Proficiency level must be between 0 and 100';
  }

  if (data.estimatedLearningHours < 0) {
    errors.estimatedLearningHours = 'Learning hours cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
