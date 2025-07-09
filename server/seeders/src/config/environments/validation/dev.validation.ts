import * as joi from 'joi'
import { IDevEnv } from '../environments/dev.env';
import {loadEnv} from "../environment.service";
import { IDatabaseEnv } from '../interfaces/database.inteface';
import { IAppEnv } from '../interfaces/app.interface';

export const devValidationSchema =()=>{
  const schema =joi.object<IDevEnv>({
    app: joi.object<IAppEnv>({
      port: joi.number().required(),
      host: joi.string().required(),
      name: joi.string().required()
    }).required(),
    mongodb: joi.object<IDatabaseEnv>({
      host: joi.string().required(),
      port: joi.number().required(),
      password: joi.string().required(),
      username: joi.string().required(),
      name: joi.string().required(),
    }).required(),
  })
  console.log(schema.validate(loadEnv()))
  return schema;
}


