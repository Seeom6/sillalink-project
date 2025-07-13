# SillaLink Client Frontend Architecture

## Overview

This document outlines the comprehensive frontend architecture that complements the modular NestJS server. The client application follows a domain-driven design approach, mirroring the server's modular structure while providing both admin dashboard and public website functionality.

## Technology Stack

### Core Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management
- **Zustand** - Client state management
- **Axios** - HTTP client with interceptors

### Authentication & Security
- **NextAuth.js** - Authentication library
- **JWT** - Token-based authentication
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### UI & Styling
- **Framer Motion** - Animations and transitions
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications
- **Recharts** - Data visualization

## Project Structure

```
client/
├── 📁 app/                          # Next.js App Router
│   ├── (admin)/                     # Admin dashboard routes
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   ├── employees/
│   │   │   ├── projects/
│   │   │   ├── technologies/
│   │   │   ├── services/
│   │   │   └── health/
│   │   └── layout.tsx               # Admin layout wrapper
│   ├── (public)/                    # Public website routes
│   │   ├── page.tsx                 # Homepage
│   │   ├── about/
│   │   ├── services/
│   │   ├── projects/
│   │   ├── team/
│   │   └── contact/
│   ├── auth/                        # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── api/                         # API routes (NextAuth)
│   ├── globals.css
│   ├── layout.tsx                   # Root layout
│   └── loading.tsx                  # Global loading component
├── 📁 components/                   # Reusable components
│   ├── admin/                       # Admin-specific components
│   │   ├── dashboard/
│   │   ├── users/
│   │   ├── employees/
│   │   ├── projects/
│   │   ├── technologies/
│   │   ├── services/
│   │   └── health/
│   ├── public/                      # Public website components
│   │   ├── hero/
│   │   ├── services/
│   │   ├── portfolio/
│   │   ├── team/
│   │   └── contact/
│   ├── auth/                        # Authentication components
│   ├── shared/                      # Shared components
│   │   ├── ui/                      # Base UI components (shadcn/ui)
│   │   ├── forms/
│   │   ├── tables/
│   │   ├── modals/
│   │   └── navigation/
│   └── layout/                      # Layout components
├── 📁 lib/                          # Utilities and configurations
│   ├── api/                         # API client and endpoints
│   │   ├── client.ts                # Axios configuration
│   │   ├── auth.ts                  # Authentication API
│   │   ├── admin/                   # Admin API endpoints
│   │   │   ├── users.ts
│   │   │   ├── employees.ts
│   │   │   ├── projects.ts
│   │   │   ├── technologies.ts
│   │   │   ├── services.ts
│   │   │   └── health.ts
│   │   └── public/                  # Public API endpoints
│   │       ├── projects.ts
│   │       ├── services.ts
│   │       └── employees.ts
│   ├── auth/                        # Authentication configuration
│   │   ├── config.ts                # NextAuth configuration
│   │   ├── providers.ts             # Auth providers
│   │   └── middleware.ts            # Auth middleware
│   ├── hooks/                       # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-api.ts
│   │   └── use-permissions.ts
│   ├── stores/                      # Zustand stores
│   │   ├── auth-store.ts
│   │   ├── ui-store.ts
│   │   └── admin-store.ts
│   ├── types/                       # TypeScript type definitions
│   │   ├── api.ts                   # API response types
│   │   ├── auth.ts                  # Authentication types
│   │   ├── admin/                   # Admin domain types
│   │   │   ├── user.ts
│   │   │   ├── employee.ts
│   │   │   ├── project.ts
│   │   │   ├── technology.ts
│   │   │   └── service.ts
│   │   └── public/                  # Public domain types
│   ├── utils/                       # Utility functions
│   │   ├── cn.ts                    # Class name utility
│   │   ├── format.ts                # Formatting utilities
│   │   ├── validation.ts            # Zod schemas
│   │   └── constants.ts             # Application constants
│   └── config/                      # Configuration files
│       ├── site.ts                  # Site configuration
│       ├── navigation.ts            # Navigation configuration
│       └── permissions.ts           # Permission definitions
├── 📁 public/                       # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
├── 📁 styles/                       # Additional styles
├── 📁 docs/                         # Documentation
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
├── .env.local                       # Environment variables
├── .env.example                     # Environment template
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
└── README.md                        # Project documentation
```

## Domain-Driven Architecture

### Admin Dashboard Modules

Each admin module follows this consistent structure:

