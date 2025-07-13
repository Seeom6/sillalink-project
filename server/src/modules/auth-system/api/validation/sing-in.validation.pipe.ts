import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { SingInDto } from '../dto/request/singIn.dto';

@Injectable()
export class SingInValidationPipe implements PipeTransform {
  transform(value: SingInDto, metadata: ArgumentMetadata) {
    if (!value.email || !value.password || !value.firstName || !value.lastName) {
      throw new Error('All fields are required');
    }
    return value;
  }
}
