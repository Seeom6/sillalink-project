# Authentication System Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Authentication Pages](#authentication-pages)
3. [API Integration](#api-integration)
4. [State Management](#state-management)
5. [Components & Hooks](#components--hooks)
6. [Validation Schemas](#validation-schemas)
7. [Session Management](#session-management)
8. [Role-Based Access](#role-based-access)
9. [Error Handling](#error-handling)
10. [Security Features](#security-features)

## System Overview

The authentication system is built using a modern stack with NextAuth.js for session management, React Query for server state, and Zod for validation. It provides a complete authentication flow including registration, login, OTP verification, password management, and role-based access control.

### Architecture Components

- **Frontend**: Next.js 15 with App Router, NextAuth.js, React Query, Zod validation
- **Backend**: NestJS with JWT tokens, Redis for OTP storage, MongoDB for user data
- **Security**: CSRF protection, rate limiting, OTP verification, secure password hashing

### Authentication Flow

```
Registration: Register → OTP Verification → Set Password → Auto Login
Login: Credentials → JWT Tokens → Role-based Redirect
Password Reset: Email → OTP → New Password → Login
```

## Authentication Pages

### 1. Login Page (`/auth/login`)
**Purpose**: User authentication with email/password credentials
**Features**:
- Email and password validation
- Admin login checkbox for role-based authentication
- Remember me functionality
- Forgot password link
- Loading states and error handling

### 2. Register Page (`/auth/register`)
**Purpose**: New user registration
**Features**:
- Multi-field form (firstName, lastName, email, phone)
- Real-time validation with Zod schemas
- OTP generation and email sending
- Data storage in sessionStorage for OTP flow

### 3. Verify OTP Page (`/auth/verify-otp`)
**Purpose**: Email verification during registration
**Features**:
- 6-digit OTP input with auto-focus
- Countdown timer for OTP expiration
- Resend OTP functionality
- Email display from sessionStorage

### 4. Set Password Page (`/auth/set-password`)
**Purpose**: Complete registration by setting password
**Features**:
- Password strength validation
- Confirm password matching
- Auto-login after successful password set
- Session cleanup

### 5. Forgot Password Page (`/auth/forgot-password`)
**Purpose**: Initiate password reset process
**Features**:
- Email validation and OTP sending
- Rate limiting protection
- Redirect to reset code verification

### 6. Reset Password Page (`/auth/reset-password`)
**Purpose**: Set new password after OTP verification
**Features**:
- New password validation
- Token-based authentication
- Secure password update

## API Integration

### Authentication Endpoints

```typescript
// Login
POST /api/v1/website/auth/log-in
Body: { email: string, password: string }
Response: { accessToken: string, refreshToken: string, user: User }

// Register
POST /api/v1/website/auth/register
Body: { firstName: string, lastName: string, email: string, phone?: string }
Response: { success: boolean, message: string }

// Verify OTP
POST /api/v1/website/auth/verify-registration-otp
Body: { email: string, otp: string }
Response: { success: boolean, message: string }

// Set Password
POST /api/v1/website/auth/set-password
Body: { email: string, password: string }
Response: { accessToken: string, refreshToken: string, user: User }
```

### API Client Configuration

```typescript
// lib/api/client.ts
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

## State Management

### React Query Hooks

The system uses React Query for server state management with custom hooks:

```typescript
// useLogin Hook
const { mutate, isPending, error } = useLogin();
mutate({ email, password, isAdmin });

// useRegister Hook
const { mutate, isPending } = useRegister();
mutate({ firstName, lastName, email, phone });
```

### SessionStorage Management

Temporary data storage during registration flow:

```typescript
// Registration data storage
sessionStorage.setItem('registrationEmail', email);
sessionStorage.setItem('registrationFirstName', firstName);
sessionStorage.setItem('registrationLastName', lastName);
sessionStorage.setItem('registration-data', JSON.stringify(data));
```

## Components & Hooks

### Custom Hooks

#### `useLogin`
- **Purpose**: Handle user login with NextAuth.js
- **Features**: Role-based redirection, error handling, success notifications
- **Usage**: Login form submission and authentication

#### `useRegister`
- **Purpose**: Handle user registration process
- **Features**: Data validation, OTP generation, sessionStorage management
- **Usage**: Registration form submission

### Reusable Components

#### `AuthFormContainer`
- **Purpose**: Consistent layout wrapper for auth forms
- **Features**: Responsive design, background animations, glass morphism

#### `AuthFormInput`
- **Purpose**: Standardized form input with validation
- **Features**: Error display, loading states, accessibility

#### `AuthTabs`
- **Purpose**: Navigation between auth pages
- **Features**: Active state management, smooth transitions

## Validation Schemas

### Zod Schemas

```typescript
// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  isAdmin: z.boolean().optional(),
});

// Registration Schema
export const registrationSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

// OTP Verification Schema
export const otpVerificationSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

// Set Password Schema
export const setPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
           'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## Session Management

### NextAuth.js Configuration

```typescript
// lib/auth/config.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'Admin Login', type: 'checkbox' },
      },
      async authorize(credentials) {
        // Custom authentication logic
        const response = await authApi.login({
          email: credentials.email,
          password: credentials.password,
          isAdmin: credentials.isAdmin === 'true'
        });

        return {
          id: response.data.user._id,
          email: response.data.user.email,
          name: `${response.data.user.firstName} ${response.data.user.lastName}`,
          role: response.data.user.role,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
};
```

### JWT Token Management

- **Access Token**: Short-lived (1 hour), used for API authentication
- **Refresh Token**: Long-lived (7 days), stored in HTTP-only cookies
- **Token Refresh**: Automatic refresh before expiration
- **Token Storage**: Secure storage in NextAuth.js session

### Session Persistence

```typescript
// Session data structure
interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN' | 'OPERATOR';
  };
  accessToken: string;
  refreshToken: string;
}
```

## Role-Based Access

### User Roles

1. **USER**: Regular users with basic access
2. **ADMIN**: Full administrative access
3. **OPERATOR**: Limited administrative access

### Authentication Flow by Role

#### Regular User Login
```
1. Login with email/password
2. Validate credentials
3. Generate JWT tokens
4. Redirect to /profile
```

#### Admin Login
```
1. Login with email/password + admin checkbox
2. Validate credentials + admin role
3. Generate JWT tokens with admin privileges
4. Redirect to /admin/dashboard
```

### Role-Based Redirection

```typescript
// useLogin hook redirection logic
onSuccess: (data, variables) => {
  toast.success('Login successful!');

  if (variables.isAdmin) {
    router.push('/admin/dashboard');
  } else {
    router.push('/profile');
  }
}
```

### Protected Routes

```typescript
// Middleware for route protection
export function middleware(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Check admin role
  }

  // Protect user routes
  if (pathname.startsWith('/profile')) {
    // Check authentication
  }
}
```

## Error Handling

### Error Types

1. **Validation Errors**: Form field validation failures
2. **Authentication Errors**: Invalid credentials, expired tokens
3. **Authorization Errors**: Insufficient permissions
4. **Network Errors**: API connection issues
5. **Server Errors**: Backend processing failures

### Error Display

```typescript
// Toast notifications for errors
import toast from 'react-hot-toast';

// Success message
toast.success('Login successful!');

// Error message
toast.error('Invalid credentials. Please try again.');

// Loading state
toast.loading('Verifying credentials...');
```

### Error Handling in Hooks

```typescript
// useLogin error handling
const { mutate, isPending, error } = useMutation({
  mutationFn: authApi.login,
  onError: (error: Error) => {
    toast.error(error.message || 'Login failed. Please try again.');
  },
  onSuccess: () => {
    toast.success('Login successful!');
  }
});
```

### Form Validation Errors

```typescript
// React Hook Form with Zod validation
const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema)
});

// Error display in form
{errors.email && (
  <span className="text-red-500 text-sm">{errors.email.message}</span>
)}
```

## Security Features

### 1. OTP Verification
- **6-digit numeric codes** generated server-side
- **5-minute expiration** with Redis storage
- **Rate limiting** to prevent brute force attacks
- **Email delivery** with HTML templates

### 2. Password Security
- **Minimum 8 characters** with complexity requirements
- **Bcrypt hashing** with salt rounds
- **Password strength validation** on frontend
- **Secure password reset** with time-limited tokens

### 3. CSRF Protection
- **CSRF tokens** for state-changing operations
- **SameSite cookies** for additional protection
- **Origin validation** for API requests

### 4. Rate Limiting
```typescript
// Login endpoint rate limiting
@RateLimit({ windowMs: 900000, maxRequests: 5 }) // 5 attempts per 15 minutes
async logIn(@Body() logInInfo: LogInDto) {
  // Login logic
}
```

### 5. Session Security
- **HTTP-only cookies** for refresh tokens
- **Secure flag** in production
- **Session timeout** after inactivity
- **Token rotation** on refresh

### 6. Input Validation
- **Server-side validation** with Zod schemas
- **Client-side validation** for UX
- **SQL injection prevention** with parameterized queries
- **XSS protection** with input sanitization

### 7. API Security
- **HTTPS enforcement** in production
- **CORS configuration** for allowed origins
- **Request timeout** to prevent hanging requests
- **Error message sanitization** to prevent information leakage

## Development Guidelines

### Testing Authentication

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/v1/website/auth/log-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test registration endpoint
curl -X POST http://localhost:5000/api/v1/website/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com"}'
```

### Environment Variables

```bash
# Required environment variables
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Common Issues & Solutions

1. **Session not persisting**: Check NEXTAUTH_SECRET and URL configuration
2. **CORS errors**: Verify API client baseURL and backend CORS settings
3. **Token expiration**: Implement proper refresh token logic
4. **Role-based access**: Ensure proper role validation in middleware

### File Structure

```
client/lib/auth/
├── config.ts              # NextAuth.js configuration
├── AUTH_SYSTEM.md         # This documentation
├── types.ts               # TypeScript interfaces
└── utils.ts               # Auth utility functions

client/app/auth/
├── login/page.tsx         # Login page
├── register/page.tsx      # Registration page
├── verify-otp/page.tsx    # OTP verification
├── set-password/page.tsx  # Password setting
├── forgot-password/page.tsx # Password reset initiation
└── reset-password/page.tsx  # Password reset completion

client/lib/hooks/auth/
├── useLogin.ts            # Login hook
├── useRegister.ts         # Registration hook
└── useAuth.ts             # General auth utilities

client/components/auth/
├── AuthFormContainer.tsx  # Form wrapper component
├── AuthFormInput.tsx      # Input component
└── AuthTabs.tsx           # Navigation tabs
```

This authentication system provides a robust, secure, and user-friendly experience with comprehensive error handling, role-based access control, and modern security practices.
