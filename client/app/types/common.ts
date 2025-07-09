// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// API Response types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface FormField<T = any> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>;
  };
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface LoadingProps {
  isLoading?: boolean;
  loadingText?: string;
}

export interface ErrorProps {
  error?: string | Error | null;
  onRetry?: () => void;
}

// User and Auth types
export type UserRole = 'admin' | 'operator' | 'employee' | 'user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string;
}

// Filter and sort types
export interface FilterOption<T = string> {
  label: string;
  value: T;
  count?: number;
}

export interface SortOption<T = string> {
  label: string;
  value: T;
  direction: 'asc' | 'desc';
}

export interface FilterState<T extends Record<string, any> = Record<string, any>> {
  filters: Partial<T>;
  sort?: {
    field: keyof T;
    direction: 'asc' | 'desc';
  };
  search?: string;
}

// Status types
export type Status = 'active' | 'inactive' | 'pending' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Theme and UI types
export type Theme = 'light' | 'dark' | 'system';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Utility types for better type safety
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type AsyncEventHandler<T = Event> = (event: T) => Promise<void>;

// Generic CRUD operations
export interface CrudOperations<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  create: (data: CreateData) => Promise<T>;
  read: (id: string) => Promise<T>;
  update: (id: string, data: UpdateData) => Promise<T>;
  delete: (id: string) => Promise<void>;
  list: (filters?: FilterState) => Promise<PaginatedResponse<T>>;
}

// Route types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  roles?: UserRole[];
  title?: string;
  description?: string;
}

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_URL: string;
  APP_URL: string;
  ENABLE_ANALYTICS?: boolean;
  ENABLE_ERROR_REPORTING?: boolean;
}

// Branded types for better type safety
export type Brand<T, B> = T & { __brand: B };
export type UserId = Brand<string, 'UserId'>;
export type ProjectId = Brand<string, 'ProjectId'>;
export type ServiceId = Brand<string, 'ServiceId'>;

// Conditional types
export type NonEmptyArray<T> = [T, ...T[]];
export type AtLeastOne<T> = [T, ...T[]];

// Function types
export type AsyncFunction<T extends any[] = any[], R = any> = (...args: T) => Promise<R>;
export type SyncFunction<T extends any[] = any[], R = any> = (...args: T) => R;

// Component ref types
export type ComponentRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>['ref'];
