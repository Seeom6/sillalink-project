import { Injectable } from '@nestjs/common';
import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';
import { isMongoId } from "@Package/api/validation"

const UpdateProjectDto = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  members: z.array(isMongoId).optional().default([]),
  images: z.array(z.string()).optional().default([]),
  mainImage: z.string(),
  isFeatured: z.boolean().optional().default(false),
  link: z.string()
});

@Injectable()
export class UpdateProjectValidation extends BaseValidationPipe {
  constructor() {
    super(UpdateProjectDto);
  }
} 