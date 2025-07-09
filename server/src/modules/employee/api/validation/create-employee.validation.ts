import { BaseValidationPipe } from "src/package/api";
import { z } from "zod";

const emergencyContactSchema = z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
}).optional();

const addressSchema = z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string()
}).optional();

const salarySchema = z.object({
    amount: z.number(),
    currency: z.string(),
    frequency: z.enum(['hourly', 'monthly', 'yearly'])
}).optional();

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    position: z.string().min(1, "Position is required"),
    image: z.string().optional(),
    // Additional fields
    department: z.string().optional(),
    hireDate: z.string().optional(),
    phone: z.string().optional(),
    employmentStatus: z.enum(['full-time', 'part-time', 'contractor', 'intern']).optional(),
    role: z.enum(['user', 'admin', 'operator', 'employee']).optional(),
    managerId: z.string().optional(),
    projectIds: z.array(z.string()).optional(),
    emergencyContact: emergencyContactSchema,
    address: addressSchema,
    salary: salarySchema
})

export class CreateEmployeeValidation extends BaseValidationPipe {
    constructor(){
        super(schema)
    }
}