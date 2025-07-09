import {BaseValidationPipe} from "@Package/api";
import {z} from 'zod';

export class UpdateServiceValidation extends BaseValidationPipe {
  constructor() {
    const schema = z.object({
      name: z.string(),
      description: z.string(),
      image: z.string(),
    })
    super(schema);
  }
}