// Base API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error response type
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  code?: string;
}

export type GlobalErrorHandler = (error: ApiError) => void;

// Paginated response type
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}