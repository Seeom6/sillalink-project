import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsDate,
  Min,
  Max,
  IsMongoId
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateEmployeeProjectDto {
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  projectTechnologies?: string[];

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsString()
  outcomes?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  contributionPercentage?: number;
}

export class UpdateEmployeeProjectDto {
  @IsOptional()
  @IsMongoId()
  projectId?: string;

  @IsOptional()
  @IsString()
  projectName?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  projectTechnologies?: string[];

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsString()
  outcomes?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  contributionPercentage?: number;
}
