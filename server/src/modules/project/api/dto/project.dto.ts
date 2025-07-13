import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsDateString,
  IsNumber,
  IsBoolean,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  IsMongoId,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ProjectStatus, ProjectPriority, TaskStatus, TaskPriority } from '../../database/project.schema';

export class CreateTaskDto {
  @IsString()
  @MinLength(2, { message: 'Task name must be at least 2 characters long' })
  @MaxLength(200, { message: 'Task name must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Task description must not exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsMongoId({ message: 'Assignee must be a valid MongoDB ID' })
  assignee?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date' })
  dueDate?: string;

  @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
  status: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Priority must be a valid task priority' })
  priority: TaskPriority;

  @IsOptional()
  @IsString()
  createdBy?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Task name must be at least 2 characters long' })
  @MaxLength(200, { message: 'Task name must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Task description must not exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsMongoId({ message: 'Assignee must be a valid MongoDB ID' })
  assignee?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Due date must be a valid date' })
  dueDate?: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Status must be a valid task status' })
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Priority must be a valid task priority' })
  priority?: TaskPriority;
}

export class CreateProjectDto {
  @IsString()
  @MinLength(2, { message: 'Project name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Project name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Maximum 10 images allowed' })
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'External link must be a valid URL' })
  @Transform(({ value }) => value?.trim())
  externalLink?: string;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Cost must be a valid number' })
  @Min(0, { message: 'Cost must be a positive number' })
  @Type(() => Number)
  cost?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'Maximum 20 employees can be assigned' })
  @IsMongoId({ each: true, message: 'Each assigned employee must be a valid MongoDB ID' })
  assignedEmployees?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50, { message: 'Maximum 50 technologies can be assigned' })
  @IsMongoId({ each: true, message: 'Each technology must be a valid MongoDB ID' })
  technologiesUsed?: string[];

  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status: ProjectStatus;

  @IsEnum(ProjectPriority, { message: 'Priority must be a valid project priority' })
  priority: ProjectPriority;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50, { message: 'Maximum 50 tasks can be created initially' })
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks?: CreateTaskDto[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Project name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Project name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10, { message: 'Maximum 10 images allowed' })
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'External link must be a valid URL' })
  @Transform(({ value }) => value?.trim())
  externalLink?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid date' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid date' })
  endDate?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Cost must be a valid number' })
  @Min(0, { message: 'Cost must be a positive number' })
  @Type(() => Number)
  cost?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20, { message: 'Maximum 20 employees can be assigned' })
  @IsMongoId({ each: true, message: 'Each assigned employee must be a valid MongoDB ID' })
  assignedEmployees?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50, { message: 'Maximum 50 technologies can be assigned' })
  @IsMongoId({ each: true, message: 'Each technology must be a valid MongoDB ID' })
  technologiesUsed?: string[];

  @IsOptional()
  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority, { message: 'Priority must be a valid project priority' })
  priority?: ProjectPriority;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  updatedBy?: string;
}

export class ProjectQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  search?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsOptional()
  @IsMongoId({ message: 'Assigned employee must be a valid MongoDB ID' })
  assignedEmployee?: string;

  @IsOptional()
  @IsMongoId({ message: 'Technology must be a valid MongoDB ID' })
  technology?: string;

  @IsOptional()
  @IsDateString()
  startDateFrom?: string;

  @IsOptional()
  @IsDateString()
  startDateTo?: string;

  @IsOptional()
  @IsDateString()
  endDateFrom?: string;

  @IsOptional()
  @IsDateString()
  endDateTo?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costMax?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isFeatured?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}

export class BulkDeleteProjectsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one project ID is required' })
  @ArrayMaxSize(50, { message: 'Maximum 50 projects can be deleted at once' })
  @IsMongoId({ each: true, message: 'Each project ID must be a valid MongoDB ID' })
  ids: string[];
}

export class BulkUpdateStatusDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'At least one project ID is required' })
  @ArrayMaxSize(50, { message: 'Maximum 50 projects can be updated at once' })
  @IsMongoId({ each: true, message: 'Each project ID must be a valid MongoDB ID' })
  ids: string[];

  @IsEnum(ProjectStatus, { message: 'Status must be a valid project status' })
  status: ProjectStatus;
}