```
components/admin/{module}/
├── {module}-list.tsx                # List/table view
├── {module}-form.tsx                # Create/edit form
├── {module}-detail.tsx              # Detail view
├── {module}-actions.tsx             # Action buttons/dropdowns
├── {module}-filters.tsx             # Search and filter components
├── {module}-stats.tsx               # Statistics/overview cards
└── index.ts                         # Module exports
```

#### 1. User Management Module
- **Components**: User list, user form, role management, activation controls
- **Features**: CRUD operations, role assignment, bulk actions, search/filter
- **API Integration**: `/api/v1/admin/users/*`

#### 2. Employee Management Module
- **Components**: Employee profiles, department management, hierarchy view
- **Features**: Employee CRUD, manager assignments, department filtering
- **API Integration**: `/api/v1/admin/employees/*`

#### 3. Project Management Module
- **Components**: Project dashboard, task management, team assignments
- **Features**: Project lifecycle, progress tracking, member management
- **API Integration**: `/api/v1/admin/projects/*`

#### 4. Technology Management Module
- **Components**: Technology catalog, proficiency tracking, skill matrix
- **Features**: Technology CRUD, proficiency levels, categorization
- **API Integration**: `/api/v1/admin/technologies/*`

#### 5. Service Management Module
- **Components**: Service catalog, pricing management, feature lists
- **Features**: Service CRUD, pricing tiers, order tracking
- **API Integration**: `/api/v1/admin/services/*`

#### 6. Health Monitoring Module
- **Components**: System dashboard, health indicators, monitoring charts
- **Features**: Real-time monitoring, alerts, system status
- **API Integration**: `/api/v1/health/*`

### Public Website Modules

#### 1. Homepage Module
- **Components**: Hero section, featured projects, service highlights
- **Features**: Company overview, call-to-action sections, testimonials

#### 2. Services Module
- **Components**: Service catalog, service details, pricing display
- **Features**: Service browsing, detailed descriptions, contact forms
- **API Integration**: `/api/v1/website/services/*`

#### 3. Portfolio Module
- **Components**: Project showcase, project details, technology tags
- **Features**: Project filtering, case studies, technology highlights
- **API Integration**: `/api/v1/website/projects/*`

#### 4. Team Module
- **Components**: Employee profiles, team structure, expertise areas
- **Features**: Public employee information, skill showcases
- **API Integration**: `/api/v1/website/employees/*`

#### 5. Contact Module
- **Components**: Contact forms, company information, location maps
- **Features**: Inquiry forms, contact details, office locations

## Authentication & Security

### Authentication Flow
```typescript
// Authentication states
type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
};

// Role-based access control
enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  USER = 'user',
  EMPLOYEE = 'employee'
}

// Permission system
type Permission = {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
};
```

### Route Protection
```typescript
// Admin route protection
const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!user || user.role !== 'admin') {
    redirect('/auth/login');
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
};

// Permission-based component rendering
const ProtectedComponent = ({
  permission,
  children
}: {
  permission: string;
  children: React.ReactNode;
}) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return <UnauthorizedMessage />;
  }

  return <>{children}</>;
};
```

### Security Features
- **JWT Token Management**: Automatic refresh, secure storage
- **Route Guards**: Protect admin routes and sensitive pages
- **Permission Checks**: Component-level access control
- **CSRF Protection**: Built-in Next.js CSRF protection
- **Input Validation**: Zod schemas for all forms

## State Management Architecture

### Server State (TanStack Query)
```typescript
// Query keys organization
export const queryKeys = {
  admin: {
    users: {
      all: ['admin', 'users'] as const,
      list: (filters: UserFilters) => [...queryKeys.admin.users.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.users.all, 'detail', id] as const,
    },
    employees: {
      all: ['admin', 'employees'] as const,
      list: (filters: EmployeeFilters) => [...queryKeys.admin.employees.all, 'list', filters] as const,
      detail: (id: string) => [...queryKeys.admin.employees.all, 'detail', id] as const,
    },
    // ... other admin modules
  },
  public: {
    projects: {
      all: ['public', 'projects'] as const,
      featured: () => [...queryKeys.public.projects.all, 'featured'] as const,
      detail: (id: string) => [...queryKeys.public.projects.all, 'detail', id] as const,
    },
    // ... other public modules
  },
};

// Custom hooks for data fetching
export const useUsers = (filters: UserFilters) => {
  return useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: () => adminApi.users.getAll(filters),
    enabled: !!filters,
  });
};
```

### Client State (Zustand)
```typescript
// Auth store
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// UI store
interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Notification) => void;
}
```

## API Integration

