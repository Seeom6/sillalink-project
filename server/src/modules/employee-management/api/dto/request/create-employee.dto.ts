import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  IsEmail,
  IsUrl,
  Min,
  Max,
  ArrayMinSize,
  Length,
  IsDate,
  IsPhoneNumber,
  IsMongoId,
  ValidateNested
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// Custom transform to convert empty strings to undefined
const EmptyStringToUndefined = () => Transform(({ value }) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }
  return value;
});
import {
  EmployeeDepartment,
  EmployeeStatus,
  EmploymentType,
  Gender,
  MaritalStatus,
  ContractType
} from '../../../database/schemas/employee.schema';

// Re-export enums to ensure they're available for validation
export { Gender, MaritalStatus, ContractType, EmployeeDepartment, EmployeeStatus, EmploymentType };

// Address DTO
export class AddressDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}

// Salary DTO
export class SalaryDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class CreateEmployeeDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  userId?: string;

  // Basic Information
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'gender must be one of the following values: male, female, other, prefer_not_to_say' })
  gender?: Gender;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date; // Keep for backward compatibility

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  nationalId?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  passportNumber?: string;

  @IsOptional()
  @IsEnum(MaritalStatus, { message: 'maritalStatus must be one of the following values: single, married, divorced, widowed' })
  maritalStatus?: MaritalStatus;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  phone?: string;

  // Contact Information
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  // Professional Information
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  position: string;

  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value === '' ? undefined : value)
  jobTitle?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  technologies?: string[];

  @IsEnum(EmployeeDepartment)
  department: EmployeeDepartment;

  @IsOptional()
  @IsEnum(EmploymentType)
  employmentType?: EmploymentType;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  hireDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  terminationDate?: Date; // Keep for backward compatibility

  @IsOptional()
  @IsMongoId({ message: 'managerId must be a valid MongoDB ID' })
  @Transform(({ value }) => value === '' ? undefined : value)
  managerId?: string;

  // Salary and Contract
  @IsOptional()
  @ValidateNested()
  @Type(() => SalaryDto)
  salaryDetails?: SalaryDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number; // Keep for backward compatibility

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  contractStartDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  contractEndDate?: Date;

  // Contact & Location
  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(({ value }) => value === '' ? undefined : value)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(({ value }) => value === '' ? undefined : value)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Transform(({ value }) => value === '' ? undefined : value)
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  emergencyPhone?: string;

  // Media & Assets
  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value === '' ? undefined : value)
  avatar?: string;

  // Additional Information
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Transform(({ value }) => value === '' ? undefined : value)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  certifications?: string[];

  @IsOptional()
  @IsUrl({}, { message: 'linkedinProfile must be a valid URL' })
  @Transform(({ value }) => value === '' ? undefined : value)
  linkedinProfile?: string;

  @IsOptional()
  @IsUrl({}, { message: 'githubProfile must be a valid URL' })
  @Transform(({ value }) => value === '' ? undefined : value)
  githubProfile?: string;

  @IsOptional()
  @IsUrl({}, { message: 'portfolioUrl must be a valid URL' })
  @Transform(({ value }) => value === '' ? undefined : value)
  portfolioUrl?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Transform(({ value }) => value === '' ? undefined : value)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  performanceRating?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastPerformanceReview?: Date;
}
