import { Injectable } from '@nestjs/common';
import { BaseValidationPipe } from 'src/package/api';
import { updateTechnologySchema } from './technology.validation';

@Injectable()
export class UpdateTechnologyValidation extends BaseValidationPipe<typeof updateTechnologySchema> {
  constructor() {
    super(updateTechnologySchema);
  }
}
