export enum EmployeeDepartment {
  ENGINEERING = 'engineering',
  DESIGN = 'design',
  MARKETING = 'marketing',
  HR = 'hr',
  FINANCE = 'finance',
  OPERATIONS = 'operations',
  SALES = 'sales',
  PRODUCT = 'product',
  QUALITY_ASSURANCE = 'quality_assurance',
  CUSTOMER_SUPPORT = 'customer_support',
  LEGAL = 'legal',
  OTHER = 'other'
}

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  TERMINATED = 'terminated',
  ON_LEAVE = 'on_leave',
  PROBATION = 'probation',
  NOTICE_PERIOD = 'notice_period'
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  FREELANCE = 'freelance',
  CONSULTANT = 'consultant'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed'
}

export enum ContractType {
  PERMANENT = 'permanent',
  FIXED_TERM = 'fixed_term',
  PROBATION = 'probation',
  INTERNSHIP = 'internship'
}

export enum DisciplinarySeverity {
  WARNING = 'warning',
  SUSPENSION = 'suspension',
  TERMINATION = 'termination'
}

export interface EmployeeTechnology {
  technologyId: string;
  proficiencyLevel: number;
  assignedAt: string;
  lastUpdated: string;
  notes?: string;
  // Populated fields
  technology?: {
    _id: string;
    name: string;
    category: string;
    icon?: string;
  };
}

// New comprehensive data structures
export interface Address {
  country: string;
  city: string;
  street: string;
  postalCode?: string;
}

export interface Salary {
  amount: number;
  currency: string;
}

