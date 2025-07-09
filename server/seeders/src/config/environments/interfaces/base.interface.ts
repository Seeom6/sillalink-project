import { IAppEnv } from './app.interface';
import { IDatabaseEnv } from './database.inteface';
export interface IBaseEnv {
  app: IAppEnv,
  database?: IDatabaseEnv
}