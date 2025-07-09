import { LogInDto } from '../dto/request/logIn.dto';
import { z } from 'zod';
import {BaseValidationPipe} from "src/package/api";


export class LogInValidationPipe extends BaseValidationPipe<LogInDto>{
  constructor() {
    const schema = z.object({
      email: z.string().email(),
      password: z.string()
    });
    super(schema);
  }
}