export interface Bonus {
  _id?: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Deduction {
  _id?: string;
  amount: number;
  type: string;
  date: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PerformanceReview {
  _id?: string;
  date: string;
  evaluatorId: string;
  rating: number;
  notes?: string;
  goals: string[];
  achievements: string[];
  feedback?: string;
  improvementAreas?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Achievement {
  _id?: string;
  title: string;
  description: string;
  date: string;
  category: string;
  recognizedBy?: string;
  impact?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EmployeeProject {
  _id?: string;
  projectId?: string;
  projectName: string;
  projectTechnologies: string[];
  role: string;
  startDate: string;
  endDate?: string;
  description?: string;
  responsibilities: string[];
  outcomes?: string;
  clientName?: string;
  contributionPercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Training {
  _id?: string;
  title: string;
  provider: string;
  completionDate: string;
  certificateUrl?: string;
  expiryDate?: string;
  skillsGained: string[];
  durationHours?: number;
  certificateNumber?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendanceSummary {
  totalWorkingDays: number;
  totalDaysPresent: number;
  totalDaysAbsent: number;
  totalLateDays: number;
  totalOvertimeHours: number;
  lastUpdated: string;
}

export interface DisciplinaryAction {
  _id?: string;
  date: string;
  reason: string;
  actionTaken: string;
  severity: DisciplinarySeverity;
  resolvedDate?: string;
  issuedBy: string;
  employeeResponse?: string;
  isResolved: boolean;
  followUpActions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  _id: string;
  id?: string; // MongoDB sometimes returns id instead of _id
  userId?: string;

  // Basic Information
  firstName: string;
  lastName: string;
  fullName?: string;
  gender?: Gender;
  birthDate?: string;
  dateOfBirth?: string; // Keep for backward compatibility
  nationalId?: string;
  passportNumber?: string;
  maritalStatus?: MaritalStatus;
  email: string;
  phone?: string;
  
  // Contact Information
  address?: Address;

  // Professional Information
  employeeId: string;
  position: string;
  jobTitle?: string;
  technologies: string[];
  department: EmployeeDepartment;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  startDate?: string;
  hireDate: string; // Keep for backward compatibility
  endDate?: string;
  terminationDate?: string; // Keep for backward compatibility
  managerId?: string;

  // Salary and Contract
  salaryDetails?: Salary;
  salary?: number; // Keep for backward compatibility
  contractType?: ContractType;
  contractStartDate?: string;
  contractEndDate?: string;
  bonuses: Bonus[];
  deductions: Deduction[];

  // Performance and Reviews
  performanceReviews: PerformanceReview[];
  achievements: Achievement[];

  // Projects
  projects: EmployeeProject[];

  // Training and Certifications
  trainings: Training[];

  // Attendance and Discipline
  attendanceSummary?: AttendanceSummary;
  disciplinaryActions: DisciplinaryAction[];

  // Contact & Location (Legacy)
  city?: string;
  country?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  // Media & Assets
  profileImage?: string;
  avatar?: string;

  // Manager & Reporting
  directReports: string[];

  // Status & Lifecycle
  isDeleted: boolean;
  deletedAt?: string;

  // Technology Relationships
  technologySkills: EmployeeTechnology[]; // Legacy format with detailed info
  
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
  lastPerformanceReview?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;

  // Populated fields
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  manager?: {
    _id: string;
    firstName: string;
    lastName: string;
    position: string;
  };
}

export interface CreateEmployeeData {
  userId?: string;

  // Basic Information
  firstName: string;
  lastName: string;
  gender?: Gender;
  birthDate?: string;
  dateOfBirth?: string; // Keep for backward compatibility
  nationalId?: string;
  passportNumber?: string;
  maritalStatus?: MaritalStatus;
  email: string;
  phone?: string;

  // Contact Information
  address?: Address;

  // Professional Information
  position: string;
  jobTitle?: string;
  technologies?: string[];
  department: EmployeeDepartment;
  employmentType?: EmploymentType;
  status?: EmployeeStatus;
  startDate?: string;
  hireDate?: string; // Keep for backward compatibility
  endDate?: string;
  terminationDate?: string; // Keep for backward compatibility
  managerId?: string;

  // Salary and Contract
  salaryDetails?: Salary;
  salary?: number; // Keep for backward compatibility
  contractType?: ContractType;
  contractStartDate?: string;
  contractEndDate?: string;

  // Legacy Contact & Location fields
  city?: string;
  country?: string;
  emergencyContact?: string;
  emergencyPhone?: string;

  // Media & Assets
  profileImage?: string;
  avatar?: string;

  // Additional Information
  bio?: string;
  skills?: string[];
  certifications?: string[];
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioUrl?: string;
  notes?: string;
  isFeatured?: boolean;
  performanceRating?: number;
}

export interface UpdateEmployeeData extends Partial<CreateEmployeeData> {}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  department?: EmployeeDepartment | undefined;
  status?: EmployeeStatus | undefined;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  managerId?: string | undefined;
  isFeatured?: boolean | undefined;
}

export interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  terminated: number;
  featured: number;
  avgTenure: number;
  byDepartment: { [key: string]: number };
}

export type EmployeeSortField = 'firstName' | 'lastName' | 'email' | 'position' | 'department' | 'hireDate' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface DepartmentOption {
  value: EmployeeDepartment;
  label: string;
}

export interface StatusOption {
  value: EmployeeStatus;
  label: string;
}

export interface EmploymentTypeOption {
  value: EmploymentType;
  label: string;
}

// Department options for UI
export const DEPARTMENT_OPTIONS: DepartmentOption[] = [
  { value: EmployeeDepartment.ENGINEERING, label: 'Engineering' },
  { value: EmployeeDepartment.DESIGN, label: 'Design' },
  { value: EmployeeDepartment.MARKETING, label: 'Marketing' },
  { value: EmployeeDepartment.HR, label: 'Human Resources' },
  { value: EmployeeDepartment.FINANCE, label: 'Finance' },
  { value: EmployeeDepartment.OPERATIONS, label: 'Operations' },
  { value: EmployeeDepartment.SALES, label: 'Sales' },
  { value: EmployeeDepartment.PRODUCT, label: 'Product' },
  { value: EmployeeDepartment.QUALITY_ASSURANCE, label: 'Quality Assurance' },
  { value: EmployeeDepartment.CUSTOMER_SUPPORT, label: 'Customer Support' },
  { value: EmployeeDepartment.LEGAL, label: 'Legal' },
  { value: EmployeeDepartment.OTHER, label: 'Other' }
];

// Status options for UI
export const STATUS_OPTIONS: StatusOption[] = [
  { value: EmployeeStatus.ACTIVE, label: 'Active' },
  { value: EmployeeStatus.INACTIVE, label: 'Inactive' },
  { value: EmployeeStatus.TERMINATED, label: 'Terminated' },
  { value: EmployeeStatus.ON_LEAVE, label: 'On Leave' },
  { value: EmployeeStatus.PROBATION, label: 'Probation' },
  { value: EmployeeStatus.NOTICE_PERIOD, label: 'Notice Period' }
];

// Employment type options for UI
export const EMPLOYMENT_TYPE_OPTIONS: EmploymentTypeOption[] = [
  { value: EmploymentType.FULL_TIME, label: 'Full Time' },
  { value: EmploymentType.PART_TIME, label: 'Part Time' },
  { value: EmploymentType.CONTRACT, label: 'Contract' },
  { value: EmploymentType.INTERN, label: 'Intern' },
  { value: EmploymentType.FREELANCE, label: 'Freelance' },
  { value: EmploymentType.CONSULTANT, label: 'Consultant' }
];

// Gender options for UI
export const GENDER_OPTIONS = [
  { value: Gender.MALE, label: 'Male' },
  { value: Gender.FEMALE, label: 'Female' },
  { value: Gender.OTHER, label: 'Other' },
  { value: Gender.PREFER_NOT_TO_SAY, label: 'Prefer not to say' }
];

// Marital status options for UI
export const MARITAL_STATUS_OPTIONS = [
  { value: MaritalStatus.SINGLE, label: 'Single' },
  { value: MaritalStatus.MARRIED, label: 'Married' },
  { value: MaritalStatus.DIVORCED, label: 'Divorced' },
  { value: MaritalStatus.WIDOWED, label: 'Widowed' }
];

// Contract type options for UI
export const CONTRACT_TYPE_OPTIONS = [
  { value: ContractType.PERMANENT, label: 'Permanent' },
  { value: ContractType.FIXED_TERM, label: 'Fixed Term' },
  { value: ContractType.PROBATION, label: 'Probation' },
  { value: ContractType.INTERNSHIP, label: 'Internship' }
];

// Disciplinary severity options for UI
export const DISCIPLINARY_SEVERITY_OPTIONS = [
  { value: DisciplinarySeverity.WARNING, label: 'Warning' },
  { value: DisciplinarySeverity.SUSPENSION, label: 'Suspension' },
  { value: DisciplinarySeverity.TERMINATION, label: 'Termination' }
];
