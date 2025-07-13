export class RegisterDto {
   firstName: string;
   lastName: string;
   email: string;
   phone?: string;
}

export class VerifyRegistrationOtpDto {
   email: string;
   otp: string;
}

export class CompleteRegistrationDto {
   email: string;
   password: string;
}
