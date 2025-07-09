import { Injectable } from '@nestjs/common';
import { BaseValidationPipe } from 'src/package/api';
import { createTechnologySchema } from './technology.validation';

@Injectable()
export class CreateTechnologyValidation extends BaseValidationPipe<typeof createTechnologySchema> {
  constructor() {
    super(createTechnologySchema);
  }
}
