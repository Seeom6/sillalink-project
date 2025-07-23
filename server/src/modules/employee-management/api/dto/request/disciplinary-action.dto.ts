import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  IsEnum,
  IsMongoId,
  IsBoolean
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export enum DisciplinarySeverity {
  WARNING = 'warning',
  SUSPENSION = 'suspension',
  TERMINATION = 'termination'
}

export class CreateDisciplinaryActionDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  actionTaken: string;

  @IsEnum(DisciplinarySeverity)
  severity: DisciplinarySeverity;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedDate?: Date;

  @IsMongoId()
  @IsNotEmpty()
  issuedBy: string;

  @IsOptional()
  @IsString()
  employeeResponse?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isResolved?: boolean;

  @IsOptional()
  @IsString()
  followUpActions?: string;
}

export class UpdateDisciplinaryActionDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  actionTaken?: string;

  @IsOptional()
  @IsEnum(DisciplinarySeverity)
  severity?: DisciplinarySeverity;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedDate?: Date;

  @IsOptional()
  @IsMongoId()
  issuedBy?: string;

  @IsOptional()
  @IsString()
  employeeResponse?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isResolved?: boolean;

  @IsOptional()
  @IsString()
  followUpActions?: string;
}
