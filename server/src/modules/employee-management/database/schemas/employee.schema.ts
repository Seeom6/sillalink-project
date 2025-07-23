import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmployeeDocument = Employee & Document;

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

@Schema({ timestamps: true })
export class EmployeeTechnology {
  @Prop({ type: Types.ObjectId, ref: 'Technology', required: true })
  technologyId: Types.ObjectId;

  @Prop({ type: Number, min: 0, max: 100, default: 0 })
  proficiencyLevel: number;

  @Prop({ type: Date, default: Date.now })
  assignedAt: Date;

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;

  @Prop({ type: String })
  notes?: string;
}

export const EmployeeTechnologySchema = SchemaFactory.createForClass(EmployeeTechnology);

// Address Schema
@Schema({ _id: false })
export class Address {
  @Prop({ type: String, required: true, trim: true })
  country: string;

  @Prop({ type: String, required: true, trim: true })
  city: string;

  @Prop({ type: String, required: true, trim: true })
  street: string;

  @Prop({ type: String, trim: true })
  postalCode?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Salary Schema
@Schema({ _id: false })
export class Salary {
  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, required: true, default: 'USD' })
  currency: string;
}

export const SalarySchema = SchemaFactory.createForClass(Salary);

// Bonus Schema
@Schema({ timestamps: true })
export class Bonus {
  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, required: true, trim: true })
  type: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, trim: true })
  description?: string;
}

export const BonusSchema = SchemaFactory.createForClass(Bonus);

// Deduction Schema
@Schema({ timestamps: true })
export class Deduction {
  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, required: true, trim: true })
  type: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, trim: true })
  description?: string;
}

export const DeductionSchema = SchemaFactory.createForClass(Deduction);

// Performance Review Schema
@Schema({ timestamps: true })
export class PerformanceReview {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  evaluatorId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, trim: true })
  notes?: string;

  @Prop({ type: [String], default: [] })
  goals: string[];

  @Prop({ type: [String], default: [] })
  achievements: string[];

  @Prop({ type: String, trim: true })
  feedback?: string;

  @Prop({ type: String, trim: true })
  improvementAreas?: string;
}

export const PerformanceReviewSchema = SchemaFactory.createForClass(PerformanceReview);

// Achievement Schema
@Schema({ timestamps: true })
export class Achievement {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true, trim: true })
  description: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true, trim: true })
  category: string;

  @Prop({ type: String, trim: true })
  recognizedBy?: string;

  @Prop({ type: String, trim: true })
  impact?: string;
}

export const AchievementSchema = SchemaFactory.createForClass(Achievement);

// Project Schema
@Schema({ timestamps: true })
export class EmployeeProject {
  @Prop({ type: Types.ObjectId, ref: 'Project' })
  projectId?: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  projectName: string;

  @Prop({ type: [Types.ObjectId], ref: 'Technology', default: [] })
  projectTechnologies: Types.ObjectId[];

  @Prop({ type: String, required: true, trim: true })
  role: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: [String], default: [] })
  responsibilities: string[];

  @Prop({ type: String, trim: true })
  outcomes?: string;

  @Prop({ type: String, trim: true })
  clientName?: string;

  @Prop({ type: Number, min: 0, max: 100 })
  contributionPercentage?: number;
}

export const EmployeeProjectSchema = SchemaFactory.createForClass(EmployeeProject);

// Training Schema
@Schema({ timestamps: true })
export class Training {
  @Prop({ type: String, required: true, trim: true })
  title: string;

  @Prop({ type: String, required: true, trim: true })
  provider: string;

  @Prop({ type: Date, required: true })
  completionDate: Date;

  @Prop({ type: String, trim: true })
  certificateUrl?: string;

  @Prop({ type: Date })
  expiryDate?: Date;

  @Prop({ type: [String], default: [] })
  skillsGained: string[];

  @Prop({ type: Number, min: 0 })
  durationHours?: number;

  @Prop({ type: String, trim: true })
  certificateNumber?: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;
}

export const TrainingSchema = SchemaFactory.createForClass(Training);

