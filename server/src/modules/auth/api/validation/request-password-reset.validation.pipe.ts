import { Injectable } from '@nestjs/common';
import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';

const RequestPasswordResetDto = z.object({
    email: z.string().email(),
});

@Injectable()
export class RequestPasswordResetValidationPipe extends BaseValidationPipe {
    constructor() {
        super(RequestPasswordResetDto);
    }
} 