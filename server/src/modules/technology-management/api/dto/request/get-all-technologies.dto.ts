import {
  IsOptional,
  IsNumber,
  IsString,
  IsBoolean,
  IsEnum,
  IsArray,
  Min,
  Max
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '../../../database/schemas/technology.schema';

export class GetAllTechnologiesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsEnum(TechnologyCategory)
  category?: TechnologyCategory;

  @IsOptional()
  @IsEnum(TechnologyStatus)
  status?: TechnologyStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim());
    }
    return value;
  })
  tags?: string[];

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
