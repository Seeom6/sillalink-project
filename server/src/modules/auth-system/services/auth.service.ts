import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Connection } from 'mongoose';

import { HashService, UserPayload } from 'src/package/auth';
import { RedisService } from '@Package/cache/redis/redis.service';
import { generateOTP, MailService } from '@Package/services';
import { AppError } from '@Package/error/app.error';
import { SingInDto } from '../api/dto/request/singIn.dto';
import { LogInDto } from '../api/dto/request/logIn.dto';
import { UserService } from '../../user-management/services/user.service';
import { AuthError } from './auth.error';
import { ErrorCode } from "../../../common/error/error-code";
import { EnvironmentService } from "@Package/config";
import { v4 as uuidv4 } from "uuid"
import { IRefreshToken } from "@Package/auth/types/refresh-token.type";
import { RedisKeys } from "../../../common/redis.constant";
import { Response } from "express";
import { TokenConstant } from "../../../common/auth/token.constant";

@Injectable()
export class AuthService {
   constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
      private readonly authError: AuthError,
      private readonly redisService: RedisService,
      private readonly mailService: MailService,
      private readonly environmentService: EnvironmentService,
      @InjectConnection() private readonly connection: Connection
   ) { }

   public async signIn(userSignInInfo: SingInDto) {
      const isExist = await this.userService.findUserByEmail(userSignInInfo.email, false);
      if (isExist) {
         this.authError.throw(ErrorCode.USER_ALREADY_EXISTS);
      }
      const redisEmail = await this.redisService.get(`${RedisKeys.SingInEmail}:${userSignInInfo.email}`)
      if(!redisEmail || redisEmail !== userSignInInfo.email){
         this.authError.throw(ErrorCode.SIGN_IN_EMAIL_NOT_IN_REDIS)
      }

      let accessToken: string;
      let refresh: IRefreshToken;
      let refreshToken: string;
      const session = await this.connection.startSession()
      await session.withTransaction(async (session) => {
         const hashedPassword = await HashService.hashPassword(userSignInInfo.password);
         const user = await this.userService.createUser({
            email: userSignInInfo.email,
            password: hashedPassword,
            firstName: userSignInInfo.firstName,
            lastName: userSignInInfo.lastName
         },
            {
               session
            });

         const userPayload: UserPayload = {
            email: user.email,
            id: user._id.toString(),
            role: user.role
         };

         accessToken = this.jwtService.sign(userPayload);
         refresh = {
            userId: user._id.toString(),
         }
         const jwtId = uuidv4()

         refreshToken = this.jwtService.sign(refresh, { jwtid: jwtId, secret: this.environmentService.get("jwt.jwtAccessSecret"), expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh") });
         await this.redisService.set(
            `${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}:${jwtId}`,
            refreshToken,
            this.environmentService.get("jwt.ttlRefreshToken")
         );
         await this.redisService.del([`${RedisKeys.SingInEmail}:${userSignInInfo.email}`])
      })

      return {
         accessToken: accessToken,
         refreshToken: refreshToken,
      };
   }

   async checkEmailAndSendOtp(email: string) {
      const user = await this.userService.findUserByEmail(email, false);
      if (user) {
         this.authError.throw(ErrorCode.USER_ALREADY_EXISTS);
      }
      const otp = generateOTP();
      const jwtId = uuidv4()

      await this.redisService.set(`otp:${email}`, otp, this.environmentService.get("redis.otpTime") as number);
      await this.mailService.sendSingInOTP(email, otp);
      const userPayload = { email, otp }
      const expiredDate = this.environmentService.get("jwt.jwtCheckEmailExpiredToken")
      const token = this.jwtService.sign(userPayload, { expiresIn: expiredDate })
      return {
         token
      }
   }

   async logIn(logInInfo: LogInDto, res: Response) {
      const user = await this.userService.findUserByEmail(logInInfo.email, true, true);
      if (!user) {
         this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
      }

      const isPasswordValid = await HashService.comparePassword(logInInfo.password, user.password);
      if (!isPasswordValid) {
         this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
      }

      const userPayload: UserPayload = {
         email: user.email,
         id: user._id.toString(),
         role: user.role
      };

      const accessToken = this.jwtService.sign(userPayload);
      const jwtId = uuidv4();
      const refresh: IRefreshToken = {
         userId: user._id.toString(),
      }

      const refreshToken = this.jwtService.sign(refresh, { 
         jwtid: jwtId, 
         secret: this.environmentService.get("jwt.jwtAccessSecret"), 
         expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh") 
      });

      await this.redisService.set(
         `${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}:${jwtId}`,
         refreshToken,
         this.environmentService.get("jwt.ttlRefreshToken")
      );

      res.cookie(RedisKeys.REFRESH_TOKEN, refreshToken, {httpOnly: true});

      return {
         accessToken,
         refreshToken,
         user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
         }
      };
   }

   async initiateRegistration(firstName: string, lastName: string, email: string, phone?: string) {
      const existingUser = await this.userService.findUserByEmail(email, false);
      if (existingUser) {
         this.authError.throw(ErrorCode.USER_ALREADY_EXISTS);
      }

      // Check if phone number is already in use (if provided)
      if (phone) {
         const existingUserWithPhone = await this.userService.findUserByPhone(phone, false);
         if (existingUserWithPhone) {
            this.authError.throw(ErrorCode.PHONE_ALREADY_EXISTS);
         }
      }

      const otp = generateOTP();
      await this.redisService.set(`registration_otp:${email}`, otp, 600); // 10 minutes

      const registrationData = { firstName, lastName, email, ...(phone && { phone }) };
      await this.redisService.set(`registration_data:${email}`, registrationData, 600);

      await this.mailService.sendRegistrationOTP(email, otp, firstName);

      return { message: 'OTP sent to email' };
   }

   async verifyRegistrationOtp(email: string, otp: string) {
      const storedOtp = await this.redisService.get(`registration_otp:${email}`);

      // Convert both to strings for comparison to handle type mismatches
      if (!storedOtp || String(storedOtp) !== String(otp)) {
         this.authError.throw(ErrorCode.INVALID_OTP);
      }

      await this.redisService.del([`registration_otp:${email}`]);
      return { message: 'OTP verified successfully' };
   }

   async completeRegistration(email: string, password: string) {
      const registrationData = await this.redisService.get(`registration_data:${email}`);
      if (!registrationData) {
         this.authError.throw(ErrorCode.REGISTRATION_DATA_EXPIRED);
      }

      const userData = registrationData;

      // Double-check phone number availability if provided
      if (userData.phone) {
         const existingUserWithPhone = await this.userService.findUserByPhone(userData.phone, false);
         if (existingUserWithPhone) {
            this.authError.throw(ErrorCode.PHONE_ALREADY_EXISTS);
         }
      }

      const hashedPassword = await HashService.hashPassword(password);

      const user = await this.userService.createUser({
         ...userData,
         password: hashedPassword,
         isActive: true
      });

      await this.redisService.del([`registration_data:${email}`]);

      const userPayload: UserPayload = {
         email: user.email,
         id: user._id.toString(),
         role: user.role
      };

      const accessToken = this.jwtService.sign(userPayload);
      const jwtId = uuidv4();
      const refresh: IRefreshToken = {
         userId: user._id.toString(),
      }

      const refreshToken = this.jwtService.sign(refresh, { 
         jwtid: jwtId, 
         secret: this.environmentService.get("jwt.jwtAccessSecret"), 
         expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh") 
      });

      await this.redisService.set(
         `${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}:${jwtId}`,
         refreshToken,
         this.environmentService.get("jwt.ttlRefreshToken")
      );

      return {
         accessToken,
         refreshToken
      };
   }

   async verifyOtp(email: string, otp: string) {
      const storedOtp = await this.redisService.get(`otp:${email}`);
      if (!storedOtp || String(storedOtp) !== String(otp)) {
         this.authError.throw(ErrorCode.INVALID_OTP);
      }

      await this.redisService.del([`otp:${email}`]);
      
      const user = await this.userService.findUserByEmail(email);
      const userPayload: UserPayload = {
         email: user.email,
         id: user._id.toString(),
         role: user.role
      };

      const accessToken = this.jwtService.sign(userPayload);
      return { accessToken };
   }

   async verifyResetOtp(email: string, otp: string) {
      const storedOtp = await this.redisService.get(`reset_otp:${email}`);
      if (!storedOtp || String(storedOtp) !== String(otp)) {
         this.authError.throw(ErrorCode.INVALID_OTP);
      }

      return { message: 'Reset OTP verified' };
   }

   async resetPassword(email: string, newPassword: string) {
      const hashedPassword = await HashService.hashPassword(newPassword);
      await this.userService.updateUserByEmail(email, { password: hashedPassword });
      await this.redisService.del([`reset_otp:${email}`]);
      
      return { message: 'Password reset successfully' };
   }

   async refreshToken(payload: IRefreshToken, res: Response) {
      const user = await this.userService.findById(payload.userId);
      
      const userPayload: UserPayload = {
         email: user.email,
         id: user._id.toString(),
         role: user.role
      };

      const accessToken = this.jwtService.sign(userPayload);
      const jwtId = uuidv4();
      const refresh: IRefreshToken = {
         userId: user._id.toString(),
      }

      const refreshToken = this.jwtService.sign(refresh, { 
         jwtid: jwtId, 
         secret: this.environmentService.get("jwt.jwtAccessSecret"), 
         expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh") 
      });

      await this.redisService.set(
         `${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}:${jwtId}`,
         refreshToken,
         this.environmentService.get("jwt.ttlRefreshToken")
      );

      return {
         accessToken,
         refreshToken
      };
   }

   async logOut(payload: IRefreshToken, res: Response) {
      await this.redisService.del([`${RedisKeys.REFRESH_TOKEN}:${payload.userId}`]);
      res.clearCookie(RedisKeys.REFRESH_TOKEN);
      return { message: 'Logged out successfully' };
   }
}
