export interface LoginPayload {
  email: string;
  password: string;
}

export interface EmailConfirmResponse {
  token : string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
}

export interface RegisterPayload {
  firstName : string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Otp {
  otp : string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  email?: string;
}

// New 3-step registration types
export interface InitiateRegistrationPayload {
  firstName: string;
  lastName: string;
  email: string;
}

export interface VerifyRegistrationOtpPayload {
  email: string;
  otp: string;
}

export interface CompleteRegistrationPayload {
  email: string;
  password: string;
}

export interface RegistrationResponse {
  token?: string;
  message?: string;
}