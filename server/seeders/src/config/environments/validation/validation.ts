import { EnumEnvironment } from '../interfaces/env.enum';
import { devValidationSchema } from './dev.validation';
import { getCurrentEnv } from '../environment.service';
const validationSchemaEvn = ()=>{
  const env = getCurrentEnv()
  switch(env){
    case EnumEnvironment.DEV :
      return devValidationSchema
    default:
      return devValidationSchema
  }
}