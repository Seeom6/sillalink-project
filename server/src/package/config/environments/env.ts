import * as process from 'node:process';
import { IDatabaseEnv } from './interfaces/database.inteface';
import { IAppEnv } from './interfaces/app.interface';
import { IBaseEnv } from './interfaces/base.interface';
import { IJWTEnv } from '@Package/config/environments/interfaces/jwt.interface';
import { MailConfig } from './interfaces/email.interface';
import { IRedisEnv } from './interfaces/redis.interface';
import { IFileEnv } from './interfaces/file.interface';
export interface IEnv extends IBaseEnv {
  app: IAppEnv,
  mongodb: IDatabaseEnv;
  jwt: IJWTEnv;
  mail: MailConfig
  redis: IRedisEnv
  file: IFileEnv
}

export const GetEnv = (): IEnv => ({
app: {
    host: process.env.HOST,
    name: process.env.NAME,
    port: +process.env.PORT,
    baseUrl: process.env.BASE_URL,
    version: process.env.VERSION
  },
  mongodb: {
    host: process.env.MONGODB_HOST,
    port: +process.env.MONGODB_PORT,
    password: process.env.MONGODB_PASSWORD,
    username: process.env.MONGODB_USERNAME,
    name: process.env.MONGODB_NAME,
  },
  jwt: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiredRefresh: process.env.JWT_EXPIRED_REFRESH,
    jwtExpiredAccess: process.env.JWT_EXPIRED_ACCESS,
    ttlRefreshToken: +process.env.REFRESH_TOKEN_REDIS_EXPIERD,
    jwtCheckEmailExpiredToken: process.env.JWT_CHECK_EMAIL_EXPIRED,
  },
  mail: {
    host: process.env.MAIL_HOST, 
    port: +process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASS,
    from: process.env.MAIL_FROM_NAME,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
    databaseIndex: +process.env.REDIS_DATABASE_INDEX,
    password: process.env.REDIS_PASSWORD,
    name: process.env.REDIS_NAME,
    otpTime: +process.env.OTP_TIME
  },
  file: {
    maxFileSize: +process.env.MAX_FILE_SIZE,
    baseUrl: process.env.BASE_URL,
  }
})


