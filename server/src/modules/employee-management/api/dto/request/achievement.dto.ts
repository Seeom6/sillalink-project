import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAchievementDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsOptional()
  @IsString()
  recognizedBy?: string;

  @IsOptional()
  @IsString()
  impact?: string;
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  recognizedBy?: string;

  @IsOptional()
  @IsString()
  impact?: string;
}
