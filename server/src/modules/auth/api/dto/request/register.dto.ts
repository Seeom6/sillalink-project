export class RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
}

export class VerifyRegistrationOtpDto {
  email: string;
  otp: string;
}

export class CompleteRegistrationDto {
  email: string;
  password: string;
  confirmPassword: string;
}
