/**
 * Utility functions for handling and extracting error messages from API responses
 */

export interface ApiError {
  response?: {
    data?: {
      message?: string | string[];
      error?: string | {
        message?: string;
        code?: number;
        path?: string;
        time?: string;
        keyValue?: Record<string, any>;
        keyPattern?: Record<string, any>;
      };
      code?: number;
      keyValue?: Record<string, any>;
      keyPattern?: Record<string, any>;
      statusCode?: number;
    };
    status?: number;
  };
  message?: string;
  code?: number;
  name?: string;
  isAxiosError?: boolean;
}

/**
 * Extracts a user-friendly error message from various error response formats
 * Enhanced to handle nested error structures like response.data.error
 */
export const extractErrorMessage = (error: ApiError, defaultMessage: string = 'An error occurred'): string => {
  console.group('🔍 Enhanced Error Handler - Processing Error');
  console.log('Error Type:', typeof error);
  console.log('Is Axios Error:', error?.isAxiosError);
  console.log('Error Name:', error?.name);
  console.log('Error Message:', error?.message);
  console.log('Response Status:', error?.response?.status);
  console.log('Response Data:', error?.response?.data);

  if (error?.response?.data?.error) {
    console.log('Nested Error Object:', error.response.data.error);
  }
  console.groupEnd();

  // Handle different error response structures
  if (error?.response?.data) {
    const errorData = error.response.data;

    // 1. Handle nested error object in response.data.error (NEW - highest priority)
    if (typeof errorData.error === 'object' && errorData.error !== null) {
      const nestedError = errorData.error;

      // Handle MongoDB duplicate key errors in nested structure
      if (nestedError.code === 11000) {
        console.log('🔑 Nested Duplicate Key Error Detected');
        return handleDuplicateKeyError(nestedError);
      }

      // Handle nested error message
      if (nestedError.message) {
        console.log('📝 Nested Error Message:', nestedError.message);
        return nestedError.message;
      }
    }

    // 2. Handle MongoDB duplicate key errors at root level
    if (errorData.code === 11000) {
      console.log('🔑 Root Level Duplicate Key Error Detected');
      return handleDuplicateKeyError(errorData);
    }

    // 3. Handle validation errors (array of messages)
    if (Array.isArray(errorData.message)) {
      console.log('✅ Validation Errors Array:', errorData.message);
      return formatValidationErrors(errorData.message);
    }

    // 4. Handle single error message
    if (errorData.message && typeof errorData.message === 'string') {
      console.log('📝 Single Error Message:', errorData.message);
      return errorData.message;
    }

    // 5. Handle string error in errorData.error
    if (typeof errorData.error === 'string') {
      console.log('📝 String Error:', errorData.error);
      return errorData.error;
    }
  }

  // Handle AxiosError with status but no data
  if (error?.response?.status) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Unauthorized - please log in again';
      case 403:
        return 'Forbidden - you do not have permission';
      case 404:
        return 'Not found';
      case 500:
        return 'Server error - please try again later';
      default:
        return `Request failed with status ${status}`;
    }
  }

  // Handle network errors
  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
};

/**
 * Enhanced handler for MongoDB duplicate key errors
 * Supports both root level and nested error structures
 */
