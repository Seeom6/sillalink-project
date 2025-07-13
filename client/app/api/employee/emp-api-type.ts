export interface createEmpPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    position: string;
    image?: string;
    // Additional employee details
    department?: string;
    hireDate?: string;
    phone?: string;
    employmentStatus?: 'full-time' | 'part-time' | 'contractor' | 'intern';
    role?: 'user' | 'admin' | 'operator' | 'employee';
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

export interface updateEmpPayload {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string; // Optional for updates
    position?: string;
    image?: string;
    // Additional employee details
    department?: string;
    hireDate?: string;
    phone?: string;
    employmentStatus?: 'full-time' | 'part-time' | 'contractor' | 'intern';
    role?: 'user' | 'admin' | 'operator' | 'employee';
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