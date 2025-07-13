import { UserRole } from '../../../../user-management/interfaces/user-role.enum';
import { EmergencyContactDto, AddressDto, SalaryDto } from './create-employee.dto';

export class UpdateEmployeeDto {
    // User fields (optional for updates)
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role?: UserRole;

    // Employee fields (optional for updates)
    position?: string;
    image?: string;
    department?: string;
    employmentStatus?: 'full-time' | 'part-time' | 'contractor' | 'intern';
    managerId?: string;
    projectIds?: string[];
    emergencyContact?: EmergencyContactDto;
    address?: AddressDto;
    salary?: SalaryDto;
}
