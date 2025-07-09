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
import { UserService } from '@Modules/user';
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
            ...userSignInInfo,
            password: hashedPassword
         },
            {
               session
            });

         const userPayload: UserPayload = {
            email: user.email,
            id: user.id,
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
   async logIn(logInInfo: LogInDto, res?: any) {
      console.log('🔍 DEBUG: Login attempt for email:', logInInfo.email);
      const user = await this.userService.findUserByEmail(logInInfo.email, false);

      if (!user) {
         console.log('❌ DEBUG: User not found for email:', logInInfo.email);
         this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
      }

      console.log('✅ DEBUG: User found:', { id: user._id, email: user.email, hasPassword: !!user.password, role: user.role });

      const isPasswordValid = await HashService.comparePassword(
         logInInfo.password,
         user.password
      );

      console.log('🔐 DEBUG: Password comparison result:', isPasswordValid);

      if (!isPasswordValid) {
         console.log('❌ DEBUG: Password validation failed');
         this.authError.throw(ErrorCode.INVALID_CREDENTIALS);
      }

      const userPayload: UserPayload = {
         email: user.email,
         id: user.id,
         role: user.role
      };

      const jwtId = uuidv4()

      const refresh: IRefreshToken = {
         userId: user._id.toString(),
      }
      const tokens = await this.redisService.getByPattern(`${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}`)
      if (tokens.elements.length + 1 > TokenConstant.MAX_USER_TOKEN_COUNT) {
         const olderToken = await this.getOldTokenInRedis(tokens.elements)
         await this.redisService.del([olderToken.token])
      }
      const accessToken = this.jwtService.sign(userPayload);
      const refreshToken = this.jwtService.sign(refresh, { jwtid: jwtId, secret: this.environmentService.get("jwt.jwtAccessSecret"), expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh") });
      await this.redisService.set(
         `${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}:${jwtId}`,
         refreshToken,
         this.environmentService.get("jwt.ttlRefreshToken")
      );

      // Set HTTP-only cookies if response object is available
      if (res) {
         // Set access token cookie
         res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
         });

         // Set refresh token cookie
         res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/',
         });
      }

      return {
         accessToken: accessToken,
         refreshToken: refreshToken,
         user: {
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
         },
      };
   }

   async verifyOtp(email: string, otp: string) {
      const storedOtp = await this.redisService.get<string>(`otp:${email}`);
      if (!storedOtp) {
         this.authError.throw(ErrorCode.OTP_EXPIRED);
      }
      if (`${storedOtp}` !== `${otp}`) {
         this.authError.throw(ErrorCode.INVALID_OTP);
      }

      await this.redisService.del([`otp:${email}`]);
      const userPayload = {
         email: email,
         isVerified: true
      }
      const expiredDate = this.environmentService.get("jwt.jwtCheckEmailExpiredToken")
      const accessToken = this.jwtService.sign(userPayload, { expiresIn: expiredDate });
      await this.redisService.set(`${RedisKeys.SingInEmail}:${email}`, email, +expiredDate)
      return { accessToken };
   }

   async requestPasswordReset(email: string): Promise<{ message: string; token: string }> {
      const user = await this.userService.findUserByEmail(email, false);

      const token = this.jwtService.sign(
         { email, type: 'password_reset' },
         { expiresIn: '15m' }
      );

      await this.redisService.set(`${RedisKeys.RESET_PASSWORD_OTP}:${email}`, token, 900);
      await this.mailService.sendPasswordResetEmail(email, token);

      return {
         message: 'If an account exists with this email, you will receive a password reset email',
         token
      };
   }

   async verifyResetOtp(email: string, otp: string): Promise<{ message: string; token: string }> {
      const storedOtp = await this.redisService.get<string>(`${RedisKeys.RESET_PASSWORD_OTP}:${email}`);
      if (!storedOtp) {
         this.authError.throw(ErrorCode.OTP_EXPIRED);
      }

      if (storedOtp !== otp) {
         this.authError.throw(ErrorCode.INVALID_OTP);
      }

      const resetToken = this.jwtService.sign(
         { email, type: 'password_reset' },
         { expiresIn: '15m' }
      );

      await this.redisService.del([`${RedisKeys.RESET_PASSWORD_OTP}:${email}`]);

      return {
         message: 'OTP verified successfully',
         token: resetToken
      };
   }

   async resetPassword(email: string, newPassword: string): Promise<{ message: string }> {
      try {
         const hashedPassword = await HashService.hashPassword(newPassword);
         await this.userService.updateUserByEmail(email, { password: hashedPassword });
         return { message: 'Password has been reset successfully' };
      } catch (error) {
         if (error instanceof AppError) {
            throw error;
         }
         this.authError.throw(ErrorCode.OTP_VERIFICATION_FAILED);
      }
   }

   async refreshToken(payload: IRefreshToken, res: Response) {
      const refreshRedisToken = await this.redisService.get<string>(`${RedisKeys.REFRESH_TOKEN}:${payload.userId}:${payload.jti}`)
      if (!refreshRedisToken) {
         this.authError.throw(ErrorCode.REFRESH_TOKEN_NOT_IN_REDIS);
      }

      const decodeToken: IRefreshToken = await this.jwtService.decode(refreshRedisToken);
      if (decodeToken.jti !== payload.jti) {
         await this.redisService.del([`${RedisKeys.REFRESH_TOKEN}:${payload.userId}`])
         res.cookie(`${RedisKeys.REFRESH_TOKEN}`, null)
         this.authError.throw(ErrorCode.INVALID_TOKEN);
      }

      const user = await this.userService.findById(payload.userId);

      const userPayload: UserPayload = {
         email: user.email,
         id: user.id,
         role: user.role
      };

      const jwtId = uuidv4()

      const refresh: IRefreshToken = {
         userId: user._id.toString(),
      }

      const accessToken = this.jwtService.sign(userPayload);
      const refreshToken = this.jwtService.sign(refresh, {
         jwtid: jwtId,
         secret: this.environmentService.get("jwt.jwtRefreshSecret"),
         expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh")
      });
      await this.redisService.del([`${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}`])
      await this.redisService.set(`${RedisKeys.REFRESH_TOKEN}:${user._id.toString()}`, refreshToken);
      return { accessToken, refreshToken: refreshToken };
   }

   async logOut(payload: IRefreshToken, res: Response) {
      const refreshRedisToken = await this.redisService.get<string>(`${RedisKeys.REFRESH_TOKEN}:${payload.userId}:${payload.jti}`)
      if (!refreshRedisToken) {
         this.authError.throw(ErrorCode.REFRESH_TOKEN_NOT_IN_REDIS);
      }
      const decodeToken: IRefreshToken = await this.jwtService.decode(refreshRedisToken);
      const result = await this.redisService.getByPattern(`${RedisKeys.REFRESH_TOKEN}:${payload.userId}`)
      await this.getOldTokenInRedis(result.elements)
      if (decodeToken.jti !== payload.jti) {
         const result = await this.redisService.getByPattern(`${RedisKeys.REFRESH_TOKEN}:${payload.userId}`)
         await this.redisService.del(result.elements)
         await this.redisService.del([`${RedisKeys.REFRESH_TOKEN}:${payload.userId}`])
         res.cookie(`${RedisKeys.REFRESH_TOKEN}`, null)
         this.authError.throw(ErrorCode.INVALID_TOKEN);
      }
      await this.redisService.del([`${RedisKeys.REFRESH_TOKEN}:${payload.userId}:${payload.jti}`])
      return;

   }

   private async getOldTokenInRedis(keys: string[]): Promise<{ token: string, ttl: number }> {
      const ttls = await Promise.all(keys.map(async (key) => {
         const ttl = await this.redisService.ttl(key)
         return {
            token: key,
            ttl: ttl
         }
      }))
      ttls.sort((a, b) => a.ttl - b.ttl)
      return ttls[0];
   }

   // Registration Methods
   async initiateRegistration(firstName: string, lastName: string, email: string) {
      // Check if user already exists
      const existingUser = await this.userService.findUserByEmail(email, false);
      if (existingUser) {
         this.authError.throw(ErrorCode.USER_ALREADY_EXISTS);
      }

      // Check for registration rate limiting per email
      const registrationAttemptKey = `registration_attempts:${email}`;
      const registrationAttempts = await this.redisService.get(registrationAttemptKey) || 0;

      if (registrationAttempts >= 10) { // Increased from 3 to 10 for testing
         this.authError.throw(ErrorCode.TOO_MANY_ATTEMPTS);
      }

      // Check if there's already a pending registration for this email
      const existingRegistration = await this.redisService.get(`registration_data:${email}`);
      if (existingRegistration) {
         // Allow resending OTP but increment attempt counter
         await this.redisService.set(registrationAttemptKey, registrationAttempts + 1, 3600); // 1 hour
      }

      // Generate OTP
      const otp = generateOTP();
      const jwtId = uuidv4();

      // Store OTP in Redis with 5-minute expiration
      await this.redisService.set(`registration_otp:${email}`, otp, this.environmentService.get("redis.otpTime") as number);

      // Store registration data temporarily
      const registrationData = { firstName, lastName, email };
      await this.redisService.set(`registration_data:${email}`, registrationData, this.environmentService.get("redis.otpTime") as number);

      // Increment registration attempts if this is a new registration
      if (!existingRegistration) {
         await this.redisService.set(registrationAttemptKey, registrationAttempts + 1, 3600); // 1 hour
      }

      // Send OTP email
      await this.mailService.sendRegistrationOTP(email, otp, firstName);

      // Create JWT token for email verification
      const userPayload = { email, type: 'registration' };
      const expiredDate = this.environmentService.get("jwt.jwtCheckEmailExpiredToken");
      const token = this.jwtService.sign(userPayload, { expiresIn: expiredDate });

      return { token };
   }

   async verifyRegistrationOtp(email: string, otp: string) {
      // Check for rate limiting on OTP attempts
      const attemptKey = `otp_attempts:${email}`;
      const attempts = await this.redisService.get(attemptKey) || 0;

      if (attempts >= 5) {
         this.authError.throw(ErrorCode.TOO_MANY_ATTEMPTS);
      }

      // Get OTP from Redis
      const storedOtp = await this.redisService.get(`registration_otp:${email}`);
      console.log(`OTP Verification - Email: ${email}, Stored OTP: ${storedOtp}, Provided OTP: ${otp}`);
      if (!storedOtp) {
         this.authError.throw(ErrorCode.OTP_EXPIRED);
      }

      if (String(storedOtp) !== String(otp)) {
         // Increment failed attempts
         console.log(`OTP mismatch - Stored: "${storedOtp}" (${typeof storedOtp}), Provided: "${otp}" (${typeof otp})`);
         await this.redisService.set(attemptKey, attempts + 1, 900); // 15 minutes
         this.authError.throw(ErrorCode.INVALID_OTP);
      }

      // Mark email as verified
      await this.redisService.set(`email_verified:${email}`, 'true', 1800); // 30 minutes

      // Remove OTP and attempts from Redis
      await this.redisService.del([`registration_otp:${email}`, attemptKey]);

      return { message: 'Email verified successfully' };
   }

   async completeRegistration(email: string, password: string) {
      console.log('DEBUG: Starting completeRegistration for email:', email);

      // Check if email is verified
      console.log('DEBUG: Checking email verification');
      const emailVerified = await this.redisService.get(`email_verified:${email}`);
      if (!emailVerified) {
         this.authError.throw(ErrorCode.EMAIL_NOT_VERIFIED);
      }
      console.log('DEBUG: Email verified successfully');

      // Get registration data
      console.log('DEBUG: Getting registration data');
      const registrationDataStr = await this.redisService.get(`registration_data:${email}`);
      if (!registrationDataStr) {
         this.authError.throw(ErrorCode.REGISTRATION_DATA_EXPIRED);
      }
      console.log('DEBUG: Registration data retrieved');

      const registrationData = registrationDataStr;
      console.log('DEBUG: Parsed registration data:', registrationData);

      // Check if user already exists (double check)
      console.log('DEBUG: Checking if user already exists');
      const existingUser = await this.userService.findUserByEmail(email, false);
      if (existingUser) {
         this.authError.throw(ErrorCode.USER_ALREADY_EXISTS);
      }
      console.log('DEBUG: User does not exist, proceeding');

      console.log('DEBUG: Starting database session');
      const session = await this.connection.startSession();
      let accessToken: string;
      let refreshToken: string;

      await session.withTransaction(async (session) => {
         console.log('DEBUG: Starting transaction');
         // Hash password
         console.log('DEBUG: About to hash password');
         const hashedPassword = await HashService.hashPassword(password);
         console.log('DEBUG: Password hashed successfully');

         // Create user
         console.log('DEBUG: About to create user with data:', {
            firstName: registrationData.firstName,
            lastName: registrationData.lastName,
            email: email,
            hasPassword: !!hashedPassword,
            isActive: true
         });

         const newUser = await this.userService.createUser({
            firstName: registrationData.firstName,
            lastName: registrationData.lastName,
            email: email,
            password: hashedPassword,
            isActive: true
         }, { session });

         console.log('DEBUG: User created successfully:', {
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName
         });

         // Generate tokens
         const userPayload: UserPayload = {
            id: newUser._id.toString(),
            email: newUser.email,
            role: newUser.role
         };

         const jwtId = uuidv4();
         const refresh: IRefreshToken = {
            userId: newUser._id.toString(),
         };

         accessToken = this.jwtService.sign(userPayload);
         refreshToken = this.jwtService.sign(refresh, {
            jwtid: jwtId,
            secret: this.environmentService.get("jwt.jwtAccessSecret"),
            expiresIn: this.environmentService.get("jwt.jwtExpiredRefresh")
         });

         // Store refresh token in Redis
         console.log('DEBUG: Storing refresh token in Redis');
         await this.redisService.set(
            `${RedisKeys.REFRESH_TOKEN}:${newUser._id.toString()}:${jwtId}`,
            refreshToken,
            this.environmentService.get("jwt.ttlRefreshToken")
         );

         console.log('DEBUG: Transaction completed successfully');
      });

      console.log('DEBUG: Transaction committed, cleaning up Redis data');

      // Clean up Redis data
      await this.redisService.del([
         `email_verified:${email}`,
         `registration_data:${email}`
      ]);

      console.log('DEBUG: Registration process completed successfully');

      return {
         accessToken,
         refreshToken
      };
   }
}
