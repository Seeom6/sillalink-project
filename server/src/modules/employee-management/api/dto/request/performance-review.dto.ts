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

export class CreatePerformanceReviewDto {
  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsMongoId()
  @IsNotEmpty()
  evaluatorId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  improvementAreas?: string;
}

export class UpdatePerformanceReviewDto {
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsMongoId()
  evaluatorId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsOptional()
  @IsString()
  improvementAreas?: string;
}
