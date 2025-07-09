import { BaseValidationPipe } from 'src/package/api';
import { z } from 'zod';
import { SingInDto } from '../dto/request/singIn.dto';


export class SingInValidationPipe extends BaseValidationPipe<SingInDto> {
  constructor() {
    const schema = z.object({
      firstName: z.string(),
      lastName: z.string(),
      email: z.string().email(),
      password: z.string(),
    })
    super(schema);
  }
}