// Attendance Summary Schema
@Schema({ _id: false })
export class AttendanceSummary {
  @Prop({ type: Number, default: 0, min: 0 })
  totalWorkingDays: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalDaysPresent: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalDaysAbsent: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalLateDays: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalOvertimeHours: number;

  @Prop({ type: Date, default: Date.now })
  lastUpdated: Date;
}

export const AttendanceSummarySchema = SchemaFactory.createForClass(AttendanceSummary);

// Disciplinary Action Schema
@Schema({ timestamps: true })
export class DisciplinaryAction {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true, trim: true })
  reason: string;

  @Prop({ type: String, required: true, trim: true })
  actionTaken: string;

  @Prop({
    type: String,
    enum: DisciplinarySeverity,
    required: true
  })
  severity: DisciplinarySeverity;

  @Prop({ type: Date })
  resolvedDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  issuedBy: Types.ObjectId;

  @Prop({ type: String, trim: true })
  employeeResponse?: string;

  @Prop({ type: Boolean, default: false })
  isResolved: boolean;

  @Prop({ type: String, trim: true })
  followUpActions?: string;
}

export const DisciplinaryActionSchema = SchemaFactory.createForClass(DisciplinaryAction);

@Schema({ timestamps: true })
export class Employee {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: Types.ObjectId;

  // Basic Information
  @Prop({ type: String, required: true, trim: true })
  firstName: string;

  @Prop({ type: String, required: true, trim: true })
  lastName: string;

  @Prop({
    type: String,
    trim: true,
    get: function() {
      return `${this.firstName} ${this.lastName}`;
    }
  })
  fullName?: string;

  @Prop({
    type: String,
    enum: Gender
  })
  gender?: Gender;

  @Prop({ type: Date })
  birthDate?: Date;

  @Prop({ type: Date })
  dateOfBirth?: Date; // Keep for backward compatibility

  @Prop({ type: String, trim: true })
  nationalId?: string;

  @Prop({ type: String, trim: true })
  passportNumber?: string;

  @Prop({
    type: String,
    enum: MaritalStatus
  })
  maritalStatus?: MaritalStatus;

  @Prop({ type: String, required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: String, trim: true })
  phone?: string;

  // Contact Information
  @Prop({ type: AddressSchema })
  address?: Address;

  // Professional Information
  @Prop({ type: String, required: true, unique: true, trim: true })
  employeeId: string;

  @Prop({ type: String, required: true, trim: true })
  position: string;

  @Prop({ type: String, trim: true })
  jobTitle?: string; // Alternative to position

  @Prop({ type: [Types.ObjectId], ref: 'Technology', default: [] })
  technologies: Types.ObjectId[];

  @Prop({
    type: String,
    enum: EmployeeDepartment,
    required: true,
    default: EmployeeDepartment.OTHER
  })
  department: EmployeeDepartment;

  @Prop({
    type: String,
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME
  })
  employmentType: EmploymentType;

  @Prop({
    type: String,
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE
  })
  status: EmployeeStatus;