const handleDuplicateKeyError = (errorData: any): string => {
  console.log('🔑 Processing Duplicate Key Error:', errorData);

  // Try to extract keyValue from various possible locations
  const keyValue = errorData.keyValue || errorData.error?.keyValue;
  const keyPattern = errorData.keyPattern || errorData.error?.keyPattern;

  console.log('Key Value:', keyValue);
  console.log('Key Pattern:', keyPattern);

  if (!keyValue || Object.keys(keyValue).length === 0) {
    console.log('⚠️ No keyValue found, using generic message');
    return 'A record with this information already exists';
  }

  // Get the first field that caused the duplicate error
  const duplicateField = Object.keys(keyValue)[0];
  const duplicateValue = keyValue[duplicateField];

  console.log(`🎯 Duplicate field: ${duplicateField}, value: ${duplicateValue}`);

  // Handle specific duplicate key scenarios with user-friendly messages
  switch (duplicateField) {
    case 'nationalId':
      return `An employee with National ID "${duplicateValue}" already exists`;

    case 'email':
      return `An employee with email "${duplicateValue}" already exists`;

    case 'employeeId':
      return `An employee with ID "${duplicateValue}" already exists`;

    case 'phone':
      return `An employee with phone number "${duplicateValue}" already exists`;

    case 'username':
      return `Username "${duplicateValue}" is already taken`;

    case 'code':
      return `Code "${duplicateValue}" is already in use`;

    case 'name':
      return `Name "${duplicateValue}" already exists`;

    default:
      // Generic message for unknown fields
      return `A record with ${duplicateField} "${duplicateValue}" already exists`;
  }
};

/**
 * Handles validation errors and formats them nicely
 */
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 1) {
    return errors[0];
  }
  
  return `Multiple validation errors: ${errors.join(', ')}`;
};

/**
 * Checks if an error is a network error
 */
export const isNetworkError = (error: ApiError): boolean => {
  return !error?.response && !!error?.message;
};

/**
 * Checks if an error is a validation error
 */
export const isValidationError = (error: ApiError): boolean => {
  return error?.response?.status === 400 || error?.response?.data?.statusCode === 400;
};

/**
 * Checks if an error is an authorization error
 */
export const isAuthError = (error: ApiError): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

/**
 * Enhanced check for duplicate key errors
 * Handles both root level and nested error structures
 */
export const isDuplicateKeyError = (error: ApiError): boolean => {
  const errorData = error?.response?.data;
  if (!errorData) return false;

  // Check root level code
  if (errorData.code === 11000) return true;

  // Check nested error code
  if (typeof errorData.error === 'object' && errorData.error?.code === 11000) return true;

  return false;
};

/**
 * Gets the HTTP status code from an error
 */
export const getErrorStatusCode = (error: ApiError): number | undefined => {
  return error?.response?.status || error?.response?.data?.statusCode;
};

/**
 * Extracts duplicate field information from error
 */
export const extractDuplicateFieldInfo = (error: ApiError): { field: string; value: any } | null => {
  if (!isDuplicateKeyError(error)) return null;

  const errorData = error?.response?.data;
  if (!errorData) return null;

  // Try to extract keyValue from various locations
  const keyValue = errorData.keyValue ||
                   (typeof errorData.error === 'object' ? errorData.error?.keyValue : null);

  if (keyValue && Object.keys(keyValue).length > 0) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return { field, value };
  }

  return null;
};

/**
 * Gets user-friendly field name for error messages
 */
export const getFieldDisplayName = (fieldName: string): string => {
  const fieldMap: Record<string, string> = {
    nationalId: 'National ID',
    email: 'Email',
    phone: 'Phone Number',
    employeeId: 'Employee ID',
    username: 'Username',
    firstName: 'First Name',
    lastName: 'Last Name',
    position: 'Position',
    department: 'Department'
  };

  return fieldMap[fieldName] || fieldName;
};

/**
 * Creates a standardized error object for logging
 */
export const createErrorLog = (error: ApiError, context: string) => {
  const duplicateInfo = extractDuplicateFieldInfo(error);

  return {
    context,
    message: extractErrorMessage(error),
    statusCode: getErrorStatusCode(error),
    isNetworkError: isNetworkError(error),
    isValidationError: isValidationError(error),
    isAuthError: isAuthError(error),
    isDuplicateKey: isDuplicateKeyError(error),
    duplicateField: duplicateInfo?.field,
    duplicateValue: duplicateInfo?.value,
    timestamp: new Date().toISOString(),
    originalError: error
  };
};