### HTTP Client Configuration
```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshAuthToken();
      return apiClient.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### API Service Organization
```typescript
// lib/api/admin/users.ts
export const adminUsersApi = {
  getAll: (params: GetAllUsersParams) =>
    apiClient.get<PaginatedResponse<User>>('/admin/users', { params }),

  getById: (id: string) =>
    apiClient.get<User>(`/admin/users/${id}`),

  create: (data: CreateUserData) =>
    apiClient.post<User>('/admin/users', data),

  update: (id: string, data: UpdateUserData) =>
    apiClient.patch<User>(`/admin/users/${id}`, data),

  delete: (id: string) =>
    apiClient.delete(`/admin/users/${id}`),

  activate: (id: string) =>
    apiClient.patch(`/admin/users/${id}/activate`),

  deactivate: (id: string) =>
    apiClient.patch(`/admin/users/${id}/deactivate`),
};
```

## Component Patterns

### Admin Dashboard Components

#### Data Table Pattern
```typescript
// components/admin/shared/data-table.tsx
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  filters?: FilterState;
  onFiltersChange?: (filters: FilterState) => void;
}

export function DataTable<T>({
  data,
  columns,
  loading,
  pagination,
  onPaginationChange,
  filters,
  onFiltersChange
}: DataTableProps<T>) {
  // Implementation with sorting, filtering, pagination
}
```

#### Form Pattern
```typescript
// components/admin/shared/form-wrapper.tsx
interface FormWrapperProps<T> {
  schema: ZodSchema<T>;
  defaultValues?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  children: (form: UseFormReturn<T>) => React.ReactNode;
  loading?: boolean;
}

export function FormWrapper<T>({
  schema,
  defaultValues,
  onSubmit,
  children,
  loading
}: FormWrapperProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children(form)}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </form>
    </Form>
  );
}
```

#### Modal Pattern
```typescript
// components/admin/shared/modal-wrapper.tsx
interface ModalWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ModalWrapper({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md'
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('max-w-md', {
        'max-w-sm': size === 'sm',
        'max-w-lg': size === 'lg',
        'max-w-xl': size === 'xl',
      })}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
```

### Public Website Components

#### Section Pattern
```typescript
// components/public/shared/section-wrapper.tsx
interface SectionWrapperProps {
  id?: string;
  className?: string;
  background?: 'default' | 'muted' | 'accent';
  children: React.ReactNode;
}

export function SectionWrapper({
  id,
  className,
  background = 'default',
  children
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24',
        {
          'bg-background': background === 'default',
          'bg-muted/50': background === 'muted',
          'bg-primary/5': background === 'accent',
        },
        className
      )}
    >
      <div className="container mx-auto px-4">
        {children}
      </div>
    </section>
  );
}
```

#### Card Pattern
```typescript
// components/public/shared/content-card.tsx
interface ContentCardProps {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  tags?: string[];
  children?: React.ReactNode;
}

export function ContentCard({
  title,
  description,
  image,
  href,
  tags,
  children
}: ContentCardProps) {
  const CardWrapper = href ? Link : 'div';

  return (
    <CardWrapper
      href={href || '#'}
      className="group block h-full"
    >
      <Card className="h-full transition-all hover:shadow-lg">
        {image && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <CardContent className="p-6">
          <CardTitle className="mb-2">{title}</CardTitle>
          {description && (
            <CardDescription className="mb-4">
              {description}
            </CardDescription>
          )}
          {tags && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {children}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}
```

## Type Safety & Validation

### API Response Types
```typescript
// lib/types/api.ts
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
```

### Form Validation Schemas
```typescript
// lib/utils/validation.ts
import { z } from 'zod';

export const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['admin', 'operator', 'user', 'employee']),
  isActive: z.boolean().default(true),
});

export const employeeSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  position: z.string().min(2, 'Position is required'),
  department: z.string().min(2, 'Department is required'),
  startDate: z.date(),
  endDate: z.date().optional(),
  managerId: z.string().uuid().optional(),
  salary: z.object({
    amount: z.number().positive('Salary must be positive'),
    currency: z.string().default('USD'),
  }).optional(),
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  startDate: z.date(),
  endDate: z.date().optional(),
  projectManager: z.string().uuid('Invalid project manager ID'),
  technologies: z.array(z.string().uuid()).min(1, 'At least one technology is required'),
});
```

## Development Workflow

### Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
JWT_SECRET=your-jwt-secret

# Production
NEXT_PUBLIC_API_URL=https://api.sillalink.com/api/v1
NEXT_PUBLIC_SITE_URL=https://sillalink.com
```

### Scripts & Commands
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

