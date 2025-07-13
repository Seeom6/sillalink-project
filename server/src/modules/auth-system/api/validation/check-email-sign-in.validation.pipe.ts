import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CheckEmailSignIn implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value.email) {
      throw new Error('Email is required');
    }
    return value;
  }
}
