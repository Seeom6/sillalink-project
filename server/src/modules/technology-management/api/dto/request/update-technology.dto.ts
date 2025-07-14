import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  IsUrl,
  Min,
  Max,
  ArrayMinSize,
  Length,
  IsDate
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TechnologyCategory, TechnologyStatus, DifficultyLevel } from '../../../database/schemas/technology.schema';

export class UpdateTechnologyDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 500)
  description?: string;

  @IsOptional()
  @IsString()
  @Length(50, 2000)
  longDescription?: string;

  @IsOptional()
  @IsEnum(TechnologyCategory)
  category?: TechnologyCategory;

  @IsOptional()
  @IsEnum(TechnologyStatus)
  status?: TechnologyStatus;

  @IsOptional()
  @IsEnum(DifficultyLevel)
  difficultyLevel?: DifficultyLevel;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsUrl()
  officialWebsite?: string;

  @IsOptional()
  @IsUrl()
  documentation?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(0)
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  relatedTechnologies?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  proficiencyLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedLearningHours?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prerequisites?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningResources?: string[];

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isFeatured?: boolean;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  version?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastUsed?: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  projectsUsedIn?: number;
}
