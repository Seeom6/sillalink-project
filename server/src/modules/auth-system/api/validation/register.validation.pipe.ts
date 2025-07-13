import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { RegisterDto } from '../dto/request/register.dto';

@Injectable()
export class RegisterValidationPipe implements PipeTransform {
  transform(value: RegisterDto, metadata: ArgumentMetadata) {
    if (!value.email || !value.firstName || !value.lastName) {
      throw new BadRequestException('Email, first name, and last name are required');
    }

    // Validate phone number if provided
    if (value.phone && value.phone.trim()) {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(value.phone)) {
        throw new BadRequestException('Invalid phone number format. Use international format (e.g., +1234567890)');
      }
    }

    return value;
  }
}
