import { UserRole } from '../../../../user-management/interfaces/user-role.enum';

export interface EmergencyContactDto {
    name: string;
    phone: string;
    relationship: string;
}

export interface AddressDto {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface SalaryDto {
    amount: number;
    currency: string;
    frequency: 'hourly' | 'monthly' | 'yearly';
}

export class CreateEmployeeDto {
    // User fields
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;

    // Employee fields
    position: string;
    image?: string;
    department?: string;
    hireDate?: string;
    employmentStatus?: 'full-time' | 'part-time' | 'contractor' | 'intern';
    managerId?: string;
    projectIds?: string[];
    emergencyContact?: EmergencyContactDto;
    address?: AddressDto;
    salary?: SalaryDto;
}