  @Prop({ type: Date, required: true, default: Date.now })
  startDate: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  hireDate: Date; // Keep for backward compatibility

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Date })
  terminationDate?: Date; // Keep for backward compatibility

  @Prop({ type: Types.ObjectId, ref: 'Employee' })
  managerId?: Types.ObjectId;

  // Salary and Contract
  @Prop({ type: SalarySchema })
  salaryDetails?: Salary;

  @Prop({ type: Number, min: 0 })
  salary?: number; // Keep for backward compatibility

  @Prop({
    type: String,
    enum: ContractType,
    default: ContractType.PERMANENT
  })
  contractType: ContractType;

  @Prop({ type: Date })
  contractStartDate?: Date;

  @Prop({ type: Date })
  contractEndDate?: Date;

  @Prop({ type: [BonusSchema], default: [] })
  bonuses: Bonus[];

  @Prop({ type: [DeductionSchema], default: [] })
  deductions: Deduction[];

  // Contact & Location (Legacy fields)
  @Prop({ type: String, trim: true })
  city?: string;

  @Prop({ type: String, trim: true })
  country?: string;

  @Prop({ type: String, trim: true })
  emergencyContact?: string;

  @Prop({ type: String, trim: true })
  emergencyPhone?: string;

  // Media & Assets
  @Prop({ type: String, default: '' })
  profileImage?: string;

  @Prop({ type: String, default: '' })
  avatar?: string;

  // Performance and Reviews
  @Prop({ type: [PerformanceReviewSchema], default: [] })
  performanceReviews: PerformanceReview[];

  @Prop({ type: [AchievementSchema], default: [] })
  achievements: Achievement[];

  @Prop({ type: Number, default: 0 })
  performanceRating: number; // Keep for backward compatibility

  @Prop({ type: Date })
  lastPerformanceReview?: Date; // Keep for backward compatibility

  // Projects
  @Prop({ type: [EmployeeProjectSchema], default: [] })
  projects: EmployeeProject[];

  // Training and Certifications
  @Prop({ type: [TrainingSchema], default: [] })
  trainings: Training[];

  // Attendance and Discipline
  @Prop({ type: AttendanceSummarySchema })
  attendanceSummary?: AttendanceSummary;

  @Prop({ type: [DisciplinaryActionSchema], default: [] })
  disciplinaryActions: DisciplinaryAction[];

  // Manager & Reporting
  @Prop({ type: [Types.ObjectId], ref: 'Employee', default: [] })
  directReports: Types.ObjectId[];

  // Status & Lifecycle
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;

  // Technology Relationships (Legacy)
  @Prop({ type: [EmployeeTechnologySchema], default: [] })
  technologySkills: EmployeeTechnology[];

  // Additional Information
  @Prop({ type: String })
  bio?: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  certifications: string[];

  @Prop({ type: String })
  linkedinProfile?: string;

  @Prop({ type: String })
  githubProfile?: string;

  @Prop({ type: String })
  portfolioUrl?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

// Indexes for better search performance
EmployeeSchema.index({
  firstName: 'text',
  lastName: 'text',
  fullName: 'text',
  email: 'text',
  position: 'text',
  jobTitle: 'text',
  skills: 'text',
  'projects.projectName': 'text',
  'trainings.title': 'text'
});

// Core indexes
EmployeeSchema.index({ employeeId: 1 }, { unique: true });
EmployeeSchema.index({ email: 1 }, { unique: true });
EmployeeSchema.index({ nationalId: 1 }, { unique: true, sparse: true });
EmployeeSchema.index({ passportNumber: 1 }, { unique: true, sparse: true });

// Relationship indexes
EmployeeSchema.index({ userId: 1 });
EmployeeSchema.index({ managerId: 1 });
EmployeeSchema.index({ technologies: 1 });

// Query optimization indexes
EmployeeSchema.index({ department: 1, status: 1 });
EmployeeSchema.index({ employmentType: 1, status: 1 });
EmployeeSchema.index({ contractType: 1, status: 1 });
EmployeeSchema.index({ isFeatured: 1, isDeleted: 1 });
EmployeeSchema.index({ hireDate: 1, status: 1 });
EmployeeSchema.index({ startDate: 1, endDate: 1 });
EmployeeSchema.index({ birthDate: 1 });
EmployeeSchema.index({ gender: 1 });
EmployeeSchema.index({ maritalStatus: 1 });

// Performance and review indexes
EmployeeSchema.index({ 'performanceReviews.date': -1 });
EmployeeSchema.index({ 'performanceReviews.rating': 1 });
EmployeeSchema.index({ 'achievements.date': -1 });
EmployeeSchema.index({ 'projects.startDate': -1 });
EmployeeSchema.index({ 'trainings.completionDate': -1 });

// Compound indexes for common queries
EmployeeSchema.index({ department: 1, status: 1, hireDate: -1 });
EmployeeSchema.index({ managerId: 1, status: 1 });
EmployeeSchema.index({ isDeleted: 1, status: 1, department: 1 });