### Code Quality Tools
```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "prettier": "^3.0.0",
    "prettier-plugin-tailwindcss": "^0.5.0",
    "husky": "^8.0.0",
    "lint-staged": "^15.0.0"
  }
}
```

## Implementation Plan

### Phase 1: Foundation Setup (Week 1-2)
1. **Project Initialization**
   - Set up Next.js 14 with TypeScript
   - Configure Tailwind CSS and Shadcn/ui
   - Set up ESLint, Prettier, and Husky
   - Create basic folder structure

2. **Authentication System**
   - Implement NextAuth.js configuration
   - Create login/register pages
   - Set up JWT token handling
   - Implement route protection middleware

3. **API Integration Layer**
   - Configure Axios client with interceptors
   - Create API service structure
   - Implement error handling
   - Set up TanStack Query

### Phase 2: Admin Dashboard Core (Week 3-4)
1. **Admin Layout & Navigation**
   - Create admin dashboard layout
   - Implement sidebar navigation
   - Add breadcrumb navigation
   - Create responsive design

2. **User Management Module**
   - User list with pagination and filtering
   - User creation and editing forms
   - Role management interface
   - Bulk actions (activate/deactivate)

3. **Shared Components**
   - Data table component
   - Form wrapper component
   - Modal component
   - Loading states and error boundaries

### Phase 3: Admin Dashboard Modules (Week 5-8)
1. **Employee Management** (Week 5)
   - Employee profiles and CRUD operations
   - Department management
   - Manager-employee relationships
   - Employee hierarchy visualization

2. **Project Management** (Week 6)
   - Project dashboard and overview
   - Project creation and editing
   - Task management interface
   - Team member assignment

3. **Technology & Service Management** (Week 7)
   - Technology catalog management
   - Proficiency level tracking
   - Service catalog and pricing
   - Feature management

4. **Health Monitoring** (Week 8)
   - System health dashboard
   - Real-time monitoring charts
   - Alert management
   - Performance metrics

### Phase 4: Public Website (Week 9-12)
1. **Homepage & Layout** (Week 9)
   - Hero section with animations
   - Featured projects showcase
   - Service highlights
   - Responsive navigation

2. **Portfolio & Services** (Week 10)
   - Project showcase with filtering
   - Project detail pages
   - Service catalog display
   - Service detail pages

3. **Team & Contact** (Week 11)
   - Team member profiles
   - Public employee information
   - Contact forms and information
   - Location and office details

4. **SEO & Performance** (Week 12)
   - Meta tags and structured data
   - Image optimization
   - Performance optimization
   - Accessibility improvements

### Phase 5: Testing & Deployment (Week 13-14)
1. **Testing Implementation**
   - Unit tests for components
   - Integration tests for API calls
   - E2E tests for critical flows
   - Performance testing

2. **Deployment Setup**
   - Vercel deployment configuration
   - Environment variable setup
   - CI/CD pipeline
   - Monitoring and analytics

## Performance Optimization

### Code Splitting & Lazy Loading
```typescript
// Dynamic imports for admin modules
const UserManagement = dynamic(() => import('@/components/admin/users'), {
  loading: () => <ModuleLoadingSkeleton />,
});

const ProjectManagement = dynamic(() => import('@/components/admin/projects'), {
  loading: () => <ModuleLoadingSkeleton />,
});
```

### Image Optimization
```typescript
// Next.js Image component with optimization
import Image from 'next/image';

export function OptimizedImage({ src, alt, ...props }) {
  return (
    <Image
      src={src}
      alt={alt}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
    />
  );
}
```

### Caching Strategy
```typescript
// TanStack Query cache configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Security Considerations

### Content Security Policy
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
    `.replace(/\s{2,}/g, ' ').trim()
  }
];
```

### Input Sanitization
```typescript
// Sanitize user inputs
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
```

## Monitoring & Analytics

### Error Tracking
```typescript
// Error boundary with logging
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);

    // Send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket, etc.
    }
  }
}
```

### Performance Monitoring
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log(metric);
  }
}
```

## Conclusion

This comprehensive frontend architecture provides:

1. **Modular Structure**: Mirrors the server's domain-driven design
2. **Type Safety**: Full TypeScript integration with Zod validation
3. **Modern Stack**: Next.js 14, React Query, Tailwind CSS
4. **Security**: Role-based access control and input validation
5. **Performance**: Optimized loading, caching, and code splitting
6. **Maintainability**: Consistent patterns and clear organization
7. **Scalability**: Easy to extend with new modules and features

The architecture ensures seamless integration with the NestJS server while providing an excellent developer experience and user interface for both admin and public users.
