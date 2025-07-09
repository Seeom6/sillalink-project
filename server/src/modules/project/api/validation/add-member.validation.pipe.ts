import { Injectable } from '@nestjs/common';
import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';

const AddMemberDto = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
});

@Injectable()
export class AddMemberValidationPipe extends BaseValidationPipe<typeof AddMemberDto> {
  constructor() {
    super(AddMemberDto);
  }
} 