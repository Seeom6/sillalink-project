import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number');

export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: emailSchema,
  firstName: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  role: z.enum(['admin', 'operator', 'employee', 'user']),
  avatar: urlSchema,
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createUserSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateUserSchema = userSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Auth validation schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  email: emailSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only numbers'),
});

// Project validation schemas
export const projectSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  status: z.enum(['active', 'inactive', 'pending', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  budget: z.number().positive('Budget must be positive').optional(),
  clientName: z.string().min(1, 'Client name is required').max(100, 'Client name is too long'),
  technologies: z.array(z.string()).min(1, 'At least one technology is required'),
  teamMembers: z.array(z.string().uuid()).optional(),
  isPublic: z.boolean(),
  isFeatured: z.boolean(),
  sortOrder: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = projectSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Service validation schemas
export const serviceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  shortDescription: z.string().max(200, 'Short description is too long').optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive').optional(),
  currency: z.string().length(3, 'Currency must be 3 characters').optional(),
  duration: z.string().optional(),
  features: z.array(z.string()).optional(),
  icon: z.string().optional(),
  image: urlSchema,
  status: z.enum(['active', 'inactive', 'draft']),
  isFeatured: z.boolean(),
  sortOrder: z.number().int().min(0),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createServiceSchema = serviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateServiceSchema = serviceSchema.partial().omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  company: z.string().max(100, 'Company name is too long').optional(),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message is too long'),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: 'You must accept the privacy policy',
  }),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, {
    message: 'File size must be less than 5MB',
  }),
  type: z.enum(['image', 'document', 'video']),
});

export const imageUploadSchema = fileUploadSchema.extend({
  file: z.instanceof(File).refine((file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(file.type);
  }, {
    message: 'Only JPEG, PNG, WebP, and GIF images are allowed',
  }),
});

// Pagination and filtering schemas
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

export const sortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

export const filterSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// Type inference helpers
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type OTP = z.infer<typeof otpSchema>;
export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type CreateService = z.infer<typeof createServiceSchema>;
export type UpdateService = z.infer<typeof updateServiceSchema>;
export type Contact = z.infer<typeof contactSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type ImageUpload = z.infer<typeof imageUploadSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type Sort = z.infer<typeof sortSchema>;
export type Filter = z.infer<typeof filterSchema>;

// Validation helper functions
export const validateSchema = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};

export const getFieldErrors = (error: z.ZodError): Record<string, string> => {
  const fieldErrors: Record<string, string> = {};
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!fieldErrors[path]) {
      fieldErrors[path] = err.message;
    }
  });
  return fieldErrors;
};
