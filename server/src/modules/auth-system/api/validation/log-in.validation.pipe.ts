import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { LogInDto } from '../dto/request/logIn.dto';

@Injectable()
export class LogInValidationPipe implements PipeTransform {
  transform(value: LogInDto, metadata: ArgumentMetadata) {
    // Basic validation - you can enhance this with proper validation library
    if (!value.email || !value.password) {
      throw new Error('Email and password are required');
    }
    return value;
  }
}
