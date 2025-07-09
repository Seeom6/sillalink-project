import { PositionEnum } from "@Modules/employee/databases/position.enum";
import { CreateUserDto } from "@Modules/user/api/dto/request/create-user.dto";
import { UserRole } from "@Modules/user/types/role.enum";

export class CreateEmployee extends CreateUserDto {
    position: PositionEnum;
    image?: string;
    // Additional employee details
    department?: string;
    hireDate?: string;
    phone?: string;
    employmentStatus?: 'full-time' | 'part-time' | 'contractor' | 'intern';
    role?: UserRole;
    managerId?: string;
    projectIds?: string[];
    // Employee profile information
    emergencyContact?: {
        name: string;
        phone: string;
        relationship: string;
    };
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    salary?: {
        amount: number;
        currency: string;
        frequency: 'hourly' | 'monthly' | 'yearly';
    };
}