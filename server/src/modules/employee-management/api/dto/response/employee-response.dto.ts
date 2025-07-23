import { EmployeeDepartment, EmployeeStatus, EmploymentType } from '../../../database/schemas/employee.schema';

export class EmployeeTechnologyResponseDto {
  technologyId: string;
  proficiencyLevel: number;
  assignedAt: Date;
  lastUpdated: Date;
  notes?: string;
}

export class EmployeeResponseDto {
  _id: string;
  userId?: string;
  
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  
  // Professional Information
  employeeId: string;
  position: string;
  department: EmployeeDepartment;
  employmentType: EmploymentType;
  salary?: number;
  hireDate: Date;
  terminationDate?: Date;
  
  // Contact & Location
  address?: string;
  city?: string;
  country?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  
  // Media & Assets
  profileImage?: string;
  avatar?: string;
  
  // Manager & Reporting
  managerId?: string;
  directReports: string[];
  
  // Status & Lifecycle
  status: EmployeeStatus;
  isDeleted: boolean;
  deletedAt?: Date;
  
  // Technology Relationships
  technologies: EmployeeTechnologyResponseDto[];
  
  // Additional Information
  bio?: string;
  skills: string[];
  certifications: string[];
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  notes?: string;
  isFeatured: boolean;
  performanceRating: number;
  lastPerformanceReview?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export class EmployeeListResponseDto {
  employees: EmployeeResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class EmployeeStatsResponseDto {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
  featured: number;
  avgTenure: number;
  byDepartment: { _id: string; count: number; active: number }[];
}
