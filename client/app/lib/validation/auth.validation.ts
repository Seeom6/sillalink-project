import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is requried")
});

export const registerSchema = z.object({
  firstName : z.string().min(2 , "firstName must be at least 2 characters"),
  lastName : z.string().min(2 , "lastName must be at least 2 characters"),
  email : z.string().email("invalid email address"),
  password : z.string().min(8 , "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data)=>data.password === data.confirmPassword , {
  message : "Passwords don't match",
  path: ["confirmPassword"]
})

export const forgetPasswordSchema = z.object({
  email : z.string().email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8 , "Password must be at least 8 characters"),
  confirmPassword : z.string()
}).refine((data) => data.password === data.confirmPassword ,{
  message : "Passwords don't match",
  path: ["confirmPassword"]
})

export const ConfirmOtp = z.object({
  otp : z.string().length(6 , "OTP must be 6 digit numbers")
})