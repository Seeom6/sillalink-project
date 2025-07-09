import * as process from 'node:process';
import { IDatabaseEnv } from '../interfaces/database.inteface';
import { IAppEnv } from '../interfaces/app.interface';
import { IBaseEnv } from '../interfaces/base.interface';

export interface IDevEnv extends IBaseEnv {
  app: IAppEnv,
  mongodb: IDatabaseEnv;
}

export const GetDevEnv = (): IDevEnv => ({
  app: {
    host: process.env.HOST,
    name: process.env.NAME,
    port: +process.env.PORT
  },
  mongodb: {
    host: process.env.MONGODB_HOST,
    port: +process.env.MONGODB_PORT,
    password: process.env.MONGODB_PASSWORD,
    username: process.env.MONGODB_USERNAME,
    name: process.env.MONGODB_NAME,
    replicaSet: process.env.MONGODB_REPLICA_SET
  }
})


