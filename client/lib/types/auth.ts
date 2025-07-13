export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
  USER = 'user',
  EMPLOYEE = 'employee',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CompleteRegistrationData {
  email: string;
  password: string;
}

export interface OtpVerificationData {
  email: string;
  otp: string;
}

export interface SetPasswordData {
  password: string;
}

export interface ResetCodeData {
  email: string;
  code: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    message: string;
    email?: string;
  };
}

export interface OtpResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
  };
}

export interface ResetTokenResponse {
  success: boolean;
  message: string;
  data?: {
    resetToken: string;
  };
}

export interface BasicResponse {
  success: boolean;
  message: string;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Permission[];
}
