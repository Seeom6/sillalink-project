export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: false;
  message: string;
  errorCode: number;
  details?: any;
}

export interface FilterState {
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: any;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
