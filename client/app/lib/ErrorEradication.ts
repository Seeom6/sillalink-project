export const HandleError = (error: any): string => {
  // Handle specific HTTP status codes
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return error.response?.data?.message || 'Invalid data provided. Please check your input.';
      case 401:
        return 'You are not authorized to perform this action. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 409:
        return error.response?.data?.message || 'This email address is already in use.';
      case 422:
        return error.response?.data?.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please wait a moment and try again.';
      case 500:
        return 'Server error occurred. Please try again later.';
      default:
        break;
    }
  }

  // Extract message from various error formats
  const message =
    (error.response?.data?.error?.message) ||
    (error.response?.data?.message) ||
    error.message ||
    error.toString();

  return message || 'An unexpected error occurred. Please try again.';
};

export default HandleError